/**
 * @file analysis.routes.js
 */
const express = require('express');
const { runFullAnalysis, getAnalysisStatus } = require('../controllers/analysis.controller');

const router = express.Router();

/** POST /api/analysis/run */
router.post('/run', runFullAnalysis);

/** GET /api/analysis/:sessionId */
router.get('/:sessionId', getAnalysisStatus);

module.exports = router;
