// src/pages/Contact.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({
    status: null, // 'success', 'error', null
    message: ''
  });

  // Updated with actual contact information
  const contactContent = {
    title: "Contact Us",
    description: "We welcome your inquiries and look forward to connecting with you. Please use the contact information below or fill out the form, and we will respond promptly.",
    info: {
      address: "Carlton Hill, Carlton, Nottingham NG4 1EE, United Kingdom",
      phone: "+447756023112",
      email: "info@staidenchadrussianschool.org",
      hours: "Sunday: 11:30 AM - 3:30 PM"
    }
  };

  // Clear form status after 5 seconds
  useEffect(() => {
    if (formStatus.status) {
      const timer = setTimeout(() => {
        setFormStatus({ status: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters and spaces';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional)
    if (formData.phone && !/^[0-9+\-()\s]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.length < 2) {
      errors.subject = 'Subject must be at least 2 characters';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set submitting state to show loading
    setIsSubmitting(true);
    
    try {
      // Use the URL of your API
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/contact'  // In production, use relative path
        : 'http://localhost:5000/api/contact'; // In development
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors from server
        if (data.errors && Array.isArray(data.errors)) {
          const serverErrors = {};
          data.errors.forEach(error => {
            serverErrors[error.field] = error.message;
          });
          setFormErrors(serverErrors);
          throw new Error(data.message || 'Form submission failed');
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      }
      
      // Success
      setFormStatus({
        status: 'success',
        message: t('form_success', data.message)
      });
      
      // Reset the form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        status: 'error',
        message: error.message || 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 data-aos="fade-up">{t('contact_main_title', contactContent.title)}</h1>
        <p className="lead-text" data-aos="fade-up" data-aos-delay="200">
          {t('contact_description', contactContent.description)}
        </p>

        <div className="contact-container">
          <div className="contact-info" data-aos="fade-up" data-aos-delay="300">
            <h2>{t('contact_info', 'Contact Information')}</h2>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <strong>{t('address', 'Address')}:</strong><br />
                {t('school_address', contactContent.info.address)}
              </div>
            </div>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <div>
                <strong>{t('phone', 'Phone')}:</strong><br />
                {t('school_phone', contactContent.info.phone)}
              </div>
            </div>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <strong>{t('email', 'Email')}:</strong><br />
                {t('school_email', contactContent.info.email)}
              </div>
            </div>
            
            <div className="contact-detail">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <strong>{t('hours', 'Hours')}:</strong><br />
                {t('school_hours', contactContent.info.hours)}
              </div>
            </div>
          </div>

          <div className="contact-form" data-aos="fade-up" data-aos-delay="400">
            <h2>{t('send_message', 'Send Us a Message')}</h2>
            
            {/* Form status message */}
            {formStatus.status && (
              <div className={`form-message ${formStatus.status}`}>
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className={`form-group ${formErrors.name ? 'error' : ''}`}>
                <label htmlFor="name">{t('form_name', 'Name')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              
              <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
                <label htmlFor="email">{t('form_email', 'Email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
              
              <div className={`form-group ${formErrors.phone ? 'error' : ''}`}>
                <label htmlFor="phone">{t('form_phone', 'Phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
              </div>
              
              <div className={`form-group ${formErrors.subject ? 'error' : ''}`}>
                <label htmlFor="subject">{t('form_subject', 'Subject')}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.subject && <div className="error-message">{formErrors.subject}</div>}
              </div>
              
              <div className={`form-group ${formErrors.message ? 'error' : ''}`}>
                <label htmlFor="message">{t('form_message', 'Message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                ></textarea>
                {formErrors.message && <div className="error-message">{formErrors.message}</div>}
              </div>
              
              <button 
                type="submit" 
                className="btn primary-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('form_submitting', 'Sending...') : t('form_submit', 'Send Message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
