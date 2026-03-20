const pdf = require('pdf-parse');
const { parseResume } = require('../services/resumeParser.service');
const { parseJobDescription } = require('../services/jdParser.service');
const { analyzeSkillGap } = require('../services/skillMatcher.service');
const { generateAdaptivePathway } = require('../services/adaptivePathway.service');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * Helper to extract text from buffer (PDF or Text)
 */
const extractText = async (file) => {
  if (!file) return '';
  if (file.mimetype === 'application/pdf') {
    const data = await pdf(file.buffer);
    return data.text;
  }
  return file.buffer.toString('utf-8');
};

/**
 * POST /api/analysis/run
 * Legacy full analysis pipeline for a session.
 */
const runFullAnalysis = async (req, res, next) => {
  const { sessionId } = req.body;
  if (!sessionId) return sendError(res, 'sessionId is required.', 400);

  let session;
  try {
    session = await Session.findOne({ sessionId });
    if (!session) return sendError(res, `Session not found: ${sessionId}`, 404);
    if (session.status === 'processing') return sendError(res, 'Analysis in progress.', 409);
    if (session.status === 'completed' && session.skillGap) {
      return sendSuccess(res, { sessionId, status: 'completed', skillGap: session.skillGap }, 'Cached');
    }
  } catch (err) { return next(err); }

  session.status = 'processing';
  await session.save();

  try {
    const resumeText = session.resumeProfile?._rawText;
    const jdText = session.jdProfile?._rawText || session.jdText;
    const resumeProfile = await parseResume(resumeText);
    const jdProfile = await parseJobDescription(jdText);
    const skillGap = await analyzeSkillGap(resumeProfile, jdProfile);
    const roadmap = await generateAdaptivePathway(resumeProfile, jdProfile, skillGap);

    session.resumeProfile = resumeProfile;
    session.jdProfile = jdProfile;
    session.skillGap = skillGap;
    session.pathway = roadmap;
    session.status = 'completed';
    await session.save();

    return sendSuccess(res, { sessionId, status: 'completed', skillGap, roadmap }, 'Success');
  } catch (err) {
    session.status = 'failed';
    session.errorMessage = err.message;
    await session.save();
    return sendError(res, err.message, 500);
  }
};

/**
 * POST /api/analysis/parse/resume
 */
const parseResumeHandler = async (req, res) => {
  try {
    let text = req.body.text;
    if (req.files?.resume) {
      text = await extractText(req.files.resume[0]);
    }
    if (!text) return sendError(res, 'No resume content provided.', 400);
    const profile = await parseResume(text);
    return sendSuccess(res, { profile, _rawText: text }, 'Resume parsed');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

/**
 * POST /api/analysis/parse/jd
 */
const parseJDHandler = async (req, res) => {
  try {
    let text = req.body.text;
    if (req.files?.jobDescription) {
      text = await extractText(req.files.jobDescription[0]);
    }
    if (!text) return sendError(res, 'No JD content provided.', 400);
    const profile = await parseJobDescription(text);
    return sendSuccess(res, { profile, _rawText: text }, 'JD parsed');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

/**
 * POST /api/analysis/analyze/skill-gap
 */
const analyzeSkillGapHandler = async (req, res) => {
  try {
    const { resumeProfile, jdProfile } = req.body;
    if (!resumeProfile || !jdProfile) return sendError(res, 'Both profiles required.', 400);
    const skillGap = await analyzeSkillGap(resumeProfile, jdProfile);
    return sendSuccess(res, { skillGap }, 'Gap analysis complete');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

/**
 * POST /api/analysis/roadmap/generate
 */
const generateRoadmapHandler = async (req, res) => {
  try {
    const { resumeProfile, jdProfile, skillGap } = req.body;
    if (!resumeProfile || !jdProfile || !skillGap) return sendError(res, 'All inputs required.', 400);
    const roadmap = await generateAdaptivePathway(resumeProfile, jdProfile, skillGap);
    return sendSuccess(res, { roadmap }, 'Roadmap generated');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const getAnalysisStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    if (!session) return sendError(res, `Session not found`, 404);
    return sendSuccess(res, { status: session.status, ...session.toObject() }, 'Status');
  } catch (err) { next(err); }
};

module.exports = { 
  runFullAnalysis, 
  getAnalysisStatus,
  parseResumeHandler,
  parseJDHandler,
  analyzeSkillGapHandler,
  generateRoadmapHandler
};
