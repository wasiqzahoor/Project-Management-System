// server/routes/users.js
const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Yeh route protected hai, sirf logged-in user hi isko access kar sakta hai
router.get('/', auth, getAllUsers);

module.exports = router;