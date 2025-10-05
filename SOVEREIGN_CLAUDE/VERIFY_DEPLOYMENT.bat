@echo off
REM SOVEREIGN CLAUDE - DEPLOYMENT VERIFICATION
REM Checks all MCP servers and dependencies

echo ========================================
echo  SOVEREIGN CLAUDE - DEPLOYMENT CHECK
echo ========================================
echo.

REM Check Python
echo [1/7] Checking Python...
if exist "H:\Tools\python.exe" (
    echo ✅ Python found: H:\Tools\python.exe
) else (
    echo ❌ ERROR: Python not found at H:\Tools\python.exe
    pause
    exit /b 1
)

REM Check MCP Servers
echo.
echo [2/7] Checking Desktop Commander...
if exist "E:\ECHO_XV4\MLS\servers\desktop_commander_server.py" (
    echo ✅ Desktop Commander found
) else (
    echo ❌ ERROR: Desktop Commander not found
)

echo.
echo [3/7] Checking Windows API...
if exist "E:\ECHO_XV4\MLS\servers\windows_api_mcp_bridge.py" (
    echo ✅ Windows API found
) else (
    echo ❌ ERROR: Windows API not found
)

echo.
echo [4/7] Checking VS Code API...
if exist "E:\ECHO_XV4\MLS\servers\vscode_api_mcp_bridge.py" (
    echo ✅ VS Code API found
) else (
    echo ❌ ERROR: VS Code API not found
)

echo.
echo [5/7] Checking Ultra Speed...
if exist "E:\ECHO_XV4\MLS\servers\ultra_speed_mcp_server.py" (
    echo ✅ Ultra Speed found
) else (
    echo ❌ ERROR: Ultra Speed not found
)

echo.
echo [6/7] Checking Crystal Memory...
if exist "E:\ECHO_XV4\MLS\servers\crystal_memory_server_enhanced.py" (
    echo ✅ Crystal Memory found
) else (
    echo ❌ ERROR: Crystal Memory not found
)

echo.
echo [7/7] Checking Configuration...
if exist "E:\ECHO_XV4\SOVEREIGN_CLAUDE\config.json" (
    echo ✅ Config found
) else (
    echo ❌ ERROR: config.json not found
)

if exist "E:\ECHO_XV4\SOVEREIGN_CLAUDE\mcp_config.json" (
    echo ✅ MCP Config found
) else (
    echo ❌ ERROR: mcp_config.json not found
)

echo.
echo ========================================
echo  DEPLOYMENT STATUS
echo ========================================
echo  ✅ All checks complete
echo  Ready to launch SOVEREIGN CLAUDE
echo ========================================
echo.

pause
