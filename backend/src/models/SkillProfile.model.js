/**
 * @file SkillProfile.model.js
 * @description Mongoose schema for a skill profile (resume or JD)
 */
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
    years_experience: { type: Number, default: 0 },
    is_mandatory: { type: Boolean, default: false },
  },
  { _id: false }
);

const skillProfileSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    profile_type: {
      type: String,
      enum: ['resume', 'job_description'],
      required: true,
    },
    name: String,
    skills: [skillSchema],
    domains: [String],
    seniority_level: String,
    total_experience_years: Number,
    role_title: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
