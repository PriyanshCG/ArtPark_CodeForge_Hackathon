/**
 * @file adaptivePathway.service.js
 * @description Core 5-phase adaptive learning pathway algorithm.
 *
 * PHASE 1 — Build Dependency Graph
 * PHASE 2 — Topological Sort (Kahn's Algorithm)
 * PHASE 3 — Learner Adaptation (skip known, adapt level)
 * PHASE 4 — LLM Enrichment (tips, success criteria, weekly schedule)
 * PHASE 5 — Reasoning Trace Generation
 */
const path = require('path');
const courseDatabase = require('../config/courseDatabase.json');
const { callLLMStructured } = require('./llm.service');
const { normalizeSkill } = require('../utils/skillNormalizer');
const logger = require('../utils/logger');

// ── Helper: Find course by skill name + proficiency ──────────────────────────

/**
 * Find the best matching course from the catalog for a given skill and level.
 * @param {string} skillName
 * @param {string} [targetLevel='beginner']
 * @returns {object|null}
 */
const findCourse = (skillName, targetLevel = 'beginner') => {
  const normalized = normalizeSkill(skillName);
  const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const targetIdx = levelOrder.indexOf(targetLevel);

  // Exact match at target level first
  let course = courseDatabase.courses.find(
    (c) =>
      normalizeSkill(c.skill) === normalized &&
      c.proficiency_level === targetLevel
  );

  if (course) return course;

  // Try adjacent levels
  for (let delta = 1; delta <= 3; delta++) {
    const lower = levelOrder[Math.max(0, targetIdx - delta)];
    const higher = levelOrder[Math.min(3, targetIdx + delta)];
    course =
      courseDatabase.courses.find(
        (c) => normalizeSkill(c.skill) === normalized && c.proficiency_level === lower
      ) ||
      courseDatabase.courses.find(
        (c) => normalizeSkill(c.skill) === normalized && c.proficiency_level === higher
      );
    if (course) return course;
  }

  // Loose match by tags or title
  return (
    courseDatabase.courses.find(
      (c) =>
        c.tags &&
        c.tags.some((t) => normalizeSkill(t) === normalized)
    ) || null
  );
};

// ── PHASE 1: Build Dependency Graph ─────────────────────────────────────────

/**
 * Build a dependency map from all courses: skillId → [prerequisite skillIds]
 * @returns {Map<string, string[]>}
 */
const buildDependencyGraph = () => {
  const graph = new Map();
  for (const course of courseDatabase.courses) {
    const skillKey = normalizeSkill(course.skill);
    if (!graph.has(skillKey)) {
      graph.set(skillKey, []);
    }
    for (const prereq of (course.prerequisites || [])) {
      const prereqCourse = courseDatabase.courses.find((c) => c.id === prereq);
      if (prereqCourse) {
        graph.get(skillKey).push(normalizeSkill(prereqCourse.skill));
      }
    }
  }
  return graph;
};

/**
 * Recursively resolve all prerequisites for a skill not already in resume.
 * @param {string} skillName
 * @param {Map<string, string[]>} graph
 * @param {Set<string>} knownSkills - Skills learner already has
 * @param {Set<string>} visited - Cycle detection
 * @returns {string[]} Ordered prerequisite list (deepest first)
 */
const resolvePrerequisites = (skillName, graph, knownSkills, visited = new Set()) => {
  const normalized = normalizeSkill(skillName);
  if (visited.has(normalized)) return []; // Cycle guard
  visited.add(normalized);

  const prereqs = graph.get(normalized) || [];
  const result = [];

  for (const prereq of prereqs) {
    if (!knownSkills.has(prereq)) {
      const deeper = resolvePrerequisites(prereq, graph, knownSkills, visited);
      result.push(...deeper);
      if (!result.includes(prereq)) {
        result.push(prereq);
      }
    }
  }

  return result;
};

// ── PHASE 2: Topological Sort (Kahn's Algorithm) ─────────────────────────────

/**
 * Topological sort of skill nodes using Kahn's algorithm.
 * Mandatory skills get higher weight than nice-to-have.
 * @param {string[]} skills - All skills to include
 * @param {Map<string, string[]>} graph
 * @param {Map<string, object>} skillMeta - Metadata (priority, gap_size, is_mandatory)
 * @returns {string[]} Topologically sorted list
 */
