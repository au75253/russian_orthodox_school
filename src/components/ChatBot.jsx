import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const ChatBot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [connectionMode, setConnectionMode] = useState('checking'); // 'online', 'offline', 'checking'
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2:1b');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Suggested prompts
  const suggestedPrompts = [
    "What are your school hours?",
    "How can I enroll my child?",
    "What grades do you offer?",
    "Tell me about your curriculum"
  ];

  // Python API base URL (adjusted for the new server location)
  const PYTHON_API_BASE = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001' 
    : '/api-py';  // Use a proxy path in production
    
  // Check server connection and available models
  const checkConnectionStatus = useCallback(async () => {
    try {
      // Try different endpoints to accommodate both APIs
      const endpoint = `${PYTHON_API_BASE}/status`;
      
      console.log(`Checking connection status at: ${endpoint}`);
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Connection data:", data);
        
        if (data.status === "ok") {
          setConnectionMode('online');
          if (data.models && Array.isArray(data.models)) {
            // Format models for display
            const formattedModels = data.models.map(model => 
              typeof model === 'string' ? { name: model } : model
            );
            setAvailableModels(formattedModels);
            setSelectedModel(data.current_model || formattedModels[0]?.name || "llama2");
          }
        } else {
          setConnectionMode('offline');
        }
      } else {
        // Fall back to the original API check
        try {
          const apiHealthResponse = await fetch(`${PYTHON_API_BASE}/api/health`);
          if (apiHealthResponse.ok) {
            setConnectionMode('online');
            
            // If health check works, also try to get models
            try {
              const modelsResponse = await fetch(`${PYTHON_API_BASE}/api/models`);
              if (modelsResponse.ok) {
                const modelsData = await modelsResponse.json();
                if (modelsData.success && modelsData.models) {
                  setAvailableModels(modelsData.models);
                  setSelectedModel(modelsData.models[0]?.name || "llama2");
                }
              }
            } catch (e) {
              console.warn("Could not fetch models:", e);
            }
          } else {
            setConnectionMode('offline');
          }
        } catch (healthError) {
          console.error("API health check failed:", healthError);
          setConnectionMode('offline');
        }
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      setConnectionMode('offline');
    }
  }, [PYTHON_API_BASE]);

  // Check connection on mount
  useEffect(() => {
    checkConnectionStatus();
    const intervalId = setInterval(checkConnectionStatus, 30000);
    return () => clearInterval(intervalId);
  }, [checkConnectionStatus]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Scroll to bottom
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

  // Custom event listener for opening the chatbot
  useEffect(() => {
    const handleCustomEvent = () => {
      console.log('Received openChatbot event');
      setIsOpen(true);
      setShowGreeting(false);
    };

    document.addEventListener('openChatbot', handleCustomEvent);
    
    const checkLocalStorage = () => {
      const shouldOpen = localStorage.getItem('openChatbot');
      const timestamp = localStorage.getItem('chatbotTimestamp');
      
      if (shouldOpen === 'true' && timestamp) {
        const now = Date.now();
        const storedTime = parseInt(timestamp, 10);
        
        if (now - storedTime < 5000) {
          console.log('Opening chatbot from localStorage trigger');
          setIsOpen(true);
          setShowGreeting(false);
          
          localStorage.removeItem('openChatbot');
          localStorage.removeItem('chatbotTimestamp');
        }
      }
    };
    
    checkLocalStorage();
    const interval = setInterval(checkLocalStorage, 1000);
    
    return () => {
      document.removeEventListener('openChatbot', handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  // Show greeting bubble after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 3000);
    
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
    setShowGreeting(false);
    
    if (!isOpen) {
      checkConnectionStatus();
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Clean up active connections
  const closeActiveConnections = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    if (connectionMode === 'offline') {
      handleFallbackResponse(userMessage.text);
      return;
    }
    
    // Try streaming first
    try {
      await streamResponse(userMessage.text);
    } catch (error) {
      console.log("Streaming failed, falling back to regular API:", error);
      try {
        await fetchDirectResponse(userMessage.text);
      } catch (fallbackError) {
        console.error("All API methods failed:", fallbackError);
        setConnectionMode('offline');
        handleFallbackResponse(userMessage.text);
      }
    }
  };

  // Stream response using Server-Sent Events
  const streamResponse = async (messageText) => {
    if (!messageText.trim()) return;
    
    // Cancel any ongoing stream
    closeActiveConnections();
    
    setIsLoading(true);
    
    // Create a bot response placeholder
    const botResponseId = `bot-${Date.now()}`;
    
    setMessages(prev => [
      ...prev, 
      {
        id: botResponseId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true
      }
    ]);

    try {
      console.log("Using direct request for better mobile compatibility");
      
      // Use direct fetch for better compatibility 
      const response = await fetch(`${PYTHON_API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          model: selectedModel
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Get full response and simulate typing effect
        const fullResponse = data.response;
        
        // Adjust typing speed based on device type (slower on mobile)
        const isMobile = window.innerWidth <= 768;
        const avgTypingSpeed = isMobile ? 10 : 20; // chars per update
        const typingDelay = isMobile ? 150 : 100; // ms between updates
        
        let displayedResponse = '';
        const responseLength = fullResponse.length;
        
        // Only use typing effect for responses under a certain length (prevents long delays on mobile)
        const shouldSimulateTyping = responseLength < 1000 || !isMobile;
        
        if (shouldSimulateTyping) {
          const simulateTyping = () => {
            if (displayedResponse.length < responseLength) {
              const nextChunkEnd = Math.min(
                displayedResponse.length + avgTypingSpeed,
                responseLength
              );
              displayedResponse = fullResponse.substring(0, nextChunkEnd);
              
              setMessages(prev => prev.map(msg => 
                msg.id === botResponseId ? {
                  ...msg,
                  text: displayedResponse,
                  isStreaming: displayedResponse.length < responseLength
                } : msg
              ));
              
              // Continue typing
              setTimeout(simulateTyping, typingDelay);
            } else {
              // Done typing
              setMessages(prev => prev.map(msg => 
                msg.id === botResponseId ? {
                  ...msg,
                  isStreaming: false
                } : msg
              ));
              setIsLoading(false);
            }
          };
          
          // Start typing simulation
          simulateTyping();
        } else {
          // For very long responses on mobile, just show the full response immediately
          setMessages(prev => prev.map(msg => 
            msg.id === botResponseId ? {
              ...msg,
              text: fullResponse,
              isStreaming: false
            } : msg
          ));
          setIsLoading(false);
        }
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Response error:", error);
      
      // Show a different error for mobile devices
      const isMobile = window.innerWidth <= 768;
      const errorMessage = isMobile 
        ? "Sorry, there was a problem connecting to the AI service. Please try again." 
        : "Sorry, I encountered an error connecting to the AI service. Please try again later.";
      
      setMessages(prev => prev.map(msg => 
        msg.id === botResponseId ? {
          ...msg,
          text: errorMessage,
          isStreaming: false,
          isError: true
        } : msg
      ));
      
      setIsLoading(false);
    }
  };

  // Regular non-streaming API
  const fetchDirectResponse = async (messageText) => {
    const botMessageId = `bot-${Date.now()}`;
    setIsLoading(true);
    
    try {
      const response = await fetch(`${PYTHON_API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          model: selectedModel
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          id: botMessageId,
          text: data.response || "I received your message but have no response.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      setConnectionMode('online');
    } catch (error) {
      console.error("API error:", error);
      
      setMessages(prev => [
        ...prev,
        {
          id: botMessageId,
          text: "Sorry, I encountered an error. Please try again later.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }
      ]);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback response when offline
  const handleFallbackResponse = (messageText) => {
    const lowerCaseMessage = messageText.toLowerCase();
    let fallbackResponse = "Sorry, I'm having trouble connecting to the Ollama API. Please make sure the Python server is running.";
    
    // Simple patterns for offline mode
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
    } else if (lowerCaseMessage.includes("ollama") || lowerCaseMessage.includes("api") || lowerCaseMessage.includes("python")) {
      fallbackResponse = "The AI chatbot requires the Python server to be running. Make sure you've installed the dependencies with 'pip install -r requirements.txt' and started the server with 'python ollama_server.py'.";
    }
    
    // Add fallback response
    setMessages(prev => [
      ...prev, 
      { 
        id: `bot-${Date.now()}`,
        text: fallbackResponse, 
        sender: 'bot', 
        timestamp: new Date(),
        isFallback: true
      }
    ]);
  };

  // Handle clicking suggested prompt
  const handlePromptClick = (prompt) => {
    setInput(prompt);
    sendMessage({ preventDefault: () => {} });
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  };

  // Add event listener for viewport changes
  useEffect(() => {
    // Function to update window dimensions for mobile
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      
      // Adjust chatbot position/size for mobile
      const chatbotContainer = document.querySelector('.chatbot-container');
      const chatWindow = document.querySelector('.chatbot-window');
      
      if (chatbotContainer && isMobile) {
        chatbotContainer.style.bottom = '10px';
        chatbotContainer.style.right = '10px';
      } else if (chatbotContainer) {
        chatbotContainer.style.bottom = '30px';
        chatbotContainer.style.right = '30px';
      }
      
      if (chatWindow && isMobile) {
        chatWindow.style.width = `${Math.min(320, window.innerWidth - 20)}px`;
      }
    };

    // Initial call and listener
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fix for mobile browser issues with Event Source
  const isEventSourceSupported = () => {
    try {
      return 'EventSource' in window && 
        typeof window.EventSource === 'function' &&
        navigator.onLine;
    } catch (e) {
      console.error("Error checking EventSource support:", e);
      return false;
    }
  };

  // Safe wrapper for checking connection
  const safeCheckConnection = useCallback(async () => {
    try {
      await checkConnectionStatus();
    } catch (error) {
      console.error("Error during connection check:", error);
      setConnectionMode('offline');
    }
  }, [checkConnectionStatus]);
  
  // Use safe connection check
  useEffect(() => {
    safeCheckConnection();
    const intervalId = setInterval(safeCheckConnection, 30000);
    return () => clearInterval(intervalId);
  }, [safeCheckConnection]);

  // Add keyboard handling for mobile
  useEffect(() => {
    // Function to handle visibility changes for keyboard
    const handleKeyboardVisibility = () => {
      // Check if keyboard might be visible (based on viewport height change)
      const isMobile = window.innerWidth <= 768;
      const isLandscape = window.innerWidth > window.innerHeight;
      const isKeyboardOpen = isMobile && 
        ((window.innerHeight < window.outerHeight * 0.75) || 
         (isLandscape && window.innerHeight < 450));
      
      const chatWindow = document.querySelector('.chatbot-window');
      const chatButton = document.querySelector('.chatbot-toggle');
      
      if (chatWindow && isKeyboardOpen) {
        // If keyboard is likely visible, adjust the chatbot position
        chatWindow.style.bottom = '10px';
        chatWindow.style.height = '300px';
        
        if (chatButton) {
          chatButton.style.bottom = '5px';
          chatButton.style.right = '5px';
          chatButton.style.opacity = '0.7';
        }
      } else if (chatWindow) {
        // Reset to normal position
        chatWindow.style.bottom = isMobile ? '70px' : '80px';
        chatWindow.style.height = isMobile ? '450px' : '500px';
        
        if (chatButton) {
          chatButton.style.bottom = isMobile ? '10px' : '30px';
          chatButton.style.right = isMobile ? '10px' : '30px';
          chatButton.style.opacity = '1';
        }
      }
    };
    
    // Listen for resize events (keyboard opening/closing)
    window.addEventListener('resize', handleKeyboardVisibility);
    
    // Listen for input focus/blur
    const handleFocus = () => {
      // On mobile, adjust chatbot position up when input is focused
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setTimeout(() => {
          const chatWindow = document.querySelector('.chatbot-window');
          if (chatWindow) {
            chatWindow.style.bottom = '10px';
            chatWindow.style.height = '280px';
            
            // Scroll to keep input visible
            window.scrollTo(0, 0);
            inputRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    };
    
    const handleBlur = () => {
      // Reset position when input loses focus
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setTimeout(() => {
          const chatWindow = document.querySelector('.chatbot-window');
          if (chatWindow) {
            chatWindow.style.bottom = '70px';
            chatWindow.style.height = '450px';
          }
        }, 300);
      }
    };
    
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      inputRef.current.addEventListener('blur', handleBlur);
    }
    
    // Initial check
    handleKeyboardVisibility();
    
    return () => {
      window.removeEventListener('resize', handleKeyboardVisibility);
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
        inputRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, [isOpen]);

  // Hide chatbot on mobile devices
  const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Return null (don't render) on mobile devices
  if (isMobileDevice) {
    console.log("Chatbot disabled on mobile device");
    return null; 
  }

  return (
    <div className="chatbot-container"
         // Add safety for notched phones
         style={{
           paddingBottom: 'env(safe-area-inset-bottom, 0)',
           paddingRight: 'env(safe-area-inset-right, 0)'
         }}>
      {/* Greeting bubble */}
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
      
      {/* Chat toggle button */}
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
                      ? "Hello! I'm currently in offline mode. Make sure the Python server is running (python ollama_server.py)."
                      : "Hello! How can I help you today?"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Message history */}
            {messages.map((message, index) => (
              <div 
                key={message.id || index} 
                className={`chatbot-message ${message.sender} ${message.isError ? 'error' : ''} ${message.isFallback ? 'fallback' : ''} ${message.isStreaming ? 'streaming' : ''}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.isFallback && <span className="offline-indicator"> (offline)</span>}
                    {message.isStreaming && <span className="streaming-indicator"> (typing...)</span>}
                  </span>
                </div>
              </div>
            ))}
            
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
          
          {/* Model selector - now hidden */}
          {/* Removing the model selector as requested */}
          
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
              onClick={(e) => sendMessage(e)} 
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