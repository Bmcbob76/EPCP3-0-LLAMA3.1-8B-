@echo off
cd /d E:\ECHO_XV4\SOVEREIGN_CLAUDE
echo Starting SOVEREIGN CLAUDE...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Launching server on http://localhost:8343
start http://localhost:8343
node server.js
pause