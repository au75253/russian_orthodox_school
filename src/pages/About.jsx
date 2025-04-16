// src/pages/About.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import aboutImage from '../assets/images/about.jpg'; // Place your image in this path

function About() {
  const { t } = useTranslation();

  // Added direct content for the about page
  const aboutContent = {
    title: "About Our School",
    description: "St. Nicholas Russian Orthodox School was established to provide quality education in a nurturing Orthodox Christian environment. We strive to develop well-rounded students who excel academically while growing in their faith and understanding of Russian Orthodox traditions.",
    mission: {
      title: "Our Mission",
      description: "Our mission is to educate students in a supportive environment that fosters academic excellence, spiritual growth, and community engagement. We aim to cultivate a love for learning, respect for tradition, and a strong moral foundation that will guide our students throughout their lives."
    },
    values: {
      title: "Our Values",
      items: [
        "Faith and Spirituality - We nurture the Orthodox Christian faith as the foundation of all aspects of our educational approach",
        "Academic Excellence - We uphold high academic standards and encourage intellectual curiosity and critical thinking",
        "Community and Service - We foster a sense of community within our school and encourage service to others",
        "Respect and Integrity - We value personal integrity, mutual respect, and responsibility toward self and others"
      ]
    }
  };

  return (
    <div className="about-page">
      <div className="about-section container">
        <h1 data-aos="fade-up">{t('about_main_title', aboutContent.title)}</h1>
        <p className="lead-text" data-aos="fade-up" data-aos-delay="200">
          {t('about_description', aboutContent.description)}
        </p>

        <div className="mission-values-section">
          <div className="mission-section" data-aos="fade-up" data-aos-delay="400">
            <h2>{t('mission_title', aboutContent.mission.title)}</h2>
            <p>{t('mission_description', aboutContent.mission.description)}</p>
          </div>

          <div className="values-section" data-aos="fade-up" data-aos-delay="600">
            <h2>{t('values_title', aboutContent.values.title)}</h2>
            <ul>
              {aboutContent.values.items.map((value, index) => (
                <li key={index}>
                  {t(`value_${index + 1}`, value)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <img
          src={aboutImage}
          alt="St. Nicholas Russian Orthodox School Building"
          className="responsive-image"
          data-aos="fade-up"
          data-aos-delay="800"
        />
      </div>
    </div>
  );
}

export default About;
