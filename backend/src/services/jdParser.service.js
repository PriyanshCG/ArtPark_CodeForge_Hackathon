/**
 * @file jdParser.service.js
 * @description Parses raw Job Description text into a structured requirements object using GPT-4o
 */
const { callLLMStructured } = require('./llm.service');
const logger = require('../utils/logger');

const SYSTEM_PROMPT = `You are an expert talent acquisition specialist and job description analyst.
Extract all skill requirements from the job description exactly as specified.
Return ONLY valid JSON. Distinguish between mandatory and nice-to-have skills carefully.`;

/**
 * Parse raw job description text into structured requirements.
 * @param {string} jdText - Plain text from a job description
 * @returns {Promise<object>} Structured JD requirements object
 */
const parseJobDescription = async (jdText) => {
  const userPrompt = `Parse the following job description and return a JSON object with this exact structure:
{
  "role_title": "e.g. Senior Full Stack Engineer",
  "company_name": "Company name if mentioned, else empty string",
  "required_skills": [
    {
      "name": "Skill name",
      "proficiency_required": "beginner|intermediate|advanced|expert",
      "years_required": 0,
      "is_mandatory": true
    }
  ],
  "nice_to_have_skills": [
    {
      "name": "Skill name",
      "proficiency_required": "beginner|intermediate|advanced",
      "is_mandatory": false
    }
  ],
  "experience_required_years": 0,
  "education_required": "e.g. Bachelor's in CS or equivalent",
  "role_domain": "e.g. fullstack|frontend|backend|data|devops|mobile|security",
  "seniority_level": "junior|mid|senior|lead|principal",
  "responsibilities": ["key responsibility 1", "key responsibility 2"],
  "tech_stack": ["technology 1", "technology 2"]
}

JOB DESCRIPTION TEXT:
${jdText}`;

  try {
    const profile = await callLLMStructured(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.1,
      max_tokens: 2000,
    });

    return {
      role_title: profile.role_title || 'Unknown Role',
      company_name: profile.company_name || '',
      required_skills: Array.isArray(profile.required_skills) ? profile.required_skills : [],
      nice_to_have_skills: Array.isArray(profile.nice_to_have_skills) ? profile.nice_to_have_skills : [],
      experience_required_years: profile.experience_required_years || 0,
      education_required: profile.education_required || '',
      role_domain: profile.role_domain || 'fullstack',
      seniority_level: profile.seniority_level || 'mid',
      responsibilities: Array.isArray(profile.responsibilities) ? profile.responsibilities : [],
      tech_stack: Array.isArray(profile.tech_stack) ? profile.tech_stack : [],
    };
  } catch (err) {
    logger.error('JD parsing failed:', err.message);
    throw new Error(`Job description parsing failed: ${err.message}`);
  }
};

module.exports = { parseJobDescription };
