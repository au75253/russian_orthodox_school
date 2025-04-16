import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Main ChatBot component wrapper that decides which version to render
const ChatBot = () => {
  // Check if running in Telegram browser
  const isTelegramBrowser = typeof window !== 'undefined' && 
    ((window.isTelegramBrowser) || 
     (navigator.userAgent.indexOf('Telegram') !== -1) ||
     (window.Telegram !== undefined));
     
  // Return the appropriate version based on browser
  return isTelegramBrowser ? <TelegramChatBot /> : <StandardChatBot />;
};

// Simplified ChatBot for Telegram browser
const TelegramChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // For Telegram, just open email client with the message
    const subject = encodeURIComponent("Question from website");
    const body = encodeURIComponent(message);
    const mailToLink = `mailto:info@stnicholasorthodoxschool.org?subject=${subject}&body=${body}`;
    
    window.location.href = mailToLink;
    
    // Reset the form
    setMessage('');
    setIsOpen(false);
  };
  
  if (!isOpen) {
    return (
      <div 
        className="telegram-chat-toggle"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#4CAF50',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 999,
          cursor: 'pointer',
          fontSize: '24px'
        }}
      >
        💬
      </div>
    );
  }
  
  return (
    <div 
      className="telegram-chat-window"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      <div 
        className="telegram-chat-header"
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px 15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>{t('chatbot_title', 'Contact Us')}</div>
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
      
      <div 
        className="telegram-chat-body"
        style={{
          padding: '15px'
        }}
      >
        <p style={{ marginTop: 0 }}>
          {t('telegram_chat_message', 'Send us your question and we\'ll contact you soon:')}
        </p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('your_message', 'Your message')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '100px',
              marginBottom: '10px',
              resize: 'none'
            }}
          />
          
          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
              width: '100%',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            disabled={!message.trim()}
          >
            {t('send_message', 'Send Message')}
          </button>
        </form>
      </div>
    </div>
  );
};

// Standard ChatBot component for regular browsers
const StandardChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
    
  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowGreeting(false);
  };
  
  return (
    <div className="chatbot-container">
      {/* Use a simple version for this fix */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment'}`}></i>
      </div>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>{t('chat_with_us', 'Chat with us')}</h3>
            <button className="close-button" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chatbot-messages">
            <div className="message bot">
              <div className="message-content">
                {t('welcome_message', 'Hello! How can I help you today?')}
              </div>
            </div>
            {/* Would normally render messages here */}
          </div>
          
          <div className="chatbot-input">
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder={t('type_message', 'Type a message...')} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}
      
      {showGreeting && !isOpen && (
        <div className="greeting-bubble">
          <p>{t('can_i_help', 'Can I help you?')}</p>
          <button onClick={toggleChat}>{t('chat_now', 'Chat Now')}</button>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 