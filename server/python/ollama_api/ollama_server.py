"""
Ollama API Server for the Russian Orthodox School Website

This FastAPI server provides an API for interacting with Ollama models.
It runs separately from the Node.js backend and handles all AI chat functionality.
"""

import os
import sys
import json
import asyncio
import datetime
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from dotenv import load_dotenv

try:
    import ollama
except ImportError:
    print("Error: Ollama package not found. Please install with 'pip install ollama'")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Get the default model from environment
DEFAULT_MODEL = os.getenv("OLLAMA_DEFAULT_MODEL", "llama3.2:1b")

# Initialize FastAPI app
app = FastAPI(
    title="Ollama API Server",
    description="API server for Ollama integration with the Russian Orthodox School website",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3009", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompt for consistent responses
SYSTEM_PROMPT = """
You are a helpful assistant for the St. Aiden & Chad Russian Orthodox School in Nottingham, UK. 
Founded in 2024, the school teaches Russian language, Russian literature, music (Solfège), and Закон Божий (Law of God).

The school's teachers include:
- Father Gregory (Headmaster)
- Alexander Ushakov (Закон Божий teacher, graduated from St. Tikhon University in Moscow in Theology)
- Alla Ushakova (Music teacher with 20+ years experience teaching Solfège to children aged 4-10)
- Tatyana Ball (Russian language and literature for older classes)
- Alina (Russian language and literature for younger classes)
- Lydia Mikhalovna (Russian language and literature for middle classes, 40+ years experience)

The school is associated with the Nottingham Russian Orthodox Church of St. Aiden & Chad.

Provide accurate, helpful information about the school, Orthodox education, school programs, 
and general inquiries. Keep responses respectful, educational, and appropriate for all ages.
Be concise yet thorough in your responses.
"""

@app.get("/status")
async def status() -> Dict[str, Any]:
    """Simple status endpoint for quick health checks"""
    try:
        models = ollama.list()
        model_names = [model["name"] for model in models["models"]]
        
        return {
            "status": "ok",
            "models": model_names,
            "current_model": DEFAULT_MODEL
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint to verify the API is running"""
    return {
        "status": "ok", 
        "timestamp": str(datetime.datetime.now()),
        "service": "ollama-api"
    }

@app.get("/api/models")
async def list_models() -> Dict[str, Any]:
    """List all available Ollama models"""
    try:
        models = ollama.list()
        return {"success": True, "models": models["models"], "default_model": DEFAULT_MODEL}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/chat")
async def chat(request: Request) -> Dict[str, Any]:
    """Process a chat request and return a complete response"""
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
        
    message = data.get("message", "")
    model = data.get("model", DEFAULT_MODEL)
    
    if not message:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "Message is required"}
        )
    
    try:
        print(f"Sending message to {model}: {message[:30]}...")
        response = ollama.chat(
            model=model, 
            messages=[
                {
                    "role": "system", 
                    "content": SYSTEM_PROMPT
                },
                {"role": "user", "content": message}
            ]
        )
        
        print(f"Response received, length: {len(response['message']['content'])}")
        return {"success": True, "response": response["message"]["content"]}
    except Exception as e:
        print(f"Error in /api/chat: {str(e)}")
        return {"success": False, "error": str(e)}

@app.post("/api/stream")
async def stream(request: Request) -> StreamingResponse:
    """Stream chat responses from Ollama"""
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
        
    message = data.get("message", "")
    model = data.get("model", DEFAULT_MODEL)
    
    if not message:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "Message is required"}
        )
    
    async def event_generator():
        """Generate SSE events from Ollama stream"""
        try:
            stream = ollama.chat(
                model=model,
                messages=[
                    {
                        "role": "system", 
                        "content": SYSTEM_PROMPT
                    },
                    {"role": "user", "content": message}
                ],
                stream=True
            )
            
            for chunk in stream:
                if "message" in chunk and chunk["message"]["content"]:
                    content = chunk["message"]["content"]
                    # Escape special characters for SSE
                    content = content.replace('"', '\\"').replace("\n", "\\n")
                    yield f'data: {{"content": "{content}", "done": false}}\n\n'
                await asyncio.sleep(0.01)
            
            yield f'data: {{"content": "", "done": true}}\n\n'
        
        except Exception as e:
            error_msg = str(e).replace('"', '\\"').replace("\n", "\\n")
            yield f'data: {{"error": "{error_msg}", "done": true}}\n\n'
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

# Main entry point
if __name__ == "__main__":
    import uvicorn
    
    # Default port
    port = 5001
    
    # Check if port is passed as an argument
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}. Using default port 5001.")
    
    print(f"✨ Starting Ollama API server on port {port}...")
    print(f"📚 API Documentation available at http://localhost:{port}/docs")
    
    # Attempt to list models to check Ollama connection
    try:
        models = ollama.list()
        model_names = [model["name"] for model in models["models"]]
        if model_names:
            print(f"🤖 Connected to Ollama! Available models: {', '.join(model_names)}")
        else:
            print("⚠️ Connected to Ollama but no models found.")
            print("   Run 'ollama pull llama2' to download a model.")
    except Exception as e:
        print(f"❌ Failed to connect to Ollama: {str(e)}")
        print("   Make sure Ollama is installed and running.")
    
    uvicorn.run(app, host="0.0.0.0", port=port) 