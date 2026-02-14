/**
 * @file skillMatcher.service.js
 * @description Semantic skill gap analysis using OpenAI embeddings + cosine similarity.
 * Threshold of 0.75 = skills are the same concept.
 */
const { getEmbedding } = require('./llm.service');
const { cosineSimilarity } = require('../utils/cosineSimilarity');
const { normalizeSkill } = require('../utils/skillNormalizer');
const logger = require('../utils/logger');

const SIMILARITY_THRESHOLD = 0.75;

/** Proficiency levels as numeric values for gap calculation */
const PROFICIENCY_LEVELS = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

/**
 * Get numeric gap size between two proficiency strings.
 * @param {string} current
 * @param {string} required
 * @returns {number}
 */
const proficiencyGapSize = (current, required) => {
  const cur = PROFICIENCY_LEVELS[current] || 1;
  const req = PROFICIENCY_LEVELS[required] || 2;
  return Math.max(0, req - cur);
};

/**
 * Classify gap level (none/minor/moderate/critical).
 * @param {number} gapSize
 * @returns {string}
 */
const classifyGap = (gapSize) => {
  if (gapSize === 0) return 'none';
  if (gapSize === 1) return 'minor';
  if (gapSize === 2) return 'moderate';
  return 'critical';
};

/**
 * Calculate overall readiness score from matched/missing data.
 * @param {object[]} matchedSkills
 * @param {object[]} missingSkills
 * @param {object[]} proficiencyGaps
 * @param {object[]} requiredSkills - All required skills from JD
 * @returns {number} 0–100
 */
const calcReadinessScore = (matchedSkills, missingSkills, proficiencyGaps, requiredSkills) => {
  const total = requiredSkills.length;
  if (total === 0) return 100;

  const matched = matchedSkills.length;
  const missing = missingSkills.length;
  const gapPenalty = proficiencyGaps.reduce((acc, g) => acc + g.gap_size * 5, 0);

  const baseScore = ((matched / total) * 100) - gapPenalty;
  return Math.max(0, Math.min(100, Math.round(baseScore)));
};

/**
 * Estimate hours needed to close the skill gap.
 * @param {object[]} missingSkills
 * @param {object[]} proficiencyGaps
 * @returns {number}
 */
const estimateGapClosureHours = (missingSkills, proficiencyGaps) => {
  const missingHours = missingSkills.length * 8; // avg 8h per new skill
  const gapHours = proficiencyGaps.reduce((acc, g) => acc + g.gap_size * 6, 0); // 6h per proficiency level
  return missingHours + gapHours;
};

/**
 * Get readiness label from score.
 * @param {number} score
 * @returns {string}
 */
const getReadinessLabel = (score) => {
  if (score >= 85) return 'Ready to Hire';
  if (score >= 65) return 'Minor Gaps';
  if (score >= 40) return 'Needs Development';
  return 'Significant Gap';
};

/**
 * Perform semantic skill gap analysis with fallback to string matching.
 * @param {object} resumeProfile - Parsed resume profile
 * @param {object} jdProfile - Parsed JD profile
 * @returns {Promise<object>} Full skill gap analysis
 */
