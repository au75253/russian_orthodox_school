const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Using node-fetch instead of Ollama library
const { ollamaRateLimiter } = require('../middleware/rateLimit');

// Get Ollama API endpoint from env vars - use Docker service name
const OLLAMA_API = process.env.OLLAMA_API || 'http://ollama:11434';

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
    
    // Use fetch instead of the Ollama library
    const ollamaResponse = await fetch(`${OLLAMA_API}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        options: {
          temperature: 0.7,
          top_k: 50,
          top_p: 0.95,
          num_predict: 500 // equivalent to max_tokens
        },
        stream: false
      })
    });
    
    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API returned ${ollamaResponse.status}: ${ollamaResponse.statusText}`);
    }
    
    const data = await ollamaResponse.json();
    
    // Return the response
    return res.status(200).json({
      success: true,
      response: data.message.content
    });
    
  } catch (error) {
    console.error('Ollama proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to communicate with Ollama service' 
    });
  }
});

/**
 * POST /api/ollama/stream
 * Streams chat responses from Ollama, with rate limiting and validation
 */
router.post('/stream', ollamaRateLimiter, async (req, res) => {
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
      console.log(`Ollama streaming request: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    }
    
    // Set up headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Connect to Ollama with streaming enabled
    const ollamaResponse = await fetch(`${OLLAMA_API}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        options: {
          temperature: 0.7,
          top_k: 50,
          top_p: 0.95,
          num_predict: 500 // equivalent to max_tokens
        },
        stream: true // Enable streaming
      })
    });
    
    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API returned ${ollamaResponse.status}: ${ollamaResponse.statusText}`);
    }
    
    // Process the stream from Ollama and forward to client
    const reader = ollamaResponse.body.getReader();
    
    let responseText = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Send the final event and end the stream
          res.write(`data: [DONE]\n\n`);
          break;
        }
        
        // Convert chunk to text
        const chunkText = new TextDecoder().decode(value);
        
        try {
          // Parse the JSON responses (Ollama may send multiple JSON objects in a single chunk)
          const lines = chunkText.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            const json = JSON.parse(line);
            
            if (json.message && json.message.content) {
              responseText += json.message.content;
              
              // Send the chunk to the client
              res.write(`data: ${JSON.stringify({ 
                content: json.message.content,
                done: false 
              })}\n\n`);
            }
          }
        } catch (e) {
          console.error('Error parsing JSON from Ollama:', e);
          // If we can't parse the JSON, send the raw chunk
          res.write(`data: ${JSON.stringify({ 
            content: chunkText,
            done: false,
            error: e.message
          })}\n\n`);
        }
      }
    } catch (streamError) {
      console.error('Stream processing error:', streamError);
      res.write(`data: ${JSON.stringify({ 
        error: 'Stream processing error',
        done: true
      })}\n\n`);
    }
    
    // End the response
    res.end();
    
  } catch (error) {
    console.error('Ollama streaming error:', error);
    
    // If headers haven't been sent yet, return JSON error
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to communicate with Ollama service' 
      });
    }
    
    // If headers have been sent, send error as event
    res.write(`data: ${JSON.stringify({ 
      error: 'Ollama service error: ' + error.message,
      done: true
    })}\n\n`);
    res.end();
  }
});

// Keep the chat/stream endpoint for backwards compatibility
router.post('/chat/stream', (req, res) => {
  // Forward to the new /stream endpoint
  router.handle(req, res);
});

module.exports = router; 