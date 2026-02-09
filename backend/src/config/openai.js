/**
 * @file openai.js
 * @description OpenAI client singleton — adapted from SkillSense ai.service.ts
 */
const { OpenAI } = require('openai');
const logger = require('../utils/logger');

/** @type {OpenAI} Singleton OpenAI client */
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_')) {
  logger.warn('⚠️  OPENAI_API_KEY is missing or a placeholder. AI features will not work correctly.');
}

module.exports = openaiClient;
