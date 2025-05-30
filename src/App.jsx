// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './styles/chatbot.css'; // Import chatbot styles
import './styles/mobile.css'; // Import mobile-specific styles

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Teachers from './pages/Teachers';
import Policies from './pages/Policies';
import Lessons from './pages/Lessons';
import Contact from './pages/Contact';

function App() {
  useEffect(() => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    // Add Font Awesome for icons
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);

    console.log("App component loaded, ChatBot will render");
    
    // Signal that React has loaded to the fallback chatbot
    try {
      window.reactLoaded = true;
      console.log("Set reactLoaded flag to true");
    } catch (e) {
      console.error("Failed to set reactLoaded flag:", e);
    }

    // Add a class to body for mobile detection
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        document.body.classList.add('is-mobile');
      } else {
        document.body.classList.remove('is-mobile');
      }
    };
    
    // Check on load and resize
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      // Clean up
      document.head.removeChild(link);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <Router>
      <div className="safe-area-top">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        {/* Only use the main ChatBot */}
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
