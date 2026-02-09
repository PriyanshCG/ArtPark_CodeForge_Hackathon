/**
 * @file analysis.controller.js
 * @description Runs the full analysis pipeline: parse resume + JD, semantic skill gap analysis
 */
const Session = require('../models/Session.model');
const { parseResume } = require('../services/resumeParser.service');
const { parseJobDescription } = require('../services/jdParser.service');
const { analyzeSkillGap } = require('../services/skillMatcher.service');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * POST /api/analysis/run
 * Runs the full analysis pipeline for a session.
 * Body: { sessionId: string }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const runFullAnalysis = async (req, res, next) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return sendError(res, 'sessionId is required.', 400);
  }

  let session;
  try {
    session = await Session.findOne({ sessionId });
    if (!session) {
      return sendError(res, `Session not found: ${sessionId}`, 404);
    }

    if (session.status === 'processing') {
      return sendError(res, 'Analysis is already in progress for this session.', 409);
    }

    if (session.status === 'completed' && session.skillGap) {
      return sendSuccess(res, {
        sessionId,
        status: 'completed',
        resumeProfile: session.resumeProfile,
        jdProfile: session.jdProfile,
        skillGap: session.skillGap,
      }, 'Analysis already completed (cached)');
    }
  } catch (err) {
    logger.error('Analysis session lookup error:', err);
    return next(err);
  }

  // Mark as processing
  session.status = 'processing';
  await session.save();

  try {
    const resumeText = session.resumeProfile?._rawText;
    const jdText = session.jdProfile?._rawText || session.jdText;

    if (!resumeText) {
      throw new Error('Resume text not found in session. Please re-upload your files.');
    }
    if (!jdText) {
      throw new Error('Job description text not found in session. Please re-upload your files.');
    }

    // Step 1: Parse resume
    logger.info(`[${sessionId}] Step 1: Parsing resume...`);
    const resumeProfile = await parseResume(resumeText);

    // Step 2: Parse job description
    logger.info(`[${sessionId}] Step 2: Parsing job description...`);
    const jdProfile = await parseJobDescription(jdText);

    // Step 3: Semantic skill gap analysis
    logger.info(`[${sessionId}] Step 3: Analyzing skill gap...`);
    const skillGap = await analyzeSkillGap(resumeProfile, jdProfile);

    // Save results
    session.resumeProfile = resumeProfile;
    session.jdProfile = jdProfile;
    session.skillGap = skillGap;
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    logger.info(`[${sessionId}] ✅ Analysis complete. Readiness: ${skillGap.overall_readiness_score}%`);

    return sendSuccess(res, {
      sessionId,
      status: 'completed',
      resumeProfile,
      jdProfile,
      skillGap,
    }, 'Analysis completed successfully');
  } catch (err) {
    logger.error(`[${sessionId}] Analysis failed:`, err.message);
    session.status = 'failed';
    session.errorMessage = err.message;
    await session.save();
    return sendError(res, `Analysis failed: ${err.message}`, 500, err);
  }
};

/**
 * GET /api/analysis/:sessionId
 * Poll the analysis status and retrieve results.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const getAnalysisStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return sendError(res, `Session not found: ${sessionId}`, 404);
    }

    const payload = {
      sessionId,
      status: session.status,
      errorMessage: session.errorMessage || null,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
    };

    if (session.status === 'completed') {
      payload.resumeProfile = session.resumeProfile;
      payload.jdProfile = session.jdProfile;
      payload.skillGap = session.skillGap;
    }

    return sendSuccess(res, payload, `Analysis status: ${session.status}`);
  } catch (err) {
    logger.error('Get analysis status error:', err);
    next(err);
  }
};

module.exports = { runFullAnalysis, getAnalysisStatus };
