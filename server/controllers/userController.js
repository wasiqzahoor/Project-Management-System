// server/controllers/userController.js
const User = require('../models/User');

// Sab users ki list get karein (naam aur email ke sath)
const getAllUsers = async (req, res) => {
  try {
    // Apne aap ko chhor kar baaqi sab users dhoondein
    const users = await User.find({ _id: { $ne: req.user.id } }).select('name email');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = {
  getAllUsers,
};