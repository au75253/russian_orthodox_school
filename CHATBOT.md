# AI Chatbot with Ollama - Hybrid Implementation

This project uses a hybrid approach for the AI chatbot:
- Node.js backend for the main website and contact form
- Python backend for the Ollama-powered chatbot

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Ollama installed locally (https://ollama.ai)

## Setup Instructions

### 1. Install Ollama

1. Download and install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model to use with your chatbot:
   ```bash
   ollama pull llama2
   ```
   (You can also use other models like llama3, mistral, etc.)

### 2. Set up the Python Backend

1. Install Python dependencies:
   ```bash
   cd server/python/ollama_api
   pip install -r requirements.txt
   ```

2. Run the Python Ollama server:
   ```bash
   # Using the shell script:
   cd server/python
   ./start_ollama_server.sh
   
   # Or using npm:
   npm run ollama
   ```
   This will start the server on port 5001.

### 3. Start the Node.js Backend

1. Install dependencies if you haven't already:
   ```bash
   npm install
   ```

2. Run the Node.js development server:
   ```bash
   npm run dev
   ```
   This will start the React app on port 3009 and the Node.js server on port 5000.

### 4. Start Everything at Once

You can start both servers (Node.js and Python) together with:
```bash
# On macOS/Linux:
npm run dev:all

# On Windows:
npm run dev:all:win
```

## Project Structure

```
project/
├── src/
│   └── components/
│       ├── ChatBot.jsx       # ChatBot frontend component
│       └── ChatBot.css       # Styling for the ChatBot
├── server/
│   ├── server.js             # Main Node.js server
│   ├── routes/               # API routes for the Node.js server
│   └── python/               # Python server components
│       ├── README.md         # Documentation for Python integration
│       └── ollama_api/       # Ollama integration
│           ├── ollama_server.py  # FastAPI server for Ollama
│           └── requirements.txt  # Python dependencies
├── CHATBOT.md                # This documentation file
└── package.json              # Node.js dependencies
```

## Architecture

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

## Available Endpoints

### Python Backend (port 5001)

- `GET /api/health` - Health check
- `GET /api/models` - List available Ollama models
- `POST /api/chat` - Get a non-streaming response
- `POST /api/stream` - Get a streaming response

### Node.js Backend (port 5000)

- All other API endpoints, including contact form submission

## Troubleshooting

- **Chatbot shows "Offline"**: Make sure the Python server is running on port 5001 and Ollama is installed and running.
- **No models available**: Ensure you've pulled at least one model with `ollama pull llama2`.
- **Streaming not working**: Check the browser console for any CORS errors.
- **Python server won't start**: Verify you have all dependencies installed and are running from the correct directory.

## Production Deployment

For production deployment, you'll need to:

1. Set up a proxy to route `/api-py/*` requests to the Python backend
2. Ensure Ollama is installed on the production server
3. Set up proper process management (PM2, supervisord, etc.) to keep both servers running

A sample nginx configuration:

```nginx
server {
    # Other server config...

    # Proxy for Python Ollama API
    location /api-py/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy for Node.js API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location / {
        root /path/to/build;
        try_files $uri /index.html;
    }
}
```

## Python Server Features

The Python server (`ollama_server.py`) includes these features:

- FastAPI with automatic API documentation (available at http://localhost:5001/docs)
- Streaming response support with Server-Sent Events
- Consistent system prompt for AI responses
- Error handling and validation
- Support for multiple Ollama models 