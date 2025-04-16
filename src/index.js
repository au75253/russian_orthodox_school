// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/styles.css';
import './styles/chatbot.css';

// Internationalization
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import en from './i18n/en.json';
import ru from './i18n/ru.json';

// AOS for animations
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: localStorage.getItem('preferredLanguage') || 'ru',
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
