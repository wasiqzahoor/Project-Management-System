// server/config/passport-setup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check karein ke user pehle se exist karta hai ya nahi
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }
      
      // Agar user googleId se nahi mila, to email se check karein
      user = await User.findOne({ email: profile.emails[0].value });
      if(user) {
        // Agar email se mil gaya to usay googleId se link kar dein
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      // Agar user kahin se nahi mila, to naya user banayein
      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        // Password ki zaroorat nahi
      });
      return done(null, newUser);

    } catch (error) {
      return done(error, null);
    }
  }
));