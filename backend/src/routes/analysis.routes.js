/**
 * @file analysis.routes.js
 */
const express = require('express');
const { 
  runFullAnalysis, 
  getAnalysisStatus,
  parseResumeHandler,
  parseJDHandler,
  analyzeSkillGapHandler,
  generateRoadmapHandler
} = require('../controllers/analysis.controller');

const router = express.Router();

/** POST /api/analysis/run */
router.post('/run', runFullAnalysis);

/** GET /api/analysis/:sessionId */
router.get('/:sessionId', getAnalysisStatus);

/** POST /api/analysis/parse/resume */
router.post('/parse/resume', parseResumeHandler);

/** POST /api/analysis/parse/jd */
router.post('/parse/jd', parseJDHandler);

/** POST /api/analysis/analyze/skill-gap */
router.post('/analyze/skill-gap', analyzeSkillGapHandler);

/** POST /api/analysis/roadmap/generate */
router.post('/roadmap/generate', generateRoadmapHandler);

module.exports = router;
