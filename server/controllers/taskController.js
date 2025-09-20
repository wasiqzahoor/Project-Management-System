const Task = require('../models/Task');
const Project = require('../models/Project');
const mongoose = require('mongoose');
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, search } = req.query;

    let query = { project: projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, deadline, assignedTo, status } = req.body; // status ko bhi get karein

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // ======================= YEH NAYA PERMISSION CHECK ADD HUA HAI =======================
    const userIsOwner = project.owner.toString() === req.user.id;
    const userIsMember = project.members.includes(req.user.id);

    // Agar user na owner hai aur na hi member, to usay rok dein
    if (!userIsOwner && !userIsMember) {
      return res.status(403).json({ message: 'Not authorized to add tasks to this project' });
    }
    // =====================================================================================

    const task = await Task.create({
      title,
      description,
      project: projectId,
      priority,
      status, // status ko bhi save karein
      deadline,
      assignedTo,
      createdBy: req.user.id
    });

    await task.populate('assignedTo createdBy', 'name email');

    // Room mein maujood sab users ko event bhejein
    req.io.to(projectId).emit('task_created', task);

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo createdBy', 'name email');

    req.io.to(updatedTask.project.toString()).emit('task_updated', updatedTask);

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body; // order ki zaroorat nahi
    const { id } = req.params;   // Task ID
    const userId = req.user.id;  // Logged-in user ki ID

    // 1. Task dhoondein
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Task se project dhoondein
    const project = await Project.findById(task.project);
    if (!project) {
        return res.status(404).json({ message: 'Associated project not found' });
    }
    
    // 3. <<-- YEH NAYA SECURITY CHECK HAI -->>
    // Check karein ke logged-in user project ka owner hai ya nahi
    if (project.owner.toString() !== userId) {
        return res.status(403).json({ message: 'Forbidden: Only the project owner can change the task status.' });
    }

    // 4. Agar user owner hai, to task update karein
    task.status = status;
    await task.save();
    
    // 5. Baaqi users ko real-time update bhejein
    const updatedTask = await Task.findById(id).populate('assignedTo createdBy', 'name email');
    const projectId = task.project.toString();
    req.io.to(projectId).emit('task_status_updated', updatedTask);
    
    res.json({ success: true, task: updatedTask });

  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

     req.io.to(task.project.toString()).emit('task_deleted', { id: task._id, project: task.project, title: task.title });

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    task.attachments.push(attachment);
    await task.save();

    req.io.to(task.project.toString()).emit('task_attachment_added', task);

    res.json({ success: true, attachment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUserTasks = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Step 1: User ke saare project IDs hasil karein
    const userProjects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).select('_id');

    const projectIds = userProjects.map(p => p._id);

    // Step 2: Ab Task collection se shuru karein
    const tasks = await Task.aggregate([
      // Stage 1: Sirf un tasks ko match karein jo user ke projects se belong karte hain
      {
        $match: {
          project: { $in: projectIds }
        }
      },
      // Stage 2: 'projects' collection se data join (lookup) karein
      {
        $lookup: {
          from: 'projects', // 'projects' collection ka naam
          localField: 'project',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      // Stage 3: $lookup ek array return karta hai, usay object mein convert karein
      {
        $unwind: {
          path: "$projectInfo",
          preserveNullAndEmptyArrays: true // Agar project delete ho gaya ho to task ko na hataye
        }
      },
      // Stage 4: Zaroori fields ke sath naya structure banayein
      {
        $project: {
          // Task ki apni saari fields
          _id: 1,
          title: 1,
          status: 1,
          priority: 1,
          deadline: 1,
          createdAt: 1,
          // Project ki sirf zaroori fields
          project: {
            _id: "$projectInfo._id",
            title: "$projectInfo.title",
            color: "$projectInfo.color"
          }
        }
      },
       // Stage 5: Deadline ke hisab se sort karein
      {
        $sort: {
          deadline: 1, // 1 for ascending
        }
      }
    ]);

    // Agar kisi task ka project null ho (delete ho chuka ho), usay handle karein
    const finalTasks = tasks.map(task => {
        if (!task.project || !task.project._id) {
            return {
                ...task,
                project: { _id: 'deleted', title: 'Deleted Project', color: '#808080' }
            };
        }
        return task;
    });


    res.json({ success: true, tasks: finalTasks });
  } catch (error) {
    console.error("Error fetching all user tasks:", error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};
module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getAllUserTasks,
  uploadAttachment
};