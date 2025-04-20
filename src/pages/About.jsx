// src/pages/About.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import aboutImage from '../assets/images/about.jpg'; // Place your image in this path

function About() {
  const { t } = useTranslation();

  // Updated with actual school information
  const aboutContent = {
    title: "About Our School",
    description: "St. Aiden & Chad Russian Orthodox School in Nottingham was established in 2024 to provide quality education in Russian language, literature, music, and Orthodox studies. We are associated with the Nottingham Russian Orthodox Church of St. Aiden & Chad, creating a strong community of faith and education.",
    mission: {
      title: "Our Mission",
      description: "Our mission is to educate students in a supportive environment that fosters Russian language fluency, spiritual growth, and cultural appreciation. We aim to cultivate a love for learning, respect for Orthodox traditions, and a strong moral foundation that will guide our students throughout their lives."
    },
    values: {
      title: "Our Values",
      items: [
        "Faith and Spirituality - We nurture the Orthodox Christian faith as the foundation of our educational approach",
        "Russian Language and Heritage - We are committed to teaching authentic Russian language and preserving cultural heritage",
        "Musical Education - We believe in the power of music education through our specialized Solfège teaching method",
        "Community and Service - We foster a sense of community within our school and the broader Russian Orthodox community in Nottingham"
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
