@echo off
title CodeGuard AI Orchestrator
color 0A
echo ========================================
echo   CodeGuard AI - Auto-Start Script
echo   Team AVON - Security Analysis Platform
echo ========================================
echo.

echo [SYSTEM] Starting CodeGuard AI Engine...
echo [INFO] Backend will run on http://localhost:3001
start cmd /k "cd engine && node server.js"

echo [SYSTEM] Waiting for Backend to stabilize...
timeout /t 5 /nobreak >nul

echo [SYSTEM] Starting Next.js Dashboard...
echo [INFO] Frontend will run on http://localhost:3000
cd dashboard
start cmd /k "npm run dev"

echo.
echo ========================================
echo [SUCCESS] Both services are launching!
echo ========================================
echo.
echo   Engine:    http://localhost:3001
echo   Dashboard: http://localhost:3000
echo.
echo   Press any key to close this window...
echo   (Services will continue running)
echo ========================================
pause >nul

@REM Made with Bob
