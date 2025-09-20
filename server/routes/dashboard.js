const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Yeh route protected hai, sirf logged-in user hi isko access kar sakta hai
router.get('/stats', auth, getDashboardStats);

module.exports = router;  