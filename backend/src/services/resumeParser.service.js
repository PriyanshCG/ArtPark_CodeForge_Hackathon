/**
 * @file resumeParser.service.js
 * @description Parses raw resume text into a structured profile using GPT-4o
 */
const { callLLMStructured } = require('./llm.service');
const logger = require('../utils/logger');

const SYSTEM_PROMPT = `You are an expert HR analyst and resume parser.
Extract all relevant information from the provided resume text and return ONLY valid JSON.
Be comprehensive: extract every skill mentioned, even implicitly.
Do not hallucinate or guess information not present in the text.`;

/**
 * Parse raw resume text into a structured profile.
 * @param {string} resumeText - Plain text extracted from a resume PDF
 * @returns {Promise<object>} Structured resume profile
 */
const parseResume = async (resumeText) => {
  const userPrompt = `Parse the following resume and return a JSON object with this exact structure:
{
  "personal_info": {
    "name": "Full name or empty string",
    "email": "Email or empty string",
    "phone": "Phone or empty string",
    "location": "City/Country or empty string",
    "linkedin": "LinkedIn URL or empty string"
  },
  "skills": [
    {
      "name": "Skill name",
      "proficiency": "beginner|intermediate|advanced|expert",
      "years_experience": 0
    }
  ],
  "total_experience_years": 0,
  "work_history": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration_years": 0,
      "key_skills": ["skill1", "skill2"]
    }
  ],
  "education": [
    {
      "degree": "Degree type",
      "field": "Field of study",
      "institution": "University name",
      "year": 2020
    }
  ],
  "certifications": ["cert1", "cert2"],
  "domains": ["frontend", "backend", "devops"],
  "seniority_level": "junior|mid|senior|lead"
}

RESUME TEXT:
${resumeText}`;

  try {
    const profile = await callLLMStructured(SYSTEM_PROMPT, userPrompt, {
      temperature: 0.1,
      max_tokens: 2000,
    });

    // Ensure required fields exist with safe defaults
    return {
      personal_info: profile.personal_info || { name: '', email: '' },
      skills: Array.isArray(profile.skills) ? profile.skills : [],
      total_experience_years: profile.total_experience_years || 0,
      work_history: Array.isArray(profile.work_history) ? profile.work_history : [],
      education: Array.isArray(profile.education) ? profile.education : [],
      certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
      domains: Array.isArray(profile.domains) ? profile.domains : [],
      seniority_level: profile.seniority_level || 'mid',
    };
  } catch (err) {
    logger.error('Resume parsing failed:', err.message);
    throw new Error(`Resume parsing failed: ${err.message}`);
  }
};

module.exports = { parseResume };
