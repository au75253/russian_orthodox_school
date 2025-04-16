// src/pages/Home.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

function Home() {
  const { t } = useTranslation();

  // Added direct content instead of relying solely on translation keys
  // This will allow the site to display content even if translations aren't fully set up
  const content = {
    welcome: {
      title: "Welcome to St. Nicholas Russian Orthodox School",
      message: "We are dedicated to providing a nurturing environment where students can develop academically, spiritually, and personally. Our school combines rigorous academic standards with Orthodox Christian values to help students grow into well-rounded individuals."
    },
    about: {
      title: "About Our School",
      description: "Founded in 2010, St. Nicholas Russian Orthodox School serves the community by offering quality education rooted in Orthodox Christian traditions. We maintain small class sizes to ensure personalized attention and create a family-like atmosphere where each student is valued."
    },
    teachers: {
      title: "Our Dedicated Teachers",
      description: "Our faculty consists of experienced educators who are passionate about teaching and committed to the spiritual and academic growth of each student. They serve as mentors and role models, guiding students in their educational journey."
    },
    lessons: {
      title: "Our Curriculum",
      description: "We offer a comprehensive curriculum that includes standard academic subjects along with religious education, Russian language and culture. Our teaching approach emphasizes critical thinking, creativity, and practical application of knowledge."
    }
  };

  return (
    <div className="home-page">
      <Hero />
      
      <section className="welcome-section" data-aos="fade-up">
        <div className="container">
          <h2>{t('welcome_title', content.welcome.title)}</h2>
          <p className="lead-text">{t('welcome_message', content.welcome.message)}</p>
        </div>
      </section>
      
      <section className="about-preview" data-aos="fade-up">
        <div className="container">
          <h2>{t('about_title', content.about.title)}</h2>
          <p>{t('about_description', content.about.description)}</p>
          <Link to="/about" className="btn primary-btn">
            {t('read_more', 'Read More')}
          </Link>
        </div>
      </section>
      
      <section className="teachers-preview" data-aos="fade-up">
        <div className="container">
          <h2>{t('teachers_title', content.teachers.title)}</h2>
          <p>{t('teachers_description', content.teachers.description)}</p>
          <Link to="/teachers" className="btn secondary-btn">
            {t('meet_team', 'Meet Our Team')}
          </Link>
        </div>
      </section>
      
      <section className="lessons-preview" data-aos="fade-up">
        <div className="container">
          <h2>{t('lessons_title', content.lessons.title)}</h2>
          <p>{t('lessons_description', content.lessons.description)}</p>
          <Link to="/lessons" className="btn primary-btn">
            {t('explore_lessons', 'Explore Our Curriculum')}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
