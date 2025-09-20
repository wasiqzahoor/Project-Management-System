const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const projects = await Project.aggregate([
      // Stage 1: Sirf woh projects match karein jahan user owner ya member hai
      {
        $match: {
          $or: [{ owner: userId }, { members: userId }]
        }
      },
      // Stage 2: 'tasks' collection se data join (lookup) karein
      {
        $lookup: {
          from: 'tasks', // 'tasks' collection ka naam
          localField: '_id',
          foreignField: 'project',
          as: 'tasks' // Naye array ka naam
        }
      },
      // Stage 3: Zaroori stats calculate karein aur naye fields add karein
      {
        $addFields: {
          totalTasks: { $size: '$tasks' },
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'completed'] }
              }
            }
          }
        }
      },
      // Stage 4: Owner aur Members ka data populate karein
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'memberInfo'
        }
      },
      // Stage 5: Unwanted fields ko hata dein aur data structure a-one karein
      {
        $project: {
          tasks: 0, // Poora tasks array ab nahi chahiye
          'ownerInfo.password': 0, // Password nahi bhejna
          'memberInfo.password': 0,
        }
      }
    ]);

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects with stats:', error);
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    // req.body se 'members' ko bhi nikalein
    const { title, description, deadline, priority, color, members } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      deadline,
      priority,
      color,
      members: members || [] // members ko yahan add karein
    });

    await project.populate('owner members', 'name email'); // members ko bhi populate karein

    req.io.emit('project_created', project);

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('owner members', 'name email');

    req.io.emit('project_updated', updatedProject);

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

   req.io.emit('project_deleted', { id: req.params.id });

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectStats = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    const tasks = await Task.find({ project: projectId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
};