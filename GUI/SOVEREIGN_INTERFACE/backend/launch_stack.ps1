# ═══════════════════════════════════════════════════════════════
# ECHO PRIME X - Launch Stack v11.0
# PowerShell daemon launcher for all backend services
# ═══════════════════════════════════════════════════════════════

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  🧠 ECHO PRIME X - LAUNCH STACK v11.0                    ║" -ForegroundColor Magenta
Write-Host "║  ════════════════════════════════════════════════════════ ║" -ForegroundColor Magenta
Write-Host "║  Initializing all subsystems...                           ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "📂 Root Directory: $RootDir" -ForegroundColor Cyan
Write-Host ""

# Function to start a service
function Start-EchoService {
    param(
        [string]$ServiceName,
        [string]$Command,
        [string]$WorkingDir,
        [string]$Icon = "🔷"
    )
    
    Write-Host "$Icon Starting $ServiceName..." -ForegroundColor Green
    
    try {
        $process = Start-Process -FilePath "powershell.exe" `
                                -ArgumentList "-NoExit", "-Command", $Command `
                                -WorkingDirectory $WorkingDir `
                                -PassThru `
                                -WindowStyle Normal
        
        Write-Host "  ✅ $ServiceName started (PID: $($process.Id))" -ForegroundColor Green
        return $process
    }
    catch {
        Write-Host "  ❌ Failed to start $ServiceName" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        return $null
    }
}

# Check if Node.js is installed
Write-Host "🔍 Checking dependencies..." -ForegroundColor Yellow
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if ($nodeExists) {
    Write-Host "  ✅ Node.js found: $(node --version)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Node.js not found - Backend server will not start" -ForegroundColor Yellow
}

# Check if Python is installed
$pythonExists = Get-Command python -ErrorAction SilentlyContinue
if ($pythonExists) {
    Write-Host "  ✅ Python found: $(python --version)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Python not found - Python services will not start" -ForegroundColor Yellow
}

Write-Host ""

# Store process objects
$processes = @{}

# Start Node.js Backend Server
if ($nodeExists) {
    $backendDir = Join-Path $ScriptDir "backend"
    $processes['backend'] = Start-EchoService `
        -ServiceName "Backend Server (Node.js)" `
        -Command "cd '$backendDir'; Write-Host 'Starting Backend Server...'; node server.js" `
        -WorkingDir $backendDir `
        -Icon "🌐"
    Start-Sleep -Seconds 2
}

# Start LLM Bridge
if ($pythonExists) {
    $backendDir = Join-Path $ScriptDir "backend"
    $processes['llm_bridge'] = Start-EchoService `
        -ServiceName "LLM Bridge (Python)" `
        -Command "cd '$backendDir'; Write-Host 'Starting LLM Bridge...'; python llm_bridge.py" `
        -WorkingDir $backendDir `
        -Icon "🧠"
    Start-Sleep -Seconds 2
}

# Start Device Bridge
if ($pythonExists) {
    $backendDir = Join-Path $ScriptDir "backend"
    $processes['device_bridge'] = Start-EchoService `
        -ServiceName "Device Bridge (Python)" `
        -Command "cd '$backendDir'; Write-Host 'Starting Device Bridge...'; python device_bridge.py" `
        -WorkingDir $backendDir `
        -Icon "🛰"
    Start-Sleep -Seconds 2
}

# Start Memory Sync
if ($pythonExists) {
    $backendDir = Join-Path $ScriptDir "backend"
    $processes['memory_sync'] = Start-EchoService `
        -ServiceName "Memory Sync (Python)" `
        -Command "cd '$backendDir'; Write-Host 'Starting Memory Sync...'; python memory_sync.py" `
        -WorkingDir $backendDir `
        -Icon "💾"
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ All services launched successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Active Services:" -ForegroundColor Yellow
foreach ($key in $processes.Keys) {
    if ($processes[$key] -ne $null) {
        Write-Host "  ✅ $key (PID: $($processes[$key].Id))" -ForegroundColor Green
    }
}
Write-Host ""
Write-Host "📌 Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Wait for user to press Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if processes are still running
        foreach ($key in $processes.Keys) {
            if ($processes[$key] -ne $null) {
                if ($processes[$key].HasExited) {
                    Write-Host "⚠️  $key has stopped (PID: $($processes[$key].Id))" -ForegroundColor Yellow
                }
            }
        }
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Shutting down all services..." -ForegroundColor Red
    
    foreach ($key in $processes.Keys) {
        if ($processes[$key] -ne $null -and -not $processes[$key].HasExited) {
            Write-Host "  ⏹ Stopping $key (PID: $($processes[$key].Id))..." -ForegroundColor Yellow
            Stop-Process -Id $processes[$key].Id -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
