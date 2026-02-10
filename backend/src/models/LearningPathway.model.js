/**
 * @file LearningPathway.model.js
 * @description Mongoose schema for a stored learning pathway
 */
const mongoose = require('mongoose');

const pathwayStepSchema = new mongoose.Schema(
  {
    sequence: Number,
    skill_name: String,
    course_id: String,
    course_title: String,
    domain: String,
    proficiency_target: String,
    estimated_hours: Number,
    priority: String,
    is_mandatory: Boolean,
    is_prerequisite_for: [String],
    learning_modules: [String],
    learning_tips: String,
    success_criteria: String,
    common_pitfalls: String,
    provider: String,
    url: String,
    format: [String],
    reasoning: {
      why_included: String,
      why_this_order: String,
      dependency_chain: String,
      adaptation_note: String,
    },
  },
  { _id: false }
);

const learningPathwaySchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    pathway: [pathwayStepSchema],
    metrics: {
      total_skills_to_learn: Number,
      total_estimated_hours: Number,
      estimated_completion_weeks: Number,
      skills_already_known: Number,
      redundancy_avoided_hours: Number,
      readiness_improvement: String,
    },
    weekly_schedule: { type: mongoose.Schema.Types.Mixed, default: {} },
    overall_coaching_note: String,
    grounding_validation: {
      grounding_score: Number,
      grounded_courses: Number,
      total_courses: Number,
      ungrounded_courses: [String],
      is_fully_grounded: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningPathway', learningPathwaySchema);
