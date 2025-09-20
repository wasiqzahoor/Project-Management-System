const express = require('express');
const { register, login, getProfile,forgotPassword,resetPassword, generateToken } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const passport = require('passport');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// Route 2: Google se redirect ho kar wapas anay wala route
router.get('/google/callback', passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}` // Agar fail ho to login page par wapas
}), (req, res) => {
    // Jab authentication kamyaab ho
    const token = generateToken(req.user._id);
    // User ko front-end par wapas bhejein, token ke sath
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
});

module.exports = router;