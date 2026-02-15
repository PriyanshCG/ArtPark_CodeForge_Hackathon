/**
 * @file responseFormatter.js
 * @description Standard API response helpers — adapted from SkillSense pattern
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} data
 * @param {string} message
 * @param {number} [statusCode=200]
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, data, message });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 * @param {any} [error=null]
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  const payload = { success: false, data: null, message };
  if (error && process.env.NODE_ENV !== 'production') {
    payload.error = error instanceof Error ? error.message : String(error);
  }
  res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
