/**
 * @file reasoningTrace.service.js
 * @description Validates pathway grounding against course catalog.
 * Every course in the pathway must exist in courseDatabase.json.
 */
const courseDatabase = require('../config/courseDatabase.json');
const logger = require('../utils/logger');

/**
 * Validate that all courses in the pathway exist in the course catalog.
 * @param {object[]} pathway - Array of pathway step objects
 * @returns {object} Grounding validation report
 */
const validateGrounding = (pathway) => {
  const catalogIds = new Set(courseDatabase.courses.map((c) => c.id));
  const pathwayIds = pathway.map((p) => p.course_id);

  const groundedIds = pathwayIds.filter((id) => catalogIds.has(id));
  const ungroundedIds = pathwayIds.filter((id) => !catalogIds.has(id));

  const groundingScore =
    pathwayIds.length > 0
      ? (groundedIds.length / pathwayIds.length) * 100
      : 100;

  const report = {
    grounding_score: Math.round(groundingScore * 100) / 100,
    grounded_courses: groundedIds.length,
    total_courses: pathwayIds.length,
    ungrounded_courses: ungroundedIds,
    is_fully_grounded: ungroundedIds.length === 0,
  };

  if (!report.is_fully_grounded) {
    logger.warn(
      `⚠️  Pathway grounding: ${groundingScore.toFixed(1)}% — ${ungroundedIds.length} ungrounded courses: ${ungroundedIds.join(', ')}`
    );
  } else {
    logger.info(`✅ Pathway grounding: 100% — all ${pathwayIds.length} courses verified in catalog.`);
  }

  return report;
};

/**
 * Compute aggregate statistics from reasoning traces.
 * @param {object[]} pathway
 * @returns {object}
 */
const summarizeReasoningTraces = (pathway) => {
  const mandatoryCount = pathway.filter((s) => s.is_mandatory).length;
  const prerequisiteCount = pathway.filter((s) =>
    s.reasoning?.why_included?.toLowerCase().includes('prerequisite')
  ).length;
  const adaptedCount = pathway.filter((s) =>
    s.reasoning?.adaptation_note && !s.reasoning.adaptation_note.includes('beginner')
  ).length;

  return {
    total_steps: pathway.length,
    mandatory_steps: mandatoryCount,
    prerequisite_steps: prerequisiteCount,
    adapted_steps: adaptedCount,
    has_full_reasoning: pathway.every((s) => s.reasoning && s.reasoning.why_included),
  };
};

module.exports = { validateGrounding, summarizeReasoningTraces };
