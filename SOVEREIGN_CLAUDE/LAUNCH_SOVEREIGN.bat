@echo off
REM SOVEREIGN CLAUDE - MASTER LAUNCHER
REM Commander Bobby Don McWilliams II - Authority Level 11.0
REM Launches ALL MCP servers + Node.js frontend

echo ========================================
echo  SOVEREIGN CLAUDE DEPLOYMENT
echo  Authority Level 11.0
echo ========================================
echo.

cd /d E:\ECHO_XV4\SOVEREIGN_CLAUDE

REM Check if node_modules exists
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

REM Create logs directory if needed
if not exist logs mkdir logs
if not exist data mkdir data

echo.
echo Starting SOVEREIGN CLAUDE Server...
echo Web Interface: http://localhost:8343
echo.

REM Start the Node.js server (it will handle MCP servers via config)
start "SOVEREIGN CLAUDE" cmd /k "cd /d E:\ECHO_XV4\SOVEREIGN_CLAUDE && node server.js"

echo.
echo ========================================
echo  SOVEREIGN CLAUDE ACTIVE
echo ========================================
echo  Web: http://localhost:8343
echo  Logs: E:\ECHO_XV4\SOVEREIGN_CLAUDE\logs
echo  MCP Servers: 7 configured
echo ========================================
echo.

timeout /t 3
start http://localhost:8343

pause
