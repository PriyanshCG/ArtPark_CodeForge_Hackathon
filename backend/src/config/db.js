/**
 * @file db.js
 * @description MongoDB connection with retry logic — adapted from SkillSense db.ts
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

/**
 * Connects to MongoDB with retry logic. Falls back to local if Atlas fails.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adaptive-onboarding';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      logger.info(`✅ MongoDB connected: ${uri.includes('127.0.0.1') ? 'LOCAL' : 'ATLAS'}`);
      return;
    } catch (err) {
      logger.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      } else {
        if (!uri.includes('127.0.0.1')) {
          logger.warn('Atlas failed. Attempting local MongoDB fallback...');
          try {
            await mongoose.connect('mongodb://127.0.0.1:27017/adaptive-onboarding');
            logger.info('✅ MongoDB connected via LOCAL fallback');
            return;
          } catch (localErr) {
            logger.error('Local MongoDB also failed: ' + localErr.message);
          }
        }
        logger.error('MongoDB connection failed after max retries. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
