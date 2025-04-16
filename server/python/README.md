# Python Server Integration

This directory contains Python-based server components for the Russian Orthodox School website.

## Ollama API Server

The `ollama_api` directory contains a FastAPI server that provides API endpoints for interacting with Ollama models. This server is used by the ChatBot component to provide AI chat functionality.

### Setup

1. Install dependencies:
   ```bash
   cd server/python/ollama_api
   pip install -r requirements.txt
   ```

2. Make sure Ollama is installed and running:
   ```bash
   # Install Ollama from https://ollama.ai
   # Pull a model
   ollama pull llama2
   ```

3. Start the server:
   ```bash
   cd server/python
   python ollama_api/ollama_server.py
   ```

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/models` - List available models
- `POST /api/chat` - Get a complete response
- `POST /api/stream` - Stream a response in real-time

## Directory Structure

```
server/
├── python/
│   ├── README.md           # This file
│   └── ollama_api/         # Ollama API server
│       ├── ollama_server.py  # Main server file
│       └── requirements.txt  # Python dependencies
```

## Architecture

The Python server runs independently from the Node.js server, providing AI functionality through Ollama:

```
┌───────────────┐     ┌──────────────────┐
│  React        │     │ Node.js Backend  │     ┌──────────┐
│  Frontend     │────►│ - Contact API    │────►│ MongoDB  │
│               │     │ - Authentication │     └──────────┘
└───────┬───────┘     └──────────────────┘
        │
        │             ┌──────────────────┐
        └────────────►│ Python Backend   │     ┌──────────┐
                      │ - Ollama API     │────►│  Ollama  │
                      │                  │     └──────────┘
                      └──────────────────┘
``` 