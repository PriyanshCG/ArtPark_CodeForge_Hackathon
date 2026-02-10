/**
 * @file Session.model.js
 * @description Mongoose schema for an analysis session
 */
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      unique: true,
      default: uuidv4,
      index: true,
    },
    resumeFilePath: { type: String, default: '' },
    jdText: { type: String, default: '' },
    resumeProfile: { type: mongoose.Schema.Types.Mixed, default: null },
    jdProfile: { type: mongoose.Schema.Types.Mixed, default: null },
    skillGap: { type: mongoose.Schema.Types.Mixed, default: null },
    pathway: { type: mongoose.Schema.Types.Mixed, default: null },
    groundingValidation: { type: mongoose.Schema.Types.Mixed, default: null },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: { type: String, default: null },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Session', sessionSchema);