const analyzeSkillGap = async (resumeProfile, jdProfile) => {
  const resumeSkills = resumeProfile.skills || [];
  const requiredSkills = jdProfile.required_skills || [];
  const niceToHaveSkills = jdProfile.nice_to_have_skills || [];
  const allJdSkills = [...requiredSkills, ...niceToHaveSkills];

  if (allJdSkills.length === 0) {
    throw new Error('No skills found in job description');
  }

  logger.info(`Analyzing ${resumeSkills.length} resume skills vs ${allJdSkills.length} JD skills`);

  // Fallback matching logic (string-based)
  const isStringMatch = (s1, s2) => {
    const n1 = normalizeSkill(s1).toLowerCase();
    const n2 = normalizeSkill(s2).toLowerCase();
    return n1 === n2 || n1.includes(n2) || n2.includes(n1);
  };

  // Get embeddings for all resume skills
  const resumeEmbeddings = [];
  for (const skill of resumeSkills) {
    try {
      const emb = await getEmbedding(normalizeSkill(skill.name));
      resumeEmbeddings.push({ skill, embedding: emb });
    } catch (err) {
      logger.warn(`Failed to embed resume skill "${skill.name}": ${err.message}. Using string fallback.`);
      resumeEmbeddings.push({ skill, embedding: null });
    }
  }

  // Get embeddings for all JD skills
  const jdEmbeddings = [];
  for (const skill of allJdSkills) {
    try {
      const emb = await getEmbedding(normalizeSkill(skill.name));
      jdEmbeddings.push({ skill, embedding: emb });
    } catch (err) {
      logger.warn(`Failed to embed JD skill "${skill.name}": ${err.message}. Using string fallback.`);
      jdEmbeddings.push({ skill, embedding: null });
    }
  }

  const matchedSkills = [];
  const missingSkills = [];
  const proficiencyGaps = [];
  const processedResumetems = new Set();

  // Match each JD skill against resume skills
  for (const jdItem of jdEmbeddings) {
    const jdSkill = jdItem.skill;
    const jdEmb = jdItem.embedding;
    let bestMatch = null;
    let bestSimilarity = -1;
    let matchType = 'none';

    for (const resumeItem of resumeEmbeddings) {
      let similarity = 0;
      
      // Try semantic match if both have embeddings
      if (jdEmb && resumeItem.embedding) {
        try {
          similarity = cosineSimilarity(jdEmb, resumeItem.embedding);
        } catch (e) {
          similarity = 0;
        }
      }

      // If semantic match fails but string match succeeds, give it a high score
      if (similarity < SIMILARITY_THRESHOLD && isStringMatch(jdSkill.name, resumeItem.skill.name)) {
        similarity = Math.max(similarity, 0.9); // High confidence for string match
      }

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = { skill: resumeItem.skill, similarity };
      }
    }

    if (bestMatch && bestSimilarity >= SIMILARITY_THRESHOLD) {
      // Skill found — check proficiency
      const resumeProf = bestMatch.skill.proficiency || 'beginner';
      const requiredProf = jdSkill.proficiency_required || 'intermediate';
      const gapSize = proficiencyGapSize(resumeProf, requiredProf);

      matchedSkills.push({
        skill: jdSkill.name,
        resume_skill_name: bestMatch.skill.name,
        semantic_similarity: Math.round(bestSimilarity * 100) / 100,
        resume_proficiency: resumeProf,
        required_proficiency: requiredProf,
        gap_level: classifyGap(gapSize),
        is_mandatory: jdSkill.is_mandatory !== false,
      });

      if (gapSize > 0) {
        proficiencyGaps.push({
          skill: jdSkill.name,
          current_level: resumeProf,
          required_level: requiredProf,
          gap_size: gapSize,
          is_mandatory: jdSkill.is_mandatory !== false,
        });
      }
    } else {
      // Skill missing from resume
      missingSkills.push({
        skill: jdSkill.name,
        required_proficiency: jdSkill.proficiency_required || 'intermediate',
        years_required: jdSkill.years_required || 0,
        priority: jdSkill.is_mandatory !== false ? 'critical' : 'medium',
        is_mandatory: jdSkill.is_mandatory !== false,
        closest_match: bestMatch ? {
          name: bestMatch.skill.name,
          similarity: Math.round(bestSimilarity * 100) / 100,
        } : null,
      });
    }
  }

  const readinessScore = calcReadinessScore(matchedSkills, missingSkills, proficiencyGaps, requiredSkills);
  const estimatedHours = estimateGapClosureHours(missingSkills, proficiencyGaps);

  return {
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    proficiency_gaps: proficiencyGaps,
    overall_readiness_score: readinessScore,
    readiness_label: getReadinessLabel(readinessScore),
    estimated_gap_closure_hours: estimatedHours,
    analysis_meta: {
      resume_skills_count: resumeSkills.length,
      jd_skills_count: allJdSkills.length,
      mandatory_missing: missingSkills.filter((s) => s.is_mandatory).length,
      similarity_threshold: SIMILARITY_THRESHOLD,
    },
  };
};

module.exports = { analyzeSkillGap };
