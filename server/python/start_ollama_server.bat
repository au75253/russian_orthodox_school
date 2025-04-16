@echo off
REM Start Ollama API server
REM Usage: start_ollama_server.bat [port]
REM Default port is 5001

setlocal

REM Set default port
set PORT=5001

REM Check if port argument is provided
if not "%~1"=="" set PORT=%~1

echo Starting Ollama API server on port %PORT%...

REM Activate virtual environment and run the server
call venv\Scripts\activate.bat
python ollama_api\ollama_server.py %PORT%

endlocal 