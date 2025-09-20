const Project = require('../models/Project');
const Task = require('../models/Task');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. User ke saare projects dhoondein (jahan woh owner ya member ho)
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    }).select('_id');

    const projectIds = projects.map(p => p._id);
    const totalProjects = projectIds.length;

    // 2. Un projects se related tasks ke stats database se calculate karein
    // Yeh tareeqa loop mein API call karne se bohat zyada tez hai
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'in-progress' });

    res.json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching dashboard stats.' });
  }
};

module.exports = {
  getDashboardStats,
};
