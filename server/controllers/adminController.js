const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const getDashboardStats = async (req, res) => {
  try {
    // Promise.all istemal karein taake saari database queries ek sath chalein (for speed)
    const [
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      activeProjects, // Naya Stat
      overdueTasks    // Naya Stat
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: 'completed' }),
      // Naya Stat: Sirf 'active' status wale projects count karein
      Project.countDocuments({ status: 'active' }),
      // Naya Stat: Woh tasks jinki deadline guzar chuki hai aur woh complete nahi hain
      Task.countDocuments({ 
        deadline: { $lt: new Date() }, 
        status: { $ne: 'completed' } 
      })
    ]);

    // Baaqi ka data (recent users, etc.) abhi is page ke liye zaroori nahi,
    // isliye usay comment kar dete hain taake API tez rahe.
    /*
    const recentUsers = await User.find()...
    const recentProjects = await Project.find()...
    */

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        totalTasks,
        completedTasks,
        activeProjects, // Naya data response mein add karein
        overdueTasks    // Naya data response mein add karein
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner members', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllProjects
};