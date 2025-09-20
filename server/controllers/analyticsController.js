// server/controllers/analyticsController.js
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User'); // User model ko import karein
const mongoose = require('mongoose');

const getChartData = async (req, res) => {
  try {
    // Promise.all se saari queries ek sath chalayein
    const [
      tasksByStatus,
      tasksPerProject,
      projectsByPriority, // Naya Chart Data
      userRegistrationTrend, // Naya Chart Data
      projectHealth // Naya Chart Data
    ] = await Promise.all([
      // Query 1: Tasks by Status (Pehle se mojood)
      Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { name: '$_id', value: '$count', _id: 0 } }
      ]),

      // Query 2: Tasks Per Project (Pehle se mojood)
      Project.aggregate([
        { $lookup: { from: 'tasks', localField: '_id', foreignField: 'project', as: 'tasks' } },
        { $project: { name: '$title', tasksCount: { $size: '$tasks' }, _id: 0 } },
        { $sort: { tasksCount: -1 } }
      ]),

      // === NAYI QUERIES ===

      // Query 3: Projects by Priority
      Project.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $project: { name: '$_id', value: '$count', _id: 0 } }
      ]),
      
      // Query 4: User Registration Trend (Pichle 30 din)
      User.aggregate([
        { $match: { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } } },
        { 
          $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', newUsers: '$count', _id: 0 } }
      ]),

      // Query 5: Top 5 Project Health
      Project.aggregate([
        { $lookup: { from: 'tasks', localField: '_id', foreignField: 'project', as: 'tasks' } },
        {
          $addFields: {
            totalTasks: { $size: '$tasks' },
            completedTasks: { $size: { $filter: { input: '$tasks', as: 'task', cond: { $eq: ['$$task.status', 'completed'] } } } },
            overdueTasks: { $size: { $filter: { input: '$tasks', as: 'task', cond: { $and: [ { $lt: ['$$task.deadline', new Date()] }, { $ne: ['$$task.status', 'completed'] } ] } } } }
          }
        },
        { $sort: { totalTasks: -1 } },
        { $limit: 5 },
        { $project: { subject: '$title', A: '$totalTasks', B: '$completedTasks', C: '$overdueTasks', _id: 0 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        tasksByStatus,
        tasksPerProject,
        projectsByPriority,
        userRegistrationTrend,
        projectHealth
      }
    });

  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
};


module.exports = {
  getChartData
};