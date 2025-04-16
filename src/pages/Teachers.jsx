// src/pages/Teachers.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

function Teachers() {
  const { t } = useTranslation();

  // Added actual content for the teachers page
  const teachersContent = {
    title: "Our Faculty",
    description: "Our dedicated teachers are experienced professionals committed to providing quality education and nurturing the spiritual development of our students.",
    teachers: [
      {
        name: "Father Mikhail Ivanov",
        role: "School Director & Orthodox Studies Teacher",
        bio: "Father Mikhail has led our school for over 10 years. He holds a Master's degree in Education and Orthodox Theological Studies, and brings wisdom and compassion to his leadership."
      },
      {
        name: "Natalia Petrova",
        role: "Russian Language & Literature",
        bio: "Mrs. Petrova has 15 years of experience teaching Russian language and literature. She holds a Ph.D. in Russian Literature from Moscow State University."
      },
      {
        name: "Alexandra Sokolova",
        role: "Elementary Education & Mathematics",
        bio: "Ms. Sokolova specializes in early childhood education with a focus on mathematics. She creates engaging lessons that make learning enjoyable for our youngest students."
      },
      {
        name: "Sergei Kuznetsov",
        role: "History & Social Studies",
        bio: "Mr. Kuznetsov brings history to life with his dynamic teaching style. He has a Master's degree in History and has published several articles on Russian history."
      },
      {
        name: "Tatiana Orlova",
        role: "Science & Technology",
        bio: "Ms. Orlova has a background in Physics and Computer Science. She encourages hands-on learning and scientific inquiry in her classes."
      },
      {
        name: "Ivan Smirnov",
        role: "Physical Education & Health",
        bio: "Mr. Smirnov is a former professional athlete who teaches students the importance of physical health, teamwork, and discipline through sports and activities."
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
                src={`https://via.placeholder.com/150?text=${teacher.name.charAt(0)}`}
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
