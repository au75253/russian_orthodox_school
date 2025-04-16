// src/components/LanguageSwitcher.jsx

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Use getCurrentLanguage instead of directly accessing i18n.language
  // This handles potential undefined values better
  const getCurrentLanguage = useCallback(() => {
    try {
      return i18n?.language || localStorage.getItem('preferredLanguage') || 'ru';
    } catch (e) {
      console.error('Error getting current language:', e);
      return 'ru'; // Fallback to Russian
    }
  }, [i18n]);

  const changeLanguage = useCallback((lng) => {
    try {
      if (i18n && typeof i18n.changeLanguage === 'function') {
        i18n.changeLanguage(lng);
      }
      localStorage.setItem('preferredLanguage', lng);
    } catch (e) {
      console.error('Error changing language:', e);
      // Try just localStorage if i18n fails
      try {
        localStorage.setItem('preferredLanguage', lng);
      } catch (storageError) {
        console.error('localStorage also failed:', storageError);
      }
    }
  }, [i18n]);

  const currentLanguage = getCurrentLanguage();

  return (
    <div className="language-switch">
      <button
        className={`lang-btn ${currentLanguage === 'ru' ? 'active' : ''}`}
        onClick={() => changeLanguage('ru')}
        aria-label="Switch to Russian"
      >
        RU
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;
