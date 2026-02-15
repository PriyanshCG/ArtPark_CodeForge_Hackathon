/**
 * @file skillNormalizer.js
 * @description Normalizes skill names to a consistent canonical form for comparison
 */

/** Map of common aliases to canonical names */
const SKILL_ALIASES = {
  'js': 'javascript',
  'ts': 'typescript',
  'node': 'node.js',
  'nodejs': 'node.js',
  'react.js': 'react',
  'reactjs': 'react',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'angular.js': 'angular',
  'angularjs': 'angular',
  'pg': 'postgresql',
  'postgres': 'postgresql',
  'mongo': 'mongodb',
  'k8s': 'kubernetes',
  'tf': 'tensorflow',
  'pytorch': 'pytorch',
  'py': 'python',
  'aws': 'amazon web services',
  'gcp': 'google cloud platform',
  'ci/cd': 'ci cd',
  'ci-cd': 'ci cd',
  'rest': 'rest api',
  'restful': 'rest api',
  'graphql': 'graphql',
  'ml': 'machine learning',
  'dl': 'deep learning',
  'nlp': 'natural language processing',
};

/**
 * Normalize a skill name: trim, lowercase, resolve aliases.
 * @param {string} skillName
 * @returns {string} Canonical skill name
 */
const normalizeSkill = (skillName) => {
  if (!skillName || typeof skillName !== 'string') return '';
  const lower = skillName.trim().toLowerCase();
  return SKILL_ALIASES[lower] || lower;
};

/**
 * Check if two skill names are equivalent after normalization.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
const skillsMatch = (a, b) => normalizeSkill(a) === normalizeSkill(b);

/**
 * Deduplicate an array of skill names (case-insensitive).
 * @param {string[]} skills
 * @returns {string[]}
 */
const deduplicateSkills = (skills) => {
  const seen = new Set();
  return skills.filter((skill) => {
    const normalized = normalizeSkill(skill);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

module.exports = { normalizeSkill, skillsMatch, deduplicateSkills };
