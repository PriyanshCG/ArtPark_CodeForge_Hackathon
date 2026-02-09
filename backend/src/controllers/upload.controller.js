/**
 * @file upload.controller.js
 * @description Handles resume + JD file upload and session creation
 */
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session.model');
const { extractTextFromFile } = require('../utils/pdfExtractor');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * POST /api/upload
 * Accepts resume file (multer) + jobDescription text/file via FormData.
 * Creates a new Session and returns the sessionId.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const uploadFiles = async (req, res, next) => {
  try {
    const resumeFile = req.files?.resume?.[0];
    const jdFile = req.files?.jobDescription?.[0];
    const jdText = req.body?.jobDescriptionText || '';

    if (!resumeFile) {
      return sendError(res, 'Resume file is required.', 400);
    }

    if (!jdFile && !jdText.trim()) {
      return sendError(res, 'Job description is required (file or text).', 400);
    }

    // Extract text from resume
    const resumeText = await extractTextFromFile(
      resumeFile.buffer,
      resumeFile.mimetype,
      resumeFile.originalname
    );

    if (!resumeText || resumeText.length < 50) {
      return sendError(res, 'Could not extract meaningful text from resume. Please upload a valid PDF or TXT file.', 422);
    }

    // Extract text from JD (file or plain text)
    let jobDescriptionText = jdText;
    if (jdFile) {
      jobDescriptionText = await extractTextFromFile(
        jdFile.buffer,
        jdFile.mimetype,
        jdFile.originalname
      );
    }

    if (!jobDescriptionText || jobDescriptionText.length < 20) {
      return sendError(res, 'Could not extract meaningful text from job description.', 422);
    }

    // Create session
    const sessionId = uuidv4();
    const session = await Session.create({
      sessionId,
      resumeFilePath: resumeFile.originalname,
      jdText: jobDescriptionText,
      status: 'pending',
      _resumeText: resumeText, // transient — stored in session for analysis
    });

    // Store extracted texts on session (Mixed fields)
    session.resumeProfile = { _rawText: resumeText };
    session.jdProfile = { _rawText: jobDescriptionText };
    await session.save();

    logger.info(`✅ Session created: ${sessionId} | Resume: ${resumeFile.originalname}`);

    return sendSuccess(
      res,
      {
        sessionId,
        message: 'Files uploaded successfully. Use this sessionId to run analysis.',
        resumeFileName: resumeFile.originalname,
        resumeTextLength: resumeText.length,
        jdTextLength: jobDescriptionText.length,
      },
      'Files uploaded successfully',
      201
    );
  } catch (err) {
    logger.error('Upload controller error:', err);
    next(err);
  }
};

module.exports = { uploadFiles };
