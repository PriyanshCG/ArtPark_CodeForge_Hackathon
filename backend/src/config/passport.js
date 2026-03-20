const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User.model');
const logger = require('../utils/logger');

// ── JWT Strategy ────────────────────────────────────────────────────────────
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// ── Google OAuth Strategy ───────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        proxy: true, // Required for Heroku/Render/behind proxy
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists by googleId
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Check if user exists by email (link accounts)
            const email = profile.emails?.[0]?.value;
            user = await User.findOne({ email });

            if (user) {
              user.googleId = profile.id;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: email,
                avatar: profile.photos?.[0]?.value,
                authProvider: 'google',
              });
            }
          }

          user.lastLogin = new Date();
          await user.save();

          return done(null, user);
        } catch (err) {
          logger.error('Google OAuth error:', err);
          return done(err, false);
        }
      }
    )
  );
} else {
  logger.warn('Google OAuth disabled — GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set');
}

// Passport serialization (session handling)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
