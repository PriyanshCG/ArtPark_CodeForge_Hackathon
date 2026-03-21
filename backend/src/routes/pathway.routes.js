/**
 * @file pathway.routes.js
 */
const express = require('express');
const {
  generatePathway,
  getPathway,
  getAllCourses,
  getCoursesByDomain,
  recordAssessmentResult
} = require('../controllers/pathway.controller');

const router = express.Router();

/** POST /api/pathway/generate */
router.post('/generate', generatePathway);

/** GET /api/pathway/:sessionId */
router.get('/:sessionId', getPathway);

/** PATCH /api/pathway/:sessionId/assessment */
router.patch('/:sessionId/assessment', recordAssessmentResult);

module.exports = router;

// Export course routes separately for clarity
const courseRouter = express.Router();

/** GET /api/courses */
courseRouter.get('/', getAllCourses);

/** GET /api/courses/:domain */
courseRouter.get('/:domain', getCoursesByDomain);

module.exports.courseRouter = courseRouter;
module.exports = router;
// Re-attach
module.exports.courseRouter = courseRouter;
