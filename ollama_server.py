from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import ollama
import json
import asyncio
import datetime

app = FastAPI()

# Add CORS to allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3009", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": str(datetime.datetime.now())}

@app.get("/api/models")
async def list_models():
    try:
        models = ollama.list()
        return {"success": True, "models": models["models"]}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "")
    model = data.get("model", "llama2")
    
    try:
        response = ollama.chat(model=model, messages=[
            {
                "role": "system", 
                "content": "You are a helpful assistant for the Russian Orthodox School of St. Nicholas. Provide accurate, helpful information about Orthodox education, school programs, and general inquiries. Keep responses respectful, educational, and appropriate for all ages."
            },
            {"role": "user", "content": message}
        ])
        
        return {"success": True, "response": response["message"]["content"]}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/stream")
async def stream(request: Request):
    data = await request.json()
    message = data.get("message", "")
    model = data.get("model", "llama2")
    
    async def event_generator():
        try:
            stream = ollama.chat(
                model=model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a helpful assistant for the Russian Orthodox School of St. Nicholas. Provide accurate, helpful information about Orthodox education, school programs, and general inquiries. Keep responses respectful, educational, and appropriate for all ages."
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

if __name__ == "__main__":
    import uvicorn
    print("Starting Ollama API server on port 5001...")
    uvicorn.run(app, host="0.0.0.0", port=5001) 