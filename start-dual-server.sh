#!/bin/bash

# Build the static version first
echo "Building static version..."
npm run build

# Start the static server (for Telegram browsers)
echo "Starting static server on port 3000..."
npx concurrently "npm run serve-static" "PORT=3009 npm start" 