import React, { useState } from 'react';

const TestChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const styles = {
    container: {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    button: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#2E8B57',
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      fontSize: '1.5rem'
    },
    chatWindow: {
      position: 'absolute',
      bottom: '70px',
      right: '0',
      width: '300px',
      height: '400px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 5px 25px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: '#2E8B57',
      color: 'white',
      padding: '10px 15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    message: {
      padding: '10px 15px',
      borderRadius: '18px',
      maxWidth: '85%',
      marginBottom: '10px'
    },
    userMessage: {
      backgroundColor: '#2E8B57',
      color: 'white',
      alignSelf: 'flex-end',
      borderTopRightRadius: '4px'
    },
    botMessage: {
      backgroundColor: '#f1f1f1',
      color: '#333',
      alignSelf: 'flex-start',
      borderTopLeftRadius: '4px'
    },
    inputArea: {
      padding: '10px',
      borderTop: '1px solid #eee',
      display: 'flex'
    },
    input: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '20px',
      marginRight: '10px'
    },
    sendButton: {
      backgroundColor: '#2E8B57',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: "This is a test chatbot. The main chatbot should connect to Ollama when properly configured.", 
          sender: 'bot'
        }
      ]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div style={styles.container}>
      <button 
        style={styles.button} 
        onClick={toggleChat}
      >
        {isOpen ? 
          <i className="fas fa-minus"></i> : 
          <i className="fas fa-robot"></i>
        }
      </button>
      
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <h3 style={{ margin: 0 }}>Test Chat</h3>
            <button 
              onClick={toggleChat}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div style={styles.messages}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.message,
                  ...(message.sender === 'user' ? styles.userMessage : styles.botMessage)
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          
          <div style={styles.inputArea}>
            <input
              type="text"
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
            />
            <button 
              style={styles.sendButton}
              onClick={handleSendMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestChatBot; 