require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const contactRoutes = require('./routes/contactRoutes');
const ollamaRoutes = require('./routes/ollamaRoutes');
const { Ollama } = require('ollama');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://stnicholasorthodoxschool.org' // Production domain
    : 'http://localhost:3000', // Development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing
app.use(express.json({ limit: '100kb' })); // Limit payload size
app.use(express.urlencoded({ extended: false }));

// Check Ollama availability
const checkOllama = async () => {
  try {
    const OLLAMA_API = process.env.OLLAMA_API || 'http://127.0.0.1:11434';
    const ollama = new Ollama({ host: OLLAMA_API });
    
    const models = await ollama.list();
    if (models.models && models.models.length > 0) {
      console.log('Ollama connected successfully. Available models:', 
        models.models.map(m => m.name).join(', '));
    } else {
      console.log('Ollama connected but no models found. Please pull a model using "ollama pull llama2" or similar.');
    }
  } catch (err) {
    console.error('Ollama connection error:', err.message);
    console.warn('Chatbot functionality will be limited until Ollama is available');
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orthodox_school')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.warn('Continuing without MongoDB connection - some features may be limited');
  });

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/ollama', ollamaRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong on the server' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  checkOllama(); // Check Ollama on startup
});

module.exports = app; // For testing 