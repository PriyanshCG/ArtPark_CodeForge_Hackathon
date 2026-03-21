/**
 * @file llm.service.js
 * @description Multi-provider LLM service wrapper.
 * Priority: Groq (Primary) -> Gemini (Fallback) -> OpenAI (Last Resort)
 * Embeddings: Gemini (Primary) -> OpenAI (Fallback)
 */
const { OpenAI } = require('openai');
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// ── Config ───────────────────────────────────────────────────────────────────

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'groq';
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'gemini';

const MODELS = {
  groq: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  gemini: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  openai: process.env.OPENAI_MODEL || 'gpt-4o',
  embedding_gemini: process.env.EMBEDDING_MODEL_GEMINI || 'text-embedding-004',
  embedding_openai: process.env.EMBEDDING_MODEL_OPENAI || 'text-embedding-3-small',
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const DUMMY_KEY_PREFIX = 'dummy_';
const IS_MOCK_MODE = process.env.MOCK_LLM === 'true' || 
  (process.env.GEMINI_API_KEY?.startsWith(DUMMY_KEY_PREFIX) && 
   process.env.GROQ_API_KEY?.startsWith(DUMMY_KEY_PREFIX));

// ── Clients ───────────────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sleep helper for retries.
 */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Bulletproof JSON extraction from LLM responses.
 * Handles raw JSON and markdown code blocks.
 */
const extractJSON = (text) => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try extracting from code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (e2) {
        logger.error('Failed to parse extracted JSON block:', e2.message);
      }
    }
    // 3. Last ditch: find first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch (e3) {
        logger.error('Failed to parse regex-sliced JSON:', e3.message);
      }
    }
    throw new Error('Could not extract valid JSON from LLM response');
  }
};

// ── Implementation ────────────────────────────────────────────────────────────

/**
 * Helper to call a specific provider.
 */
const callProvider = async (provider, systemPrompt, userPrompt, isStructured = false, customOptions = {}) => {
  logger.info(`Calling LLM provider: ${provider} (${isStructured ? 'Structured' : 'Text'})`);

  if (provider === 'groq') {
    const options = {
      model: MODELS.groq,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      ...customOptions
    };
    if (isStructured) options.response_format = { type: 'json_object' };
    const completion = await groq.chat.completions.create(options);
    return completion.choices[0]?.message?.content ?? '';
  }

  if (provider === 'gemini') {
    const modelOptions = { model: MODELS.gemini };
    if (customOptions.max_tokens) {
      modelOptions.generationConfig = { maxOutputTokens: customOptions.max_tokens };
    }
    const model = genAI.getGenerativeModel(modelOptions);
    const fullPrompt = `System: ${systemPrompt}\n\nUser: ${userPrompt}${isStructured ? '\n\nIMPORTANT: Return ONLY valid JSON.' : ''}`;
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  }

  if (provider === 'openai') {
    const options = {
      model: MODELS.openai,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      ...customOptions
    };
    if (isStructured) options.response_format = { type: 'json_object' };
    const completion = await openai.chat.completions.create(options);
    return completion.choices[0]?.message?.content ?? '';
  }

  throw new Error(`Unsupported provider: ${provider}`);
};

/**
 * Call the LLM with fallback logic.
 * @returns {Promise<string>}
 */
const callLLMText = async (systemPrompt, userPrompt, options = {}) => {
  if (IS_MOCK_MODE) {
    logger.warn('🚀 MOCK MODE ACTIVE: Falling back to local mock LLM.');
    return getMockResponse(userPrompt, false);
  }

  const providers = [LLM_PROVIDER, 'gemini', 'openai'].filter((p, i, a) => a.indexOf(p) === i);
  for (const provider of providers) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await callProvider(provider, systemPrompt, userPrompt, false, options);
        return response;
      } catch (err) {
        logger.warn(`${provider} attempt ${attempt} failed: ${err.message}`);
        if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
      }
    }
    logger.error(`${provider} failed after ${MAX_RETRIES} attempts. Trying next fallback...`);
  }

  logger.warn('⚠️ All providers failed, using emergency mock fallback.');
  return getMockResponse(userPrompt, false);
};

/**
 * Call the LLM expecting a structured JSON response.
 * @returns {Promise<object>}
 */
