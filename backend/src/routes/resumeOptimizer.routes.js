const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { optimizeResume } = require('../controllers/resumeOptimizer.controller');

/**
 * POST /api/resume/optimize
 * Perform surgical AI resume optimization.
 */
router.post('/optimize', optimizeResume);

module.exports = router;
