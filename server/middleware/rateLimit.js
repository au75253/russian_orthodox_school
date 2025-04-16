const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for contact form submissions
 * Limits to 5 submissions per IP address per hour
 */
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: { 
    success: false, 
    message: 'Too many contact requests. Please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Store to track by IP address
  keyGenerator: (req) => {
    return req.ip; // IP address from request
  }
});

/**
 * Rate limiter for admin login attempts
 * Limits to 10 login attempts per IP address per hour
 */
const adminLoginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 login attempts per hour
  message: { 
    success: false, 
    message: 'Too many login attempts. Please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for Ollama API requests
 * Limits to 50 requests per IP address per hour
 */
const ollamaRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: { 
    success: false, 
    message: 'Too many chatbot requests. Please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Store to track by IP address
  keyGenerator: (req) => {
    return req.ip; // IP address from request
  }
});

module.exports = {
  contactFormLimiter,
  adminLoginLimiter,
  ollamaRateLimiter
}; 