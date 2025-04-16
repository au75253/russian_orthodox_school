#!/bin/bash

# Check if Python Ollama server is running
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Python Ollama server is already running"
else
    echo "🚀 Starting Python Ollama server..."
    cd "$(dirname "$0")"
    
    # Check if Ollama service is running
    if ! curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
        echo "⚠️ Ollama service is not running. Please start Ollama first."
        exit 1
    fi
    
    # Activate virtual environment and run the server in the background
    source venv/bin/activate
    nohup python ollama_api/ollama_server.py > ollama_server.log 2>&1 &
    
    # Wait a few seconds to ensure server has started
    echo "⏳ Waiting for server to start..."
    sleep 3
    
    # Check if server started successfully
    if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
        echo "✅ Python Ollama server started successfully"
    else
        echo "❌ Failed to start Python Ollama server. Check ollama_server.log for details."
        exit 1
    fi
fi 