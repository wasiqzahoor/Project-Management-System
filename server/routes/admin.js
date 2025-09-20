const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllProjects
} = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/auth');

const router = express.Router();

router.use(adminAuth); 

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/projects', getAllProjects);

module.exports = router;