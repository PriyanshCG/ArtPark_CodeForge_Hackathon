/**
 * @file validateRequest.js
 * @description Zod-based request validation middleware
 */
const { ZodError } = require('zod');
const logger = require('../utils/logger');

/**
 * Creates an Express middleware that validates req.body against a Zod schema.
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
      logger.warn('Request validation failed:', errors);
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Request validation failed',
        error: JSON.stringify(errors),
      });
    }
    next(err);
  }
};

/**
 * Creates an Express middleware that validates req.params against a Zod schema.
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
const validateParams = (schema) => (req, res, next) => {
  try {
    req.params = schema.parse(req.params);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid route parameters',
      });
    }
    next(err);
  }
};

module.exports = { validateBody, validateParams };
