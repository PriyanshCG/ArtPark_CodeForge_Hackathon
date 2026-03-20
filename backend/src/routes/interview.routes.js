/**
 * @file interview.routes.js
 * @description Interview Preparation endpoints — Q&A generation + Mock Interview conversation
 */
const express = require('express');
const router = express.Router();
const llmService = require('../services/llm.service');

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Bulletproof JSON extraction (handles markdown code fences)
 */
function extractJSON(text) {
  // 1. Try direct parse
  try { return JSON.parse(text); } catch {}
  // 2. Markdown code block
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) try { return JSON.parse(fenceMatch[1].trim()); } catch {}
  // 3. First [ … ]
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) try { return JSON.parse(arrMatch[0]); } catch {}
  // 4. First { … }
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) try { return JSON.parse(objMatch[0]); } catch {}
  throw new Error('Could not extract JSON from LLM response');
}

// ── POST /api/interview/qa ─────────────────────────────────────────────────────
/**
 * Generate expert Q&A pairs for a given skill profile.
 * Body: { jobRole, skills, experienceLevel, interviewType }
 */
router.post('/qa', async (req, res) => {
  try {
    const {
      jobRole = 'Software Engineer',
      skills = [],
      experienceLevel = 'Mid',
      interviewType = 'Mixed',
    } = req.body;

    const systemPrompt = `You are a world-class technical interviewer and career coach with 15+ years of experience hiring at top tech companies (FAANG, startups, unicorns). You create precise, insightful interview questions tailored to a candidate's exact skill set and experience level. Always return responses in valid JSON only — no extra text, no markdown fences.`;

    const randomSeed = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().toISOString();

    const focusAngles = [
      "Focus heavily on real-world architecture decisions",
      "Focus on debugging and problem solving scenarios",
      "Focus on team collaboration and leadership challenges",
      "Focus on performance optimization and scalability",
      "Focus on security, edge cases, and failure handling",
      "Focus on system design trade-offs and decision making",
      "Focus on code quality, testing, and best practices",
      "Focus on recent industry trends and modern tooling"
    ];
    const randomFocus = focusAngles[Math.floor(Math.random() * focusAngles.length)];

    const topicEmphasis = [
      "Emphasize questions about past project failures and lessons learned",
      "Emphasize questions about handling ambiguity and unclear requirements",
      "Emphasize questions about mentoring junior developers",
      "Emphasize questions about cross-functional team communication",
      "Emphasize questions about technical debt and refactoring decisions",
      "Emphasize questions about scaling systems under pressure"
    ];
    const randomEmphasis = topicEmphasis[Math.floor(Math.random() * topicEmphasis.length)];

    const difficultyOrders = [
      "Start with Hard, go to Medium, end with Easy",
      "Start with Easy, escalate to Hard progressively",
      "Alternate between Hard and Easy throughout",
      "Random difficulty order — no pattern"
    ];
    const randomDiffOrder = difficultyOrders[Math.floor(Math.random() * difficultyOrders.length)];

    const userPrompt = `
[SESSION_ID: ${randomSeed}] [TIMESTAMP: ${timestamp}]

You are generating a FRESH, UNIQUE set of interview questions that have NEVER been generated before.
Do NOT repeat questions from any previous session.
Do NOT use generic or obvious questions like "Tell me about yourself" or "What are your strengths".

UNIQUE GENERATION INSTRUCTIONS FOR THIS SESSION:
- ${randomFocus}
- ${randomEmphasis}  
- Difficulty order: ${randomDiffOrder}
- Generate questions that a Senior interviewer at a top tech company would actually ask today.
- Each question must be distinctly different from the others — no overlapping themes.

You MUST return EXACTLY 8 interview Q&A pairs.
Return ONLY a raw JSON array. No text before it. No text after it. Start with [ end with ].

Candidate Profile:
- Job Role: ${jobRole}
- Skills: ${skills.join(", ")}
- Experience Level: ${experienceLevel}
- Interview Type: ${interviewType}

Each object in the array must follow this exact structure:
{
  "id": (number 1-8),
  "category": "Technical" | "Behavioral" | "System Design" | "Problem Solving",
  "difficulty": "Easy" | "Medium" | "Hard",
  "question": "(A specific, unique, non-generic question)",
  "idealAnswer": "(A detailed 3-5 sentence model answer with concrete examples)",
  "keyPoints": ["specific point 1", "specific point 2", "specific point 3"],
  "followUp": "(A probing follow-up question that digs deeper)"
}

Difficulty distribution: 2 Easy, 3 Medium, 3 Hard.
Mix of categories: at least 1 from each category type.
START YOUR RESPONSE WITH [ AND END WITH ]
`;

    // 🚨 NUCLEAR FIX LOGS 🚨
    console.log("1. SEED:", randomSeed);
    console.log("2. TEMPERATURE IN BODY:", 1.0); // Backend uses llmService options

    const raw = await llmService.callLLMText(systemPrompt, userPrompt, { max_tokens: 4000, temperature: 1.0 });
    
    // Explicit cleaning as requested in prompt #3
    const stripped = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonStart = stripped.indexOf("[");
    const jsonEnd = stripped.lastIndexOf("]");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Could not find array brackets in LLM response");
    }
    
    const jsonOnly = stripped.substring(jsonStart, jsonEnd + 1);
    const qaList = JSON.parse(jsonOnly);

    if (!Array.isArray(qaList) || qaList.length === 0) {
      throw new Error("Parsed result is not a valid array");
    }

    console.log("3. QALIST LENGTH BEFORE SET:", qaList.length);
    console.log(`✅ Successfully parsed ${qaList.length} questions`);

    res.json({ success: true, data: { qaList } });
  } catch (err) {
    console.error('[interview/qa] Error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Q&A generation failed' });
  }
});

// ── POST /api/interview/chat ───────────────────────────────────────────────────
/**
 * Single-turn mock interview conversation endpoint.
 * Maintains stateless design — history is sent from the client each turn.
 * Body: { systemPrompt, messages }
 *   where messages = [{ role: 'user'|'assistant', content: string }, ...]
 */
router.post('/chat', async (req, res) => {
  try {
    const { systemPrompt, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'messages array required' });
    }

    // Build a single user prompt from the conversation (last user message)
    // We pass the full history as context in the user prompt so the LLM stays on track
    const historyContext = messages
      .slice(0, -1) // everything except the final user message
      .map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`)
      .join('\n\n');

    const lastMessage = messages[messages.length - 1]?.content || '';

    const userPrompt = historyContext
      ? `Previous conversation:\n${historyContext}\n\nCandidate's latest response: ${lastMessage}\n\nContinue the interview as described in your system instructions.`
      : lastMessage;

    const reply = await llmService.callLLMText(systemPrompt || '', userPrompt);

    res.json({ success: true, data: { reply } });
  } catch (err) {
    console.error('[interview/chat] Error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Interview chat failed' });
  }
});

module.exports = router;
