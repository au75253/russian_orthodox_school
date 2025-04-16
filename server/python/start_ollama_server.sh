#!/bin/bash

# Start Ollama API server
# Usage: ./start_ollama_server.sh [port]
# Default port is 5001

# Go to the script directory
cd "$(dirname "$0")"

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed or not in PATH"
    echo "🔍 Please visit https://ollama.ai to install Ollama"
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/version &> /dev/null; then
    echo "⚠️ Ollama service does not appear to be running"
    echo "🔄 Please start Ollama first"
    exit 1
fi

# Check if port argument is provided
PORT=5001
if [ $# -eq 1 ]; then
    PORT=$1
fi

echo "🚀 Starting Ollama API server on port $PORT..."

# Activate virtual environment and run the server
source venv/bin/activate
python ollama_api/ollama_server.py $PORT 