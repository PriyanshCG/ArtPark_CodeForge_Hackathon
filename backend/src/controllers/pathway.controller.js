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

/**
 * PATCH /api/pathway/:sessionId/assessment
 * Record the result of a module assessment and inject remedial steps if failed.
 */
const recordAssessmentResult = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { moduleId, score, passed } = req.body;

    if (score === undefined || !moduleId) {
      return sendError(res, 'moduleId and score are required', 400);
    }

    const session = await Session.findOne({ sessionId });
    if (!session) return sendError(res, 'Session not found', 404);

    // If pathway is just a reference, we might need to load it from the LearningPathway model
    let pathwayData = session.pathway;
    let learningPathwayDoc = null;

    if (pathwayData && pathwayData.id) {
       learningPathwayDoc = await LearningPathway.findById(pathwayData.id);
       if (!learningPathwayDoc) return sendError(res, 'Learning Pathway not found', 404);
       pathwayData = learningPathwayDoc.pathway;
    }

    if (!Array.isArray(pathwayData)) {
       return sendError(res, 'Pathway not found or not an array', 404);
    }

    // Update the specific module's status in the pathway
    const moduleIndex = pathwayData.findIndex(step => step.course_id === moduleId);
    if (moduleIndex === -1) return sendError(res, 'Module not found in pathway', 404);

    pathwayData[moduleIndex].assessmentScore = score;
    pathwayData[moduleIndex].status = passed ? 'completed' : 'failed';

    // If failed, inject remedial step RIGHT AFTER this module
    let remedialInjected = false;
    if (!passed) {
      const failedModule = pathwayData[moduleIndex];
      const remedialStep = {
        course_id: `remedial-${moduleId}-${Date.now()}`,
        course_title: `Remedial: ${failedModule.course_title} Fundamentals`,
        type: 'remedial',
        status: 'unlocked',
        priority: 'critical',
        estimated_hours: 4,
        learning_tips: `Targeted remedial content for ${failedModule.course_title}. Focus on foundational concepts before re-attempting the assessment.`,
        prerequisites_ids: [moduleId],
        injectedAt: new Date(),
        triggerScore: score,
        domain: failedModule.domain,
        proficiency_target: failedModule.proficiency_target
      };
      // Inject the remedial step at moduleIndex + 1
      pathwayData.splice(moduleIndex + 1, 0, remedialStep);
      remedialInjected = true;
    }

    if (learningPathwayDoc) {
      learningPathwayDoc.pathway = pathwayData;
      learningPathwayDoc.markModified('pathway');
      await learningPathwayDoc.save();
    } else {
      session.pathway = pathwayData;
      session.markModified('pathway');
      await session.save();
    }

    res.json({
      success: true,
      passed,
      updatedPathway: pathwayData,
      remedialInjected
    });
  } catch (err) {
    logger.error('Assessment recording error:', err);
    next(err);
  }
};

module.exports = { generatePathway, getPathway, getAllCourses, getCoursesByDomain, recordAssessmentResult };
