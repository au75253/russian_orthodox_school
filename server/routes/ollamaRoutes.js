const express = require('express');
const router = express.Router();
const { Ollama } = require('ollama');
const { ollamaRateLimiter } = require('../middleware/rateLimit');

// Get Ollama API endpoint from env vars
const OLLAMA_API = process.env.OLLAMA_API || 'http://127.0.0.1:11434';

// Create Ollama client with proper configuration
const ollama = new Ollama({ host: OLLAMA_API });

/**
 * POST /api/ollama/chat
 * Proxies chat requests to Ollama, with rate limiting and validation
 */
router.post('/chat', ollamaRateLimiter, async (req, res) => {
  try {
    const { message, model = process.env.OLLAMA_DEFAULT_MODEL || 'llama2' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }
    
    // Log the request (omit in production for privacy reasons)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Ollama request: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    }
    
    // Use the official Ollama JS library
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: message }],
      options: {
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        num_predict: 500 // equivalent to max_tokens
      }
    });
    
    // Return the response
    return res.status(200).json({
      success: true,
      response: response.message.content
    });
    
  } catch (error) {
    console.error('Ollama proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to communicate with Ollama service' 
    });
  }
});

module.exports = router; 