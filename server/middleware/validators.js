const { body, validationResult } = require('express-validator');

/**
 * Validates contact form input
 * Sanitizes and validates all input fields
 */
const validateContactForm = [
  // Name - required, trimmed, no special chars
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape()
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  // Email - required, valid email format
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail()
    .escape(),
  
  // Phone - optional, valid format
  body('phone')
    .trim()
    .optional()
    .matches(/^[0-9\+\-\(\)\s]+$/).withMessage('Please enter a valid phone number')
    .escape(),
  
  // Subject - required, no excessive length
  body('subject')
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters')
    .escape(),
  
  // Message - required, no excessive length
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
    .escape()
];

/**
 * Middleware to check validation results
 * Sends appropriate error response if validation fails
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

/**
 * Advanced spam detection based on content patterns
 * Checks for common spam indicators
 */
const spamDetection = (req, res, next) => {
  const { message, subject } = req.body;
  
  // Common spam phrases (add more as needed)
  const spamPhrases = [
    'buy now', 'special offer', 'discount', 'viagra', 'casino',
    'lottery', 'winner', 'free money', 'earn money', 'best price',
    'bitcoin', 'investment opportunity', 'enlargement', 'pharmacy',
    'best rates', 'no prescription', 'online pharmacy', 'cheap'
  ];
  
  const combinedText = (message + ' ' + subject).toLowerCase();
  
  // Check for spam phrases
  const spamScore = spamPhrases.reduce((score, phrase) => {
    if (combinedText.includes(phrase.toLowerCase())) {
      return score + 1;
    }
    return score;
  }, 0);
  
  // Check for excessive URLs (common in spam)
  const urlCount = (combinedText.match(/https?:\/\//g) || []).length;
  
  // Set spam flag if score is high or too many URLs
  if (spamScore > 2 || urlCount > 5) {
    req.isSpam = true;
  }
  
  next();
};

module.exports = {
  validateContactForm,
  checkValidation,
  spamDetection
}; 