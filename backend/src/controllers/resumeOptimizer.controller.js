/**
 * @file resumeOptimizer.controller.js
 * @description Controller for deep AI resume optimization
 */
const { callLLMStructured } = require('../services/llm.service');
const { sendSuccess, sendError } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * POST /api/resume/optimize
 * Performs surgical AI resume optimization based on JD and skill gaps.
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const optimizeResume = async (req, res) => {
  try {
    const { 
      resumeText, 
      jobDescription, 
      missingSkills = [], 
      currentSkills = [], 
      targetRole = 'Software Engineer', 
      seniority = 'Mid' 
    } = req.body;

    if (!resumeText || !jobDescription) {
      return sendError(res, 'Both resumeText and jobDescription are required.', 400);
    }

    logger.info(`Optimizing resume for role: ${targetRole} (${seniority})`);

    const systemPrompt = `You are an elite technical resume consultant and ATS optimization expert with 15+ years of experience helping software engineers land roles at FAANG companies. Always return valid JSON only.`;

    const userPrompt = `
A candidate is applying for the role of: "${targetRole}" at ${seniority} level.

Their current resume text is:
---
${resumeText}
---

The Job Description they are targeting is:
---
${jobDescription}
---

Skills they are MISSING compared to the JD: ${missingSkills.join(', ')}
Skills they ALREADY HAVE: ${currentSkills.join(', ')}

Your task is to perform a deep, surgical resume optimization. You must:
1. Identify every bullet point or section in the resume that is weak, generic, or does not align with the JD
2. Rewrite those specific bullet points using the STAR format (Situation, Task, Action, Result) and inject quantifiable metrics wherever possible
3. Suggest exactly which missing skills to add and WHERE in the resume to add them (which section, after which line)
4. Identify ATS keyword gaps — list every important keyword from the JD that is absent from the resume
5. Give a final "Optimized Resume Score" out of 100 with a breakdown by: ATS Match (30pts), Keyword Density (20pts), Impact Language (25pts), Structure (25pts)

Respond ONLY in this exact JSON format with no preamble or markdown:
{
  "optimizedScore": 78,
  "scoreBreakdown": {
    "atsMatch": 22,
    "keywordDensity": 14,
    "impactLanguage": 20,
    "structure": 22
  },
  "rewrittenBullets": [
    {
      "original": "Worked on backend APIs",
      "rewritten": "Engineered 12 RESTful microservice APIs using Node.js and Express, reducing average response latency by 34% and handling 50K+ daily requests",
      "reason": "Original lacked metrics, action verbs, and specific technologies mentioned in JD"
    }
  ],
  "skillInjections": [
    {
      "skill": "Kubernetes",
      "suggestedSection": "Technical Skills",
      "context": "Add under DevOps/Infrastructure subsection. Mention basic orchestration experience if applicable."
    }
  ],
  "atsKeywordGaps": ["CI/CD", "distributed systems", "system design"],
  "overallSuggestion": "Your resume reads as a junior engineer profile but you are targeting a senior role. The biggest gap is lack of ownership language — use words like 'led', 'architected', 'owned', 'drove' instead of 'worked on', 'helped', 'assisted'."
}
`;

    const result = await callLLMStructured(systemPrompt, userPrompt);

    return sendSuccess(res, result, 'Resume optimization complete');
  } catch (err) {
    logger.error('Resume optimization error:', err.message);
    return sendError(res, err.message || 'Failed to optimize resume', 500);
  }
};

module.exports = { optimizeResume };