const topologicalSort = (skills, graph, skillMeta) => {
  const skillSet = new Set(skills.map(normalizeSkill));

  // Build in-degree map
  const inDegree = new Map();
  const adjList = new Map();

  for (const skill of skillSet) {
    inDegree.set(skill, 0);
    adjList.set(skill, []);
  }

  for (const skill of skillSet) {
    const deps = graph.get(skill) || [];
    for (const dep of deps) {
      if (skillSet.has(dep)) {
        adjList.get(dep).push(skill);
        inDegree.set(skill, (inDegree.get(skill) || 0) + 1);
      }
    }
  }

  // Priority queue: skills with in-degree 0, sorted by mandatory > gap_size
  const queue = [...skillSet]
    .filter((s) => inDegree.get(s) === 0)
    .sort((a, b) => {
      const metaA = skillMeta.get(a) || {};
      const metaB = skillMeta.get(b) || {};
      // Mandatory first
      if (metaA.is_mandatory && !metaB.is_mandatory) return -1;
      if (!metaA.is_mandatory && metaB.is_mandatory) return 1;
      // Then by gap size (larger gap = higher priority)
      return (metaB.gap_size || 0) - (metaA.gap_size || 0);
    });

  const sorted = [];

  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);

    const neighbors = adjList.get(node) || [];
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        // Insert into queue in correct position
        const meta = skillMeta.get(neighbor) || {};
        const insertIdx = queue.findIndex((s) => {
          const m = skillMeta.get(s) || {};
          if (meta.is_mandatory && !m.is_mandatory) return true;
          return (meta.gap_size || 0) > (m.gap_size || 0);
        });
        if (insertIdx === -1) queue.push(neighbor);
        else queue.splice(insertIdx, 0, neighbor);
      }
    }
  }

  // If there are remaining nodes (cycle), append them
  for (const skill of skillSet) {
    if (!sorted.includes(skill)) sorted.push(skill);
  }

  return sorted;
};

// ── PHASE 3: Learner Adaptation ──────────────────────────────────────────────

/**
 * Map sorted skills to actual courses, adapting level based on learner profile.
 * @param {string[]} sortedSkills
 * @param {object} resumeProfile
 * @param {Map<string, object>} skillMeta
 * @returns {object[]} Intermediate pathway steps
 */
const adaptToLearner = (sortedSkills, resumeProfile, skillMeta) => {
  const seniorityLevel = resumeProfile.seniority_level || 'mid';
  const resumeSkillNames = new Set(
    (resumeProfile.skills || []).map((s) => normalizeSkill(s.name))
  );

  const pathway = [];

  for (const skillName of sortedSkills) {
    const meta = skillMeta.get(skillName) || {};

    // Determine starting proficiency level
    let startLevel = 'beginner';
    const existingSkill = (resumeProfile.skills || []).find(
      (s) => normalizeSkill(s.name) === skillName
    );

    if (existingSkill) {
      // Has partial knowledge — start from current level
      const levelMap = { beginner: 'intermediate', intermediate: 'advanced', advanced: 'advanced', expert: 'expert' };
      startLevel = levelMap[existingSkill.proficiency] || 'intermediate';
    } else if (seniorityLevel === 'senior' || seniorityLevel === 'lead') {
      // Seniors skip beginner for foundational skills
      startLevel = 'intermediate';
    }

    const targetLevel = meta.required_proficiency || 'intermediate';
    const course = findCourse(skillName, startLevel);

    if (!course) {
      logger.warn(`No course found in catalog for skill: "${skillName}"`);
      continue;
    }

    pathway.push({
      skill_name: skillName,
      course_id: course.id,
      course_title: course.title,
      domain: course.domain,
      proficiency_start: startLevel,
      proficiency_target: targetLevel,
      estimated_hours: course.duration_hours,
      format: course.format,
      prerequisites_ids: course.prerequisites || [],
      learning_objectives: course.learning_objectives || [],
      provider: course.provider,
      url: course.url,
      priority: meta.priority || 'high',
      is_mandatory: meta.is_mandatory !== false,
      is_prerequisite: meta.is_prerequisite || false,
      gap_size: meta.gap_size || 0,
    });
  }

  return pathway;
};

