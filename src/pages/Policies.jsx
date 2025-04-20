// src/pages/Policies.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

function Policies() {
  const { t } = useTranslation();

  // Updated content for the policies page with correct school hours
  const policiesContent = {
    title: "School Policies",
    description: "Our school policies are designed to create a safe, respectful, and productive learning environment that supports both academic excellence and spiritual growth.",
    sections: [
      {
        title: "Attendance Policy",
        items: [
          "Students are expected to arrive on time for all classes. School begins at 11:30 AM on Sundays.",
          "Parents must notify the school office by 10:00 AM if a student will be absent.",
          "Extended absences require prior approval from the school administration.",
          "Regular attendance is essential for academic success and continued enrollment."
        ]
      },
      {
        title: "Uniform Policy",
        items: [
          "All students must wear the designated school uniform during school hours.",
          "Uniforms should be clean, properly fitted, and in good condition.",
          "On special occasions and religious feast days, formal uniforms are required.",
          "Physical education classes require the appropriate PE uniform."
        ]
      },
      {
        title: "Academic Standards",
        items: [
          "Students are expected to maintain a minimum grade point average of 2.0.",
          "Homework must be completed and submitted on time.",
          "Academic honesty is required; plagiarism or cheating will result in disciplinary action.",
          "Students experiencing academic difficulties will be offered additional support."
        ]
      },
      {
        title: "Behavior and Discipline",
        items: [
          "Students are expected to treat all members of the school community with respect.",
          "Bullying, harassment, or discriminatory behavior will not be tolerated.",
          "Students must respect school property and the property of others.",
          "The school follows a progressive discipline approach, with emphasis on guidance and redemption."
        ]
      }
    ]
  };

  return (
    <div className="policies-page">
      <div className="container">
        <h1 data-aos="fade-up">{t('policies_main_title', policiesContent.title)}</h1>
        <p className="lead-text" data-aos="fade-up" data-aos-delay="200">
          {t('policies_description', policiesContent.description)}
        </p>

        <div className="policy-container">
          {policiesContent.sections.map((section, sectionIndex) => (
            <div 
              className="policy-section" 
              key={sectionIndex} 
              data-aos="fade-up" 
              data-aos-delay={300 + (sectionIndex * 100)}
            >
              <h3>{t(`policy_section_${sectionIndex + 1}`, section.title)}</h3>
              <ol className="policy-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    {t(`policy_${sectionIndex + 1}_item_${itemIndex + 1}`, item)}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Policies;
