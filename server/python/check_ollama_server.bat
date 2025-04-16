@echo off
setlocal

:: Check if Python Ollama server is running
curl -s http://localhost:5001/api/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Python Ollama server is already running
    exit /b 0
)

echo Starting Python Ollama server...
cd /d "%~dp0"

:: Check if Ollama service is running
curl -s http://localhost:11434/api/version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Ollama service is not running. Please start Ollama first.
    exit /b 1
)

:: Activate virtual environment and run the server in the background
call venv\Scripts\activate.bat
start /b python ollama_api\ollama_server.py > ollama_server.log 2>&1

:: Wait a few seconds to ensure server has started
echo Waiting for server to start...
timeout /t 3 > nul

:: Check if server started successfully
curl -s http://localhost:5001/api/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Python Ollama server started successfully
) else (
    echo Failed to start Python Ollama server. Check ollama_server.log for details.
    exit /b 1
)

exit /b 0 