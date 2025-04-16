const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to detect Telegram browser
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isTelegramBrowser = userAgent.includes('Telegram');
  
  // Set isTelegramBrowser flag for client-side detection
  res.locals.isTelegramBrowser = isTelegramBrowser;
  
  if (isTelegramBrowser) {
    console.log('Telegram browser detected, serving static build');
    // For Telegram browsers, always serve from the static build
    express.static(path.join(__dirname, 'build'))(req, res, next);
  } else {
    // For regular browsers, continue with normal routing
    next();
  }
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Regular browsers: development server`);
  console.log(`- Telegram browsers: static build from /build directory`);
}); 