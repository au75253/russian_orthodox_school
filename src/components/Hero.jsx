// src/components/Hero.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import heroVideo from '../assets/videos/hero-video.mp4'; // Place your video in this path

function Hero() {
  const { t } = useTranslation();

  // Added direct content for the hero section
  const heroContent = {
    title: "St. Nicholas Russian Orthodox School",
    description: "Nurturing academic excellence and spiritual growth in a supportive Orthodox Christian environment"
  };

  return (
    <section className="hero">
      <video autoPlay muted loop id="hero-video">
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="hero-content">
        <h1 data-aos="fade-up">{t('hero_title', heroContent.title)}</h1>
        <p data-aos="fade-up" data-aos-delay="200">
          {t('hero_description', heroContent.description)}
        </p>
        <div data-aos="fade-up" data-aos-delay="400" className="hero-buttons">
          <Link to="/about" className="btn primary-btn">
            {t('read_more', 'Learn More')}
          </Link>
          <Link to="/contact" className="btn secondary-btn">
            {t('nav_contact', 'Contact Us')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
