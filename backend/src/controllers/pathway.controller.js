/**
 * @file pathway.controller.js
 * @description Runs the 5-phase adaptive pathway generation and manages course catalog
 */
const Session = require('../models/Session.model');
const LearningPathway = require('../models/LearningPathway.model');
const { generateAdaptivePathway } = require('../services/adaptivePathway.service');
const { validateGrounding, summarizeReasoningTraces } = require('../services/reasoningTrace.service');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const courseDatabase = require('../config/courseDatabase.json');
const logger = require('../utils/logger');

/**
 * POST /api/pathway/generate
 * Generates an adaptive learning pathway from a completed analysis session.
 * Body: { sessionId: string }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const generatePathway = async (req, res, next) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return sendError(res, 'sessionId is required.', 400);
  }

  try {
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return sendError(res, `Session not found: ${sessionId}`, 404);
    }

    if (session.status !== 'completed' || !session.skillGap) {
      return sendError(
        res,
        'Analysis must be completed before generating a pathway. Please run /api/analysis/run first.',
        400
      );
    }

    // Check if pathway already exists for this session
    const existing = await LearningPathway.findOne({ sessionId });
    if (existing) {
      logger.info(`[${sessionId}] Returning cached pathway`);
      return sendSuccess(
        res,
        {
          sessionId,
          pathway: existing.pathway,
          metrics: existing.metrics,
          weekly_schedule: existing.weekly_schedule,
          overall_coaching_note: existing.overall_coaching_note,
          grounding_validation: existing.grounding_validation,
        },
        'Pathway retrieved (cached)'
      );
    }

    // Run 5-phase algorithm
    logger.info(`[${sessionId}] Generating adaptive pathway...`);
    const result = await generateAdaptivePathway(
      session.resumeProfile,
      session.jdProfile,
      session.skillGap
    );

    // Validate grounding
    const groundingValidation = validateGrounding(result.pathway);
    const reasoningSummary = summarizeReasoningTraces(result.pathway);

    // Save pathway to DB
    const savedPathway = await LearningPathway.create({
      sessionId,
      pathway: result.pathway,
      metrics: result.metrics,
      weekly_schedule: result.weekly_schedule,
      overall_coaching_note: result.overall_coaching_note,
      grounding_validation: groundingValidation,
    });

    // Also store reference in session
    session.pathway = { id: savedPathway._id };
    session.groundingValidation = groundingValidation;
    await session.save();

    logger.info(
      `[${sessionId}] ✅ Pathway generated: ${result.pathway.length} steps, grounding: ${groundingValidation.grounding_score}%`
    );

    return sendSuccess(
      res,
      {
        sessionId,
        pathway: result.pathway,
        metrics: result.metrics,
        weekly_schedule: result.weekly_schedule,
        overall_coaching_note: result.overall_coaching_note,
        grounding_validation: groundingValidation,
        reasoning_summary: reasoningSummary,
        skill_gap_summary: {
          readiness_score: session.skillGap.overall_readiness_score,
          readiness_label: session.skillGap.readiness_label,
          missing_skills_count: (session.skillGap.missing_skills || []).length,
          proficiency_gaps_count: (session.skillGap.proficiency_gaps || []).length,
        },
      },
      'Adaptive learning pathway generated successfully'
    );
  } catch (err) {
    logger.error(`[${sessionId}] Pathway generation failed:`, err.message);
    next(err);
  }
};

/**
 * GET /api/pathway/:sessionId
 * Retrieve a stored pathway for a session.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const getPathway = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const pathway = await LearningPathway.findOne({ sessionId });

    if (!pathway) {
      return sendError(res, `No pathway found for session: ${sessionId}. Generate one using POST /api/pathway/generate`, 404);
    }

    return sendSuccess(
      res,
      {
        sessionId,
        pathway: pathway.pathway,
        metrics: pathway.metrics,
        weekly_schedule: pathway.weekly_schedule,
        overall_coaching_note: pathway.overall_coaching_note,
        grounding_validation: pathway.grounding_validation,
      },
      'Pathway retrieved successfully'
    );
  } catch (err) {
    logger.error('Get pathway error:', err);
    next(err);
  }
};

/**
 * GET /api/courses
 * List all courses in the catalog.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllCourses = (_req, res) => {
  return sendSuccess(
    res,
    {
      total: courseDatabase.courses.length,
      courses: courseDatabase.courses,
    },
    'Course catalog retrieved'
  );
};

/**
 * GET /api/courses/:domain
 * Filter courses by domain.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getCoursesByDomain = (req, res) => {
  const { domain } = req.params;
  const filtered = courseDatabase.courses.filter(
    (c) => c.domain.toLowerCase() === domain.toLowerCase()
  );

  if (filtered.length === 0) {
    return sendError(
      res,
      `No courses found for domain: "${domain}". Valid domains: ${[...new Set(courseDatabase.courses.map((c) => c.domain))].join(', ')}`,
      404
    );
  }

  return sendSuccess(
    res,
    { total: filtered.length, domain, courses: filtered },
    `Courses in domain: ${domain}`
  );
};

module.exports = { generatePathway, getPathway, getAllCourses, getCoursesByDomain };
