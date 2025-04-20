// src/pages/Teachers.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import teacherImage from '../assets/images/teachers/teacher_dummy.jpg';

function Teachers() {
  const { t } = useTranslation();

  // Updated with actual teachers information
  const teachersContent = {
    title: "Our Faculty",
    description: "Our dedicated teachers are experienced professionals committed to providing quality education in Russian language, literature, music, and Orthodox studies.",
    teachers: [
      {
        name: "Father Gregory",
        role: "Headmaster",
        bio: "Father Gregory leads our school as Headmaster, bringing spiritual guidance and oversight to our educational community."
      },
      {
        name: "Alexander Ushakov",
        role: "Закон Божий (Law of God) Teacher",
        bio: "Mr. Ushakov graduated from St. Tikhon University in Moscow with a degree in Theology. He brings deep knowledge and spiritual insight to his teaching of Orthodox Christian faith and traditions."
      },
      {
        name: "Alla Ushakova",
        role: "Music Teacher",
        bio: "Mrs. Ushakova has over 20 years of experience teaching Solfège to children aged 4-10. She uses a unique system geared towards children, incorporating engaging storytelling and creative props to make music education fun and effective."
      },
      {
        name: "Alina",
        role: "Russian Language & Literature (Younger Classes)",
        bio: "Alina teaches Russian language and literature to our younger students. Her extensive experience and engaging teaching style helps build a solid foundation in Russian language skills for beginners."
      },
      {
        name: "Lydia Mikhalovna",
        role: "Russian Language & Literature (Middle Classes)",
        bio: "Mrs. Mikhalovna brings over 40 years of teaching experience to our middle-level Russian language and literature classes. Her comprehensive knowledge and dedication have inspired generations of students."
      },
      {
        name: "Tatyana Ball",
        role: "Russian Language & Literature (Older Classes)",
        bio: "Mrs. Ball leads our advanced Russian language and literature classes. Her extensive experience enables her to guide older students through complex linguistic concepts and classic Russian literature."
      }
    ]
  };

  return (
    <div className="teachers-page">
      <div className="container">
        <h1 data-aos="fade-up">{t('teachers_main_title', teachersContent.title)}</h1>
        <p className="lead-text" data-aos="fade-up" data-aos-delay="200">
          {t('teachers_description', teachersContent.description)}
        </p>

        <div className="teacher-cards">
          {teachersContent.teachers.map((teacher, index) => (
            <div 
              className="teacher-card" 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={300 + (index * 100)}
            >
              <img 
                src={teacherImage}
                alt={teacher.name} 
              />
              <h3>{t(`teacher_${index + 1}_name`, teacher.name)}</h3>
              <p><strong>{t(`teacher_${index + 1}_role`, teacher.role)}</strong></p>
              <p>{t(`teacher_${index + 1}_bio`, teacher.bio)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teachers;