// ── PHASE 4: LLM Enrichment ──────────────────────────────────────────────────

/**
 * Enrich intermediate pathway with LLM-generated tips and weekly schedule.
 * @param {object[]} intermediatePathway
 * @param {object} resumeProfile
 * @param {object} jdProfile
 * @returns {Promise<object>} Enriched pathway + weekly schedule
 */
const enrichWithLLM = async (intermediatePathway, resumeProfile, jdProfile) => {
  const catalogSummary = courseDatabase.courses.map((c) => ({
    id: c.id,
    skill: c.skill,
    title: c.title,
    level: c.proficiency_level,
    hours: c.duration_hours,
  }));

  const systemPrompt = `You are an expert learning pathway designer and career coach.
You are given an ordered learning pathway for a new hire.
Your job is to enrich each step with personalized learning tips, success criteria, and time estimates.

CRITICAL: You MUST only reference courses from the provided catalog. NEVER invent course names.
Return ONLY valid JSON.`;

  const userPrompt = `Enrich this learning pathway for a ${resumeProfile.seniority_level || 'mid-level'} candidate targeting the role of "${jdProfile.role_title}".

CANDIDATE PROFILE:
- Total Experience: ${resumeProfile.total_experience_years || 0} years
- Domains: ${(resumeProfile.domains || []).join(', ')}
- Seniority: ${resumeProfile.seniority_level || 'mid'}

ORDERED PATHWAY:
${JSON.stringify(intermediatePathway.map((s) => ({ skill: s.skill_name, course: s.course_title, hours: s.estimated_hours, level: s.proficiency_target })), null, 2)}

AVAILABLE COURSE CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

Return JSON with this exact structure:
{
  "enriched_steps": [
    {
      "skill_name": "same as input",
      "learning_tips": "1-2 sentence practical tip for learning this skill",
      "success_criteria": "Specific, measurable criteria to verify mastery",
      "common_pitfalls": "Common mistake to avoid",
      "estimated_hours_adjusted": 6
    }
  ],
  "weekly_schedule": {
    "week_1": ["skill_name_1", "skill_name_2"],
    "week_2": ["skill_name_3"]
  },
  "overall_coaching_note": "Brief motivational coaching note for this candidate"
}`;

  try {
    const enrichment = await callLLMStructured(systemPrompt, userPrompt, {
      temperature: 0.4,
      max_tokens: 3000,
    });
    return enrichment;
  } catch (err) {
    logger.warn('LLM enrichment failed, using defaults:', err.message);
    return {
      enriched_steps: intermediatePathway.map((s) => ({
        skill_name: s.skill_name,
        learning_tips: 'Focus on hands-on practice with real projects.',
        success_criteria: `Can demonstrate ${s.skill_name} skills in a practical project.`,
        common_pitfalls: 'Spending too long on theory without practice.',
        estimated_hours_adjusted: s.estimated_hours,
      })),
      weekly_schedule: {},
      overall_coaching_note: `Stay focused and consistent. You can close this skill gap in ${Math.ceil(intermediatePathway.reduce((a, s) => a + s.estimated_hours, 0) / 10)} weeks of dedicated effort.`,
    };
  }
};

// ── PHASE 5: Reasoning Trace ─────────────────────────────────────────────────

/**
 * Generate reasoning trace for each pathway step.
 * @param {object[]} pathwaySteps
 * @param {Map<string, string[]>} graph
 * @param {object} jdProfile
 * @param {object} resumeProfile
 * @returns {object[]} Steps with reasoning populated
 */
