#!/bin/bash

# Check if Python Ollama server is running
# import the PORT_OLLAMA from the .env file which is located in server directory
source ../.env || {
    echo "❌ Failed to source .env file. Please check if it exists and is readable."
    exit 1
}


echo "🔍 Checking for running Ollama Python server on port ${PORT_OLLAMA}..."

# Check if any process is already listening on the port
if lsof -i :${PORT_OLLAMA} > /dev/null 2>&1; then
    echo "✅ Python Ollama server is already running on port ${PORT_OLLAMA}"
    echo "🌐 Server should be accessible at:"
    echo "   - http://localhost:${PORT_OLLAMA}"
    echo "   - http://$(hostname -I | awk '{print $1}'):${PORT_OLLAMA} (local network)"
else
    echo "🚀 Starting Python Ollama server on all interfaces (0.0.0.0)..."
    cd "$(dirname "$0")"
    
    # Check if Ollama service is running
    if ! curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
        echo "⚠️ Ollama service is not running. Please start Ollama first."
        exit 1
    fi
    
    # Activate virtual environment and run the server in the background
    source venv/bin/activate
    
    # Log the server settings for debugging
    echo "🔧 Server settings:"
    echo "   - HOST: ${HOST}"
    echo "   - PORT: ${PORT_OLLAMA}"
    echo "   - ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}"
    
    nohup python ollama_api/ollama_server.py > ollama_server.log 2>&1 &
    
    # Wait a few seconds to ensure server has started
    echo "⏳ Waiting for server to start..."
    sleep 3
    
    # Check if server started successfully using any interface
    if nc -z 0.0.0.0 ${PORT_OLLAMA} > /dev/null 2>&1 || lsof -i :${PORT_OLLAMA} > /dev/null 2>&1; then
        echo "✅ Python Ollama server started successfully"
        echo "🌐 Server is accessible at:"
        echo "   - http://localhost:${PORT_OLLAMA}"
        echo "   - http://$(hostname -I | awk '{print $1}'):${PORT_OLLAMA} (local network)"
    else
        echo "❌ Failed to start Python Ollama server. Check ollama_server.log for details."
        exit 1
    fi
fi 