// src/pages/Lessons.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

function Lessons() {
  const { t } = useTranslation();

  // Added actual content for the lessons page
  const lessonsContent = {
    title: "Our Curriculum",
    description: "At St. Nicholas Russian Orthodox School, we offer a comprehensive curriculum that combines academic excellence with Orthodox Christian values and Russian language and cultural education.",
    courses: [
      {
        title: "Orthodox Christian Studies",
        description: "Students learn about Orthodox Christian faith, traditions, and practices through age-appropriate lessons, prayer, and participation in services.",
        grades: "All grades",
        schedule: "Twice weekly"
      },
      {
        title: "Russian Language",
        description: "Our Russian language program develops reading, writing, speaking, and comprehension skills for students at all levels of proficiency.",
        grades: "All grades",
        schedule: "Daily"
      },
      {
        title: "Russian Literature and Culture",
        description: "Students explore Russian literary classics, history, traditions, and cultural practices to develop a deep appreciation for their heritage.",
        grades: "Grades 3-12",
        schedule: "Three times weekly"
      },
      {
        title: "Mathematics",
        description: "Our mathematics curriculum emphasizes problem-solving, logical reasoning, and application of mathematical concepts to real-world situations.",
        grades: "All grades",
        schedule: "Daily"
      },
      {
        title: "Science",
        description: "Students engage in hands-on scientific inquiry, experiments, and research projects across biology, chemistry, physics, and environmental science.",
        grades: "All grades",
        schedule: "Three times weekly"
      },
      {
        title: "English Language Arts",
        description: "Our English program develops reading, writing, speaking, and listening skills through literature study, composition, grammar, and vocabulary development.",
        grades: "All grades",
        schedule: "Daily"
      }
    ]
  };

  return (
    <div className="lessons-page">
      <div className="container">
        <h1 data-aos="fade-up">{t('lessons_main_title', lessonsContent.title)}</h1>
        <p className="lead-text" data-aos="fade-up" data-aos-delay="200">
          {t('lessons_description', lessonsContent.description)}
        </p>

        <div className="lessons-container">
          {lessonsContent.courses.map((course, index) => (
            <div 
              className="lesson-item" 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={300 + (index * 100)}
            >
              <h3>{t(`course_${index + 1}_title`, course.title)}</h3>
              <p>{t(`course_${index + 1}_description`, course.description)}</p>
              <div className="lesson-details">
                <span>
                  <strong>{t('grades', 'Grades')}:</strong> {t(`course_${index + 1}_grades`, course.grades)}
                </span>
                <span>
                  <strong>{t('schedule', 'Schedule')}:</strong> {t(`course_${index + 1}_schedule`, course.schedule)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lessons;
