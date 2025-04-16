// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.png';

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  const handleLinkClick = () => setNavOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${navOpen ? 'nav-open' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="School Logo" className="logo" />
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === '/' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {t('nav_home')}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={location.pathname === '/about' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {t('nav_about')}
              </Link>
            </li>
            <li>
              <Link
                to="/teachers"
                className={location.pathname === '/teachers' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {t('nav_teachers')}
              </Link>
            </li>
            <li>
              <Link
                to="/policies"
                className={location.pathname === '/policies' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {t('nav_policies')}
              </Link>
            </li>
            <li>
              <Link
                to="/lessons"
                className={location.pathname === '/lessons' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {t('nav_lessons')}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={location.pathname === '/contact' ? 'active' : ''}
                onClick={handleLinkClick}
              >
                {t('nav_contact')}
              </Link>
            </li>
          </ul>
        </nav>
        <LanguageSwitcher />
        <button className="nav-toggle" onClick={toggleNav} aria-label="Toggle navigation">
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