const generateReasoningTrace = (pathwaySteps, graph, jdProfile, resumeProfile) => {
  const skillNames = pathwaySteps.map((s) => s.skill_name);

  return pathwaySteps.map((step, idx) => {
    const deps = graph.get(step.skill_name) || [];
    const isPrereqFor = skillNames.filter((s) => {
      const sdeps = graph.get(s) || [];
      return sdeps.includes(step.skill_name);
    });

    const requiredInJd = (jdProfile.required_skills || []).find(
      (s) => normalizeSkill(s.name) === step.skill_name
    );
    const inResume = (resumeProfile.skills || []).find(
      (s) => normalizeSkill(s.name) === step.skill_name
    );

    // Build dependency chain string
    const depChain = [...deps.filter((d) => skillNames.includes(d)), step.skill_name, ...isPrereqFor]
      .map((s, i, arr) => (i === arr.length - 1 ? s : `${s} →`))
      .join(' ');

    const why = requiredInJd
      ? `JD requires "${step.skill_name}" (${requiredInJd.is_mandatory !== false ? 'mandatory' : 'nice-to-have'}). ${!inResume ? 'Not found in resume.' : 'Proficiency gap detected.'}`
      : `Prerequisite dependency required for the main learning path.`;

    const whyOrder =
      idx === 0
        ? 'First in sequence — no dependencies.'
        : deps.length > 0
        ? `Placed here because it requires: ${deps.join(', ')}.`
        : isPrereqFor.length > 0
        ? `Must come before: ${isPrereqFor.join(', ')}.`
        : `Ordered by priority (mandatory/gap size).`;

    const adaptNote = inResume
      ? `Starting at ${step.proficiency_start} level because learner already has "${inResume.proficiency}" proficiency in ${inResume.name}.`
      : step.proficiency_start !== 'beginner'
      ? `Starting at ${step.proficiency_start} level due to ${resumeProfile.seniority_level || 'mid'} seniority — skipping basics.`
      : 'Starting from beginner — no prior knowledge detected.';

    return {
      ...step,
      is_prerequisite_for: isPrereqFor,
      reasoning: {
        why_included: why,
        why_this_order: whyOrder,
        dependency_chain: depChain || step.skill_name,
        adaptation_note: adaptNote,
      },
    };
  });
};

// ── MAIN EXPORT: generateAdaptivePathway ─────────────────────────────────────

/**
 * Run the full 5-phase adaptive pathway algorithm.
 * @param {object} resumeProfile - From resumeParser
 * @param {object} jdProfile - From jdParser
 * @param {object} skillGap - From skillMatcher
 * @returns {Promise<object>} Complete pathway result
 */
