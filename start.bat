@echo off
echo ==========================================
echo   MineCraft Bot Assistant - Docker Build
echo ==========================================

REM Check if docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not installed
    pause
    exit /b 1
)

REM Create .env file if not exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

echo.
echo Building and starting containers...
echo.

docker compose up -d --build

echo.
echo ==========================================
echo   MineCraft Bot Assistant is running!
echo ==========================================
echo.
echo   Web UI: http://localhost:3000
echo.
echo   To view logs: docker logs -f minebot-assistant
echo   To stop: docker compose down
echo.
pause
