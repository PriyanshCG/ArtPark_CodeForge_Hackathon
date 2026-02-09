/**
 * @file errorHandler.js
 * @description Global Express error handler — adapted from SkillSense errorHandler.middleware.ts
 */
const { ZodError } = require('zod');
const logger = require('../utils/logger');

/**
 * Global error handler middleware.
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {Function} _next
 */
const errorHandler = (err, _req, res, _next) => {
  logger.error('Unhandled error:', err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    return res.status(400).json({
      success: false,
      data: null,
      message: `Duplicate value for "${field}". Please use a different value.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: JSON.stringify(errors),
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Request validation failed',
      error: JSON.stringify(errors),
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      data: null,
      message: `File too large. Max size is ${(parseInt(process.env.MAX_FILE_SIZE || '10485760') / 1024 / 1024).toFixed(0)}MB.`,
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Unexpected file field in upload.',
    });
  }

  // Default 500
  const message = err instanceof Error ? err.message : 'Internal server error';
  return res.status(err.status || 500).json({
    success: false,
    data: null,
    message,
  });
};

module.exports = errorHandler;
