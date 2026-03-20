const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth.middleware');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

const router = express.Router();

/**
 * GET /api/auth/google
 * Initiates Google OAuth login flow.
 */
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email', 'openid'],
    prompt: 'select_account' 
  })
);

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback and issues a JWT.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: '/login?auth=failed' 
  }),
  (req, res) => {
    try {
      // Create JWT
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set cookie (helpful for some flows)
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always secure in production/Render
        sameSite: 'none', // Needed for cross-site cookies between Render and Vercel
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/?auth=success&token=${token}`;
      res.redirect(redirectUrl);
    } catch (err) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/?auth=failed`);
    }
  }
);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
router.get('/me', verifyToken, (req, res) => {
  return sendSuccess(res, { user: req.user }, 'User profile retrieved successfully');
});

/**
 * GET /api/auth/status
 * Simplified check if user is logged in.
 */
router.get('/status', (req, res) => {
  if (req.user || req.cookies?.jwt) {
    try {
      const token = req.cookies.jwt;
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET);
        return sendSuccess(res, { isLoggedIn: true }, 'Authenticated');
      }
    } catch (err) {
      // Token invalid
    }
  }
  return sendSuccess(res, { isLoggedIn: false }, 'Not authenticated');
});

/**
 * POST /api/auth/logout
 * Logs out the user and clears the JWT cookie.
 */
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  return sendSuccess(res, null, 'Logged out successfully');
});

module.exports = router;
