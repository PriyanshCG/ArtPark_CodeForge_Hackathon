/**
 * @file taxonomy.js
 * @description Standardized skills taxonomy and synonyms for deterministic matching.
 */

const SKILLS_TAXONOMY = {
  // Frontend
  'react': ['react.js', 'reactjs', 'frontend', 'ui library'],
  'vue': ['vue.js', 'vuejs', 'frontend framework'],
  'angular': ['angular.js', 'angularjs', 'frontend framework'],
  'typescript': ['ts', 'typed javascript'],
  'javascript': ['js', 'ecmascript'],
  'html': ['html5', 'semantic html'],
  'css': ['css3', 'styling', 'cascading style sheets'],
  'tailwind': ['tailwindcss', 'utility-first css'],
  'nextjs': ['next.js', 'ssr', 'react framework'],

  // Backend
  'node': ['node.js', 'nodejs', 'javascript runtime'],
  'express': ['express.js', 'web framework'],
  'python': ['py', 'scripting'],
  'django': ['python framework'],
  'flask': ['python microframework'],
  'fastapi': ['python api framework'],
  'go': ['golang', 'systems programming'],
  'java': ['jvm', 'spring boot'],

  // Database
  'mongodb': ['mongo', 'nosql', 'document store'],
  'postgresql': ['postgres', 'sql', 'relational database'],
  'mysql': ['sql', 'relational database'],
  'redis': ['caching', 'in-memory store'],

  // DevOps / Cloud
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s', 'orchestration'],
  'aws': ['amazon web services', 'cloud infrastructure'],
  'git': ['github', 'version control', 'gitlab'],
  'cicd': ['continuous integration', 'continuous deployment', 'github actions', 'jenkins'],

  // Security
  'jwt': ['json web tokens', 'authentication', 'auth'],
  'oauth': ['oauth2', 'google login', 'authentication'],
};

/**
 * Get the canonical name for a skill if it matches a synonym.
 * @param {string} skillName 
 * @returns {string}
 */
const getCanonicalSkill = (skillName) => {
  const normalized = skillName.toLowerCase().trim();
  for (const [canonical, synonyms] of Object.entries(SKILLS_TAXONOMY)) {
    if (normalized === canonical || synonyms.includes(normalized)) {
      return canonical;
    }
  }
  return normalized;
};

module.exports = { SKILLS_TAXONOMY, getCanonicalSkill };