const callLLMStructured = async (systemPrompt, userPrompt) => {
  if (IS_MOCK_MODE) {
    logger.warn('🚀 MOCK MODE ACTIVE: Falling back to local structured mock LLM.');
    return getMockResponse(userPrompt, true);
  }

  const providers = [LLM_PROVIDER, 'gemini', 'openai'].filter((p, i, a) => a.indexOf(p) === i);

  for (const provider of providers) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await callProvider(provider, systemPrompt, userPrompt, true);
        return extractJSON(response);
      } catch (err) {
        logger.warn(`${provider} attempt ${attempt} failed: ${err.message}`);
        if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
      }
    }
    logger.error(`${provider} failed after ${MAX_RETRIES} attempts. Trying next fallback...`);
  }

  logger.warn('⚠️ All providers failed, using emergency structured mock fallback.');
  return getMockResponse(userPrompt, true);
};

/**
 * Emergency mock response generator for demo robustness.
 */
function getMockResponse(prompt, isStructured) {
  const text = prompt.toLowerCase();
  
  if (!isStructured) {
    return "This is a mock response because LLM API keys are missing or invalid. The system has automatically activated Demo Robustness Mode.";
  }

  // --- MOCK RESUME PARSING ---
  if (text.includes('parse the following resume')) {
    const skills = [];
    if (text.includes('javascript') || text.includes('js')) skills.push({ name: 'JavaScript', proficiency: 'expert', years_experience: 5 });
    if (text.includes('react')) skills.push({ name: 'React', proficiency: 'advanced', years_experience: 3 });
    if (text.includes('node')) skills.push({ name: 'Node.js', proficiency: 'intermediate', years_experience: 2 });
    if (text.includes('python')) skills.push({ name: 'Python', proficiency: 'intermediate', years_experience: 2 });
    if (text.includes('docker')) skills.push({ name: 'Docker', proficiency: 'beginner', years_experience: 1 });
    
    if (skills.length === 0) skills.push({ name: 'General Engineering', proficiency: 'advanced', years_experience: 3 });

    return {
      personal_info: { name: 'Demo Candidate', email: 'demo@example.com', phone: '555-0123' },
      skills,
      total_experience_years: 5,
      work_history: [{ title: 'Software Engineer', company: 'Innovation Inc', duration_years: 3, key_skills: skills.map(s => s.name) }],
      domains: ['fullstack'],
      seniority_level: 'mid'
    };
  }

  // --- MOCK JD PARSING ---
  if (text.includes('parse the following job description')) {
    return {
      role_title: 'Full Stack Developer',
      company_name: 'ArtPark Demo Corp',
      required_skills: [
        { name: 'JavaScript', proficiency_required: 'expert', is_mandatory: true },
        { name: 'React', proficiency_required: 'expert', is_mandatory: true },
        { name: 'Docker', proficiency_required: 'intermediate', is_mandatory: true }
      ],
      nice_to_have_skills: [
        { name: 'TypeScript', proficiency_required: 'intermediate', is_mandatory: false }
      ],
      role_domain: 'fullstack',
      seniority_level: 'senior'
    };
  }

  // --- MOCK ENRICHMENT / OTHER ---
  return {
    enriched_steps: [],
    overall_coaching_note: "Mode of Demo Robustness active. Please provide valid API keys in .env for full AI functionality."
  };
}

/**
 * Get embedding vector from Gemini or OpenAI.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
const getEmbedding = async (text) => {
  const providers = [EMBEDDING_PROVIDER, 'gemini', 'openai'].filter((p, i, a) => a.indexOf(p) === i);

  for (const provider of providers) {
    try {
      if (provider === 'gemini') {
        logger.debug('Getting embedding via Gemini');
        const model = genAI.getGenerativeModel({ model: MODELS.embedding_gemini });
        const result = await model.embedContent(text);
        return Array.from(result.embedding.values);
      }
      if (provider === 'openai') {
        logger.debug('Getting embedding via OpenAI');
        const response = await openai.embeddings.create({
          model: MODELS.embedding_openai,
          input: text.slice(0, 8000),
        });
        return response.data[0].embedding;
      }
    } catch (err) {
      logger.warn(`Embedding fail on ${provider}: ${err.message}`);
    }
  }
  throw new Error('Embedding failed on all providers');
};

/**
 * Get embeddings for multiple texts in batch.
 */
const getEmbeddingsBatch = async (texts) => {
  const results = [];
  for (const text of texts) {
    try {
      results.push(await getEmbedding(text));
    } catch (err) {
      logger.warn(`Batch embedding failed for snippet: ${text.slice(0, 30)}...`);
      results.push(null);
    }
  }
  return results;
};

module.exports = {
  callLLMText,
  callLLMStructured,
  getEmbedding,
  getEmbeddingsBatch,
  // Legacy support aliases if any
  callLLM: callLLMText,
};
