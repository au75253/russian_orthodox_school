import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [connectionMode, setConnectionMode] = useState('checking'); // 'online', 'offline', 'checking'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Suggested prompts
  const suggestedPrompts = [
    "What are your school hours?",
    "How can I enroll my child?",
    "What grades do you offer?",
    "Tell me about your curriculum"
  ];

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Function to check connection status
  const checkConnectionStatus = async () => {
    setConnectionMode('checking');
    
    try {
      // Try server connection first
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/ollama/chat'  // In production, use relative path
        : 'http://localhost:5000/api/ollama/chat'; // In development
        
      const serverResponse = await fetch(apiUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      }).catch(() => null);
      
      if (serverResponse && serverResponse.ok) {
        console.log("Server available");
        setConnectionMode('online');
        return;
      }
      
      // If server fails, try direct Ollama connection
      try {
        // Direct API check to Ollama
        const ollamaResponse = await fetch('http://localhost:11434/api/version', {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        }).catch(() => null);
        
        if (ollamaResponse && ollamaResponse.ok) {
          console.log("Ollama API available");
          setConnectionMode('online');
          return;
        }
      } catch (ollamaError) {
        console.log("Direct Ollama connection failed:", ollamaError.message);
      }
      
      // If both fail, we're offline
      console.log("No connections available, switching to offline mode");
      setConnectionMode('offline');
      
    } catch (error) {
      console.error("Error checking connection status:", error);
      setConnectionMode('offline');
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Listen for custom event from fallback chatbot
  useEffect(() => {
    const handleCustomEvent = () => {
      console.log('Received openChatbot event');
      setIsOpen(true);
      setShowGreeting(false);
    };

    // Listen for custom event
    document.addEventListener('openChatbot', handleCustomEvent);

    // Check localStorage for a trigger from fallback chatbot
    const checkLocalStorage = () => {
      const shouldOpen = localStorage.getItem('openChatbot');
      const timestamp = localStorage.getItem('chatbotTimestamp');
      
      if (shouldOpen === 'true' && timestamp) {
        const now = Date.now();
        const storedTime = parseInt(timestamp, 10);
        
        // Only open if the localStorage item was set in the last 5 seconds
        if (now - storedTime < 5000) {
          console.log('Opening chatbot from localStorage trigger');
          setIsOpen(true);
          setShowGreeting(false);
          
          // Clear the localStorage items
          localStorage.removeItem('openChatbot');
          localStorage.removeItem('chatbotTimestamp');
        }
      }
    };

    // Run the check immediately and then every second
    checkLocalStorage();
    const interval = setInterval(checkLocalStorage, 1000);

    // Clean up event listener and interval
    return () => {
      document.removeEventListener('openChatbot', handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  // Show greeting bubble after a short delay when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 3000);
    
    // Hide greeting after some time
    const hideTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 10000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowGreeting(false); // Hide greeting when chat is opened
    
    // If opening chat, check connection again
    if (!isOpen) {
      checkConnectionStatus();
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle sending a message
  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage = { text: messageText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let serverSuccess = false;
      
      // First attempt: Try the backend proxy server
      try {
        console.log("Attempting to connect to backend server...");
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/ollama/chat'  // In production, use relative path
          : 'http://localhost:5000/api/ollama/chat'; // In development
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            model: 'llama2' // or use env variable if available
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setConnectionMode('online');
          console.log("Server response successful");
          
          // Add bot response to chat
          setMessages(prev => [
            ...prev, 
            { 
              text: data.response, 
              sender: 'bot', 
              timestamp: new Date() 
            }
          ]);
          serverSuccess = true;
        } else {
          console.log("Server returned error status:", response.status);
          throw new Error(`Server returned ${response.status}`);
        }
      } catch (serverError) {
        console.log("Server connection failed:", serverError.message);
        
        // Second attempt: Try direct Ollama connection via direct API
        if (!serverSuccess) {
          try {
            console.log("Attempting direct connection via Ollama API...");
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch('http://localhost:11434/api/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'llama2',
                messages: [
                  { role: 'user', content: messageText }
                ],
                stream: false
              }),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const result = await response.json();
              
              setConnectionMode('online');
              console.log("Direct Ollama connection successful");
              
              // Add bot response to chat
              setMessages(prev => [
                ...prev, 
                { 
                  text: result.message.content, 
                  sender: 'bot', 
                  timestamp: new Date() 
                }
              ]);
              serverSuccess = true;
            } else {
              console.log("Ollama returned error status:", response.status);
              throw new Error(`Ollama returned ${response.status}`);
            }
          } catch (ollamaError) {
            console.log("Direct Ollama connection failed:", ollamaError.message);
            setConnectionMode('offline');
            throw ollamaError; // Rethrow to be caught by the outer catch block
          }
        }
      }
      
    } catch (error) {
      console.error('All connection attempts failed:', error);
      
      // Fallback: Simple local response system
      const lowerCaseMessage = messageText.toLowerCase();
      let fallbackResponse = "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
      
      // Simple local response patterns
      if (lowerCaseMessage.includes("school hours") || lowerCaseMessage.includes("open")) {
        fallbackResponse = "Our school hours are Monday to Friday, 8:30 AM to 3:30 PM.";
      } else if (lowerCaseMessage.includes("enroll") || lowerCaseMessage.includes("register")) {
        fallbackResponse = "To enroll your child, please visit our Contact page and fill out the form or call our administrative office.";
      } else if (lowerCaseMessage.includes("grades") || lowerCaseMessage.includes("classes")) {
        fallbackResponse = "We offer classes from Kindergarten through 8th grade with Orthodox Christian education.";
      } else if (lowerCaseMessage.includes("curriculum") || lowerCaseMessage.includes("subjects")) {
        fallbackResponse = "Our curriculum includes standard academic subjects with an integration of Orthodox Christian values and teachings.";
      } else if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
        fallbackResponse = "Hello! I'm currently in offline mode, but I can answer basic questions about our school.";
      }
      
      // Add the fallback response
      setMessages(prev => [
        ...prev, 
        { 
          text: fallbackResponse, 
          sender: 'bot', 
          timestamp: new Date(),
          isFallback: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prompt click
  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  console.log("ChatBot rendering now, isOpen:", isOpen, "connectionMode:", connectionMode); // Debug log

  return (
    <div className="chatbot-container">
      {/* Initial greeting bubble */}
      {showGreeting && !isOpen && (
        <div className="chatbot-greeting" onClick={toggleChat}>
          <p>Need help? Ask me anything about our school!</p>
          <div className="chatbot-greeting-close" onClick={(e) => {
            e.stopPropagation();
            setShowGreeting(false);
          }}>
            <i className="fas fa-times"></i>
          </div>
        </div>
      )}
      
      {/* Chat icon button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`} 
        onClick={toggleChat}
        aria-label={isOpen ? "Minimize chat" : "Open chat"}
      >
        {isOpen ? (
          <i className="fas fa-minus"></i>
        ) : (
          <i className="fas fa-comment"></i>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <h3>{t('chat_with_us', 'Chat with us')}</h3>
              {connectionMode !== 'checking' && (
                <span className={`connection-status ${connectionMode}`}>
                  {connectionMode === 'online' ? (
                    <><i className="fas fa-circle"></i> Online</>
                  ) : (
                    <><i className="fas fa-circle"></i> Offline</>
                  )}
                </span>
              )}
            </div>
            <button 
              className="chatbot-close" 
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="chatbot-message bot">
                <div className="message-content">
                  <p>
                    {connectionMode === 'offline' 
                      ? "Hello! I'm currently in offline mode but can answer basic questions about our school."
                      : "Hello! How can I help you today?"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Message history */}
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`chatbot-message ${message.sender} ${message.isError ? 'error' : ''} ${message.isFallback ? 'fallback' : ''}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.isFallback && <span className="offline-indicator"> (offline)</span>}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="chatbot-message bot loading">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested prompts */}
          {messages.length < 2 && (
            <div className="chatbot-prompts">
              <p>{t('suggested_questions', 'You might want to ask:')}</p>
              <div className="prompt-buttons">
                {suggestedPrompts.map((prompt, index) => (
                  <button 
                    key={index} 
                    onClick={() => handlePromptClick(prompt)}
                    className="prompt-button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={connectionMode === 'offline' 
                ? t('type_message_offline', 'Type your message (offline mode)...') 
                : t('type_message', 'Type your message...')}
              disabled={isLoading}
              ref={inputRef}
            />
            <button 
              onClick={() => handleSendMessage()} 
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 