const generateAdaptivePathway = async (resumeProfile, jdProfile, skillGap) => {
  logger.info('⚙️  Starting 5-phase adaptive pathway algorithm...');

  // ── Known skills from resume ────────────────────────────────────────────────
  const knownSkills = new Set(
    (resumeProfile.skills || []).map((s) => normalizeSkill(s.name))
  );

  // ── PHASE 1: Build dependency graph ─────────────────────────────────────────
  logger.info('Phase 1: Building dependency graph...');
  const graph = buildDependencyGraph();

  // ── Collect all skills to learn ─────────────────────────────────────────────
  const missingSkills = (skillGap.missing_skills || []).map((s) => normalizeSkill(s.skill));
  const profGapSkills = (skillGap.proficiency_gaps || []).map((s) => normalizeSkill(s.skill));

  // Resolve prerequisites for each missing skill
  const allSkillsToLearn = new Set();
  for (const skill of [...missingSkills, ...profGapSkills]) {
    const prereqs = resolvePrerequisites(skill, graph, knownSkills);
    for (const p of prereqs) allSkillsToLearn.add(p);
    allSkillsToLearn.add(skill);
  }

  // ── Build skill metadata map ────────────────────────────────────────────────
  const skillMeta = new Map();
  for (const ms of skillGap.missing_skills || []) {
    const key = normalizeSkill(ms.skill);
    skillMeta.set(key, {
      priority: ms.priority || 'high',
      is_mandatory: ms.is_mandatory !== false,
      gap_size: 3,
      required_proficiency: ms.required_proficiency || 'intermediate',
      is_prerequisite: false,
    });
  }
  for (const pg of skillGap.proficiency_gaps || []) {
    const key = normalizeSkill(pg.skill);
    if (!skillMeta.has(key)) {
      skillMeta.set(key, {
        priority: pg.is_mandatory ? 'high' : 'medium',
        is_mandatory: pg.is_mandatory !== false,
        gap_size: pg.gap_size || 1,
        required_proficiency: pg.required_level || 'intermediate',
        is_prerequisite: false,
      });
    }
  }
  // Mark prerequisites with lower priority
  for (const skill of allSkillsToLearn) {
    if (!skillMeta.has(skill)) {
      skillMeta.set(skill, {
        priority: 'medium',
        is_mandatory: true,
        gap_size: 2,
        required_proficiency: 'beginner',
        is_prerequisite: true,
      });
    }
  }

  // ── PHASE 2: Topological sort ────────────────────────────────────────────────
  logger.info('Phase 2: Topological sort (Kahn\'s Algorithm)...');
  const sortedSkills = topologicalSort([...allSkillsToLearn], graph, skillMeta);
  logger.info(`Phase 2 complete: ${sortedSkills.length} skills ordered`);

  // ── PHASE 3: Learner adaptation ──────────────────────────────────────────────
  logger.info('Phase 3: Adapting pathway to learner profile...');
  const intermediatePathway = adaptToLearner(sortedSkills, resumeProfile, skillMeta);
  logger.info(`Phase 3 complete: ${intermediatePathway.length} courses mapped`);

  // ── PHASE 4: LLM enrichment ─────────────────────────────────────────────────
  logger.info('Phase 4: LLM enrichment...');
  const enrichment = await enrichWithLLM(intermediatePathway, resumeProfile, jdProfile);
  logger.info('Phase 4 complete');

  // ── PHASE 5: Reasoning trace ─────────────────────────────────────────────────
  logger.info('Phase 5: Generating reasoning traces...');
  const tracedPathway = generateReasoningTrace(intermediatePathway, graph, jdProfile, resumeProfile);

  // Merge enrichment into final pathway
  const enrichedStepsMap = new Map(
    (enrichment.enriched_steps || []).map((e) => [e.skill_name, e])
  );

  const finalPathway = tracedPathway.map((step, idx) => {
    const enriched = enrichedStepsMap.get(step.skill_name) || {};
    return {
      sequence: idx + 1,
      skill_name: step.skill_name,
      course_id: step.course_id,
      course_title: step.course_title,
      domain: step.domain,
      proficiency_target: step.proficiency_target,
      estimated_hours: enriched.estimated_hours_adjusted || step.estimated_hours,
      priority: step.priority,
      is_mandatory: step.is_mandatory,
      is_prerequisite_for: step.is_prerequisite_for || [],
      learning_modules: step.learning_objectives || [],
      learning_tips: enriched.learning_tips || 'Focus on hands-on practice.',
      success_criteria: enriched.success_criteria || `Demonstrate ${step.skill_name} in a real project.`,
      common_pitfalls: enriched.common_pitfalls || '',
      provider: step.provider,
      url: step.url,
      format: step.format || [],
      reasoning: step.reasoning,
    };
  });

  // ── Compute metrics ──────────────────────────────────────────────────────────
  const totalHours = finalPathway.reduce((acc, s) => acc + (s.estimated_hours || 0), 0);
  const estimatedWeeks = Math.ceil(totalHours / 10); // 10h/week pace

  const knownCount = (resumeProfile.skills || []).filter((rs) => {
    return (jdProfile.required_skills || []).some(
      (js) => normalizeSkill(js.name) === normalizeSkill(rs.name)
    );
  }).length;

  const hoursGenericOnboarding = (
    (jdProfile.required_skills || []).length + (jdProfile.nice_to_have_skills || []).length
  ) * 8;
  const redundancyAvoided = Math.max(0, hoursGenericOnboarding - totalHours);

  const metrics = {
    total_skills_to_learn: finalPathway.length,
    total_estimated_hours: totalHours,
    estimated_completion_weeks: estimatedWeeks,
    skills_already_known: knownCount,
    redundancy_avoided_hours: redundancyAvoided,
    readiness_improvement: `${skillGap.overall_readiness_score}% → 100%`,
  };

  logger.info(`✅ Pathway generation complete. ${finalPathway.length} steps, ~${totalHours}h total.`);

  return {
    pathway: finalPathway,
    metrics,
    weekly_schedule: enrichment.weekly_schedule || {},
    overall_coaching_note: enrichment.overall_coaching_note || '',
  };
};

module.exports = { generateAdaptivePathway };
