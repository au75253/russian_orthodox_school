// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
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

// More robust Telegram browser detection
const isTelegramBrowser = typeof window !== 'undefined' && (
  (window.isTelegramBrowser) || 
  (navigator.userAgent.indexOf('Telegram') !== -1) ||
  (window.Telegram !== undefined) ||
  (window.TelegramWebviewProxy !== undefined)
);

console.log("Telegram browser detection:", isTelegramBrowser);

// For development environments, handle Telegram browser special case
if (process.env.NODE_ENV === 'development' && isTelegramBrowser) {
  console.log("Telegram browser detected in development mode");
  
  // Check if we're already using the static server (port check)
  const isUsingStaticServer = window.location.port === '3000';
  
  if (!isUsingStaticServer) {
    console.log("Redirecting to static server for Telegram compatibility");
    // Redirect to the static server
    window.location.href = `${window.location.protocol}//${window.location.hostname}:3000${window.location.pathname}`;
  }
}

// Initialize AOS - disable animations in Telegram
AOS.init({
  duration: isTelegramBrowser ? 0 : 1000,
  once: true,
  disable: isTelegramBrowser ? true : false,
  startEvent: isTelegramBrowser ? null : 'DOMContentLoaded'
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

// Add global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser behavior (which might show an error)
  event.preventDefault();
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
