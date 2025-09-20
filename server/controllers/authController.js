const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto'); // Built-in module
const sendEmail = require('../utils/email');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}; 

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const forgotPassword = async (req, res) => {
  let user;
  try {
    // 1) User dhoondein
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: 'If a user with that email exists, an OTP has been sent.' 
      });
    }

    // 2) Ek 4-digit ka OTP generate karein
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // 3) OTP ko hash kar ke database mein save karein
    // Hum token ki jagah ab OTP save kar rahe hain
    user.passwordResetToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // 4) User ko OTP email karein
    const message = `Your password reset OTP is: ${otp}\nThis OTP is valid for 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset OTP', // Subject update karein
      message
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to email!'
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    if (user) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        try {
            await user.save({ validateBeforeSave: false });
        } catch (saveError) {
            console.error("Error cleaning up user on fail:", saveError);
        }
    }
    res.status(500).json({ message: 'Error sending email. Please try again.' });
  }
};

const resetPassword = async (req, res) => {
    try {
        // 1) User ko OTP ke basis par dhoondein
        // Hum 'token' ki jagah ab 'otp' receive karenge front-end se
        const hashedOtp = crypto.createHash('sha256').update(req.body.otp).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedOtp,
            passwordResetExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'OTP is invalid or has expired.' });
        }

        // 2) Naya password set karein
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 3) User ko log in karein aur naya token bhej dein
        const token = generateToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password.' });
    }
};

module.exports = { register, login, getProfile,forgotPassword,resetPassword,generateToken };