const express = require('express');
const router = express.Router();
const llmService = require('../services/llm.service');

/**
 * AI Mentor Chat Endpoint
 * POST /api/chat
 */
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Build context-aware system prompt
    let systemPrompt = `You are an AI learning mentor for ArtPark, a platform that helps users bridge skill gaps for their dream roles.
    
Help the user understand their learning journey, answer questions about skills or courses, and provide career advice.
Keep responses concise (max 3 sentences), motivating, and professional. Use emojis occasionally for a friendly tone.`;

    if (context) {
      systemPrompt += `\n\nUser's Learning Context:
- Role: ${context.role || 'Professional'}
- Readiness Score: ${context.readinessScore || 'N/A'}%
- Roadmap Steps: ${context.roadmap ? context.roadmap.map(s => s.title).join(', ') : 'Currently being generated'}

Refer to these details when answering if relevant.`;
    }

    const response = await llmService.callLLMText(systemPrompt, message);

    res.json({
      success: true,
      data: {
        reply: response
      }
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response'
    });
  }
});

module.exports = router;
