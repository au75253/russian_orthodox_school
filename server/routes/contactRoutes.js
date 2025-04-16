const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { validateContactForm, checkValidation, spamDetection } = require('../middleware/validators');
const { contactFormLimiter } = require('../middleware/rateLimit');
const nodemailer = require('nodemailer');

/**
 * POST /api/contact
 * Handles contact form submissions
 * Protected by rate limiting, validation and spam detection
 */
router.post('/', contactFormLimiter, validateContactForm, checkValidation, spamDetection, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Create new message document
    const contactMessage = new ContactMessage({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: req.isSpam ? 'spam' : 'unread'
    });
    
    // Save to database
    await contactMessage.save();
    
    // Send notification email if not spam
    if (!req.isSpam) {
      await sendNotificationEmail(contactMessage);
    }
    
    // Return success with message ID
    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon!',
      messageId: contactMessage._id
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while sending your message. Please try again later.' 
    });
  }
});

/**
 * Helper function to send notification email to administrators
 */
async function sendNotificationEmail(contactMessage) {
  try {
    // Skip actual email sending in development/test mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email notification skipped (dev mode). Would send to:', 
        process.env.ADMIN_EMAIL || 'admin@stnicholasorthodoxschool.org');
      return;
    }
    
    // This should be configured with actual email service credentials
    // Using environment variables for security
    const transporter = nodemailer.createTransport({
      // For production use actual SMTP credentials
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@stnicholasorthodoxschool.org',
      to: process.env.ADMIN_EMAIL || 'admin@stnicholasorthodoxschool.org',
      subject: `New Contact Form: ${contactMessage.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactMessage.name}</p>
        <p><strong>Email:</strong> ${contactMessage.email}</p>
        <p><strong>Phone:</strong> ${contactMessage.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${contactMessage.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactMessage.message}</p>
        <hr>
        <p>Received at: ${contactMessage.createdAt}</p>
      `
    });
  } catch (error) {
    // Log but don't stop execution for email errors
    console.error('Email notification error:', error);
  }
}

module.exports = router; 