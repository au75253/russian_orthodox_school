// src/pages/Lessons.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

function Lessons() {
  const { t } = useTranslation();

  // Updated with actual curriculum information
  const lessonsContent = {
    title: "Our Curriculum",
    description: "At St. Aiden & Chad Russian Orthodox School in Nottingham, we offer a focused curriculum that emphasizes Russian language, culture, and Orthodox Christian education.",
    courses: [
      {
        title: "Закон Божий (Law of God)",
        description: "Students learn about Orthodox Christian faith, traditions, and practices through age-appropriate lessons, prayer, and participation in services. Taught by Alexander Ushakov, a graduate of St. Tikhon University in Moscow.",
        grades: "All ages",
        schedule: "Weekly"
      },
      {
        title: "Russian Language (Younger Students)",
        description: "Our beginning Russian language program develops reading, writing, speaking, and comprehension skills for younger students. Taught by Alina, who specializes in making language acquisition engaging for young learners.",
        grades: "Ages 4-7",
        schedule: "Weekly"
      },
      {
        title: "Russian Language (Middle Students)",
        description: "Middle-level Russian language instruction builds upon the foundations with more advanced grammar, vocabulary, and conversation skills. Taught by Lydia Mikhalovna, who brings over 40 years of teaching experience.",
        grades: "Ages 8-12",
        schedule: "Weekly"
      },
      {
        title: "Russian Language (Older Students)",
        description: "Advanced Russian language study for older students, focusing on complex grammar, extensive vocabulary, and fluent conversation. Taught by Tatyana Ball, who specializes in higher-level language instruction.",
        grades: "Ages 13+",
        schedule: "Weekly"
      },
      {
        title: "Russian Literature",
        description: "Students explore Russian literary classics, poetry, and cultural texts appropriate to their age and language level. Our three Russian language teachers lead literature components appropriate to each age group.",
        grades: "All ages",
        schedule: "Weekly"
      },
      {
        title: "Music - Solfège",
        description: "Our unique music program teaches children musical fundamentals through Solfège instruction using engaging storytelling and creative props. Taught by Alla Ushakova, who has over 20 years of experience with this method.",
        grades: "Ages 4-10",
        schedule: "Weekly"
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
