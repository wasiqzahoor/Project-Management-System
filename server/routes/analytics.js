// server/routes/analytics.js
const express = require('express');
const { getChartData } = require('../controllers/analyticsController');
const { adminAuth } = require('../middlewares/auth'); // Isay admin-only rakhein

const router = express.Router();

// Yeh route sirf admin access kar sakta hai
router.get('/charts', adminAuth, getChartData);

module.exports = router;