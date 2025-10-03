# Echo Prime Sovereign Interface - Launch Script
# Launches the GUI in the default web browser

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ECHO PRIME SOVEREIGN INTERFACE LAUNCHER     " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Set the path to the GUI directory
$GuiPath = Join-Path $PSScriptRoot ""
$IndexFile = Join-Path $GuiPath "index.html"

# Check if the index file exists
if (Test-Path $IndexFile) {
    Write-Host "[OK] Found interface at: $IndexFile" -ForegroundColor Green
    Write-Host ""
    
    # Option 1: Launch with a simple HTTP server (Python)
    Write-Host "Checking for Python..." -ForegroundColor Yellow
    $pythonExists = Get-Command python -ErrorAction SilentlyContinue
    
    if ($pythonExists) {
        Write-Host "[OK] Python found - Starting HTTP server" -ForegroundColor Green
        Write-Host ""
        Write-Host "Server will run on: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        
        # Start Python HTTP server in the GUI directory
        Set-Location $GuiPath
        Start-Process "http://localhost:8080"
        python -m http.server 8080
    }
    else {
        # Fallback: Launch file directly in browser
        Write-Host "[WARN] Python not found - Opening file directly in browser" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Note: Some features may not work without a web server." -ForegroundColor Yellow
        Write-Host "Consider installing Python for full functionality." -ForegroundColor Yellow
        Write-Host ""
        
        # Launch in default browser
        Start-Process $IndexFile
        Write-Host "[OK] Interface launched in default browser" -ForegroundColor Green
    }
}
else {
    Write-Host "[ERROR] Interface not found at: $IndexFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure the GUI files are properly installed." -ForegroundColor Yellow
    Write-Host "Expected location: GUI\SOVEREIGN_INTERFACE\" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ECHO PRIME INTERFACE READY                  " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
