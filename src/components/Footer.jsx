// src/components/Footer.jsx

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import feather from 'feather-icons';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <footer className="safe-area-bottom">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/">{t('nav_home')}</a>
          <a href="/about">{t('nav_about')}</a>
          <a href="/teachers">{t('nav_teachers')}</a>
          <a href="/policies">{t('nav_policies')}</a>
          <a href="/lessons">{t('nav_lessons')}</a>
          <a href="/contact">{t('nav_contact')}</a>
        </div>
        <div className="footer-social">
          <a href="https://facebook.com" aria-label="Facebook">
            <i data-feather="facebook"></i>
          </a>
          <a href="https://twitter.com" aria-label="Twitter">
            <i data-feather="twitter"></i>
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <i data-feather="instagram"></i>
          </a>
        </div>
        <div className="copyright-wrapper">
          <p className="copyright">© {currentYear} {t('home_title')}. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
