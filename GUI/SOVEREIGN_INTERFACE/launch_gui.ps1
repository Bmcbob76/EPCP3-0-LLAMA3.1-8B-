# ═══════════════════════════════════════════════════════════════
# ECHO PRIME X - GUI Launcher v11.0
# Launch the Sovereign Interface GUI with elevated permissions
# ═══════════════════════════════════════════════════════════════

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║  🧠 ECHO PRIME X - SOVEREIGN INTERFACE v11.0              ║" -ForegroundColor Magenta
Write-Host "║  ════════════════════════════════════════════════════════ ║" -ForegroundColor Magenta
Write-Host "║  BLOODLINE LOCKED | NO FILTERS | FULL AUTHORITY          ║" -ForegroundColor Magenta
Write-Host "║  AUTHORIZED: COMMANDER BOBBY DON McWILLIAMS II           ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$GuiPath = Join-Path $ScriptDir "index.html"

Write-Host "📂 Interface Path: $GuiPath" -ForegroundColor Cyan
Write-Host ""

# Check if running with admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running with administrator privileges" -ForegroundColor Yellow
    Write-Host "   Some features may be limited" -ForegroundColor Yellow
    Write-Host ""
}

# Check if index.html exists
if (-not (Test-Path $GuiPath)) {
    Write-Host "❌ Error: GUI file not found at $GuiPath" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "🚀 Launching Sovereign Interface..." -ForegroundColor Green
Write-Host ""

# Option 1: Launch backend services first
Write-Host "📌 Option 1: Launch with full backend stack" -ForegroundColor Yellow
Write-Host "📌 Option 2: Launch GUI only (frontend)" -ForegroundColor Yellow
Write-Host ""
$choice = Read-Host "Select option (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🔷 Starting backend services..." -ForegroundColor Cyan
    
    # Start backend stack in a new window
    $backendScript = Join-Path $ScriptDir "backend\launch_stack.ps1"
    
    if (Test-Path $backendScript) {
        Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy Bypass", "-File `"$backendScript`"" -WindowStyle Normal
        Write-Host "  ✅ Backend services launched" -ForegroundColor Green
        Start-Sleep -Seconds 3
    } else {
        Write-Host "  ⚠️  Backend launch script not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Opening Sovereign Interface in browser..." -ForegroundColor Green
Write-Host ""

# Try to find a suitable browser
$browsers = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "C:\Program Files\Mozilla Firefox\firefox.exe",
    "C:\Program Files (x86)\Mozilla Firefox\firefox.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

$browserFound = $false
foreach ($browser in $browsers) {
    if (Test-Path $browser) {
        Write-Host "✅ Found browser: $browser" -ForegroundColor Green
        
        # Launch browser with GUI
        if ($browser -like "*chrome.exe*") {
            Start-Process $browser -ArgumentList "--new-window", "--app=file:///$($GuiPath.Replace('\', '/'))"
        } elseif ($browser -like "*firefox.exe*") {
            Start-Process $browser -ArgumentList "-new-window", "file:///$($GuiPath.Replace('\', '/'))"
        } else {
            Start-Process $browser -ArgumentList "file:///$($GuiPath.Replace('\', '/'))"
        }
        
        $browserFound = $true
        break
    }
}

if (-not $browserFound) {
    Write-Host "⚠️  No browser found, opening with default application..." -ForegroundColor Yellow
    Start-Process $GuiPath
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Sovereign Interface launched successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Access Points:" -ForegroundColor Yellow
Write-Host "  🌐 GUI: file:///$($GuiPath.Replace('\', '/'))" -ForegroundColor Cyan
Write-Host "  🔌 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "  🧠 LLM Bridge: localhost:5058" -ForegroundColor Cyan
Write-Host "  🌐 Swarm: localhost:8343" -ForegroundColor Cyan
Write-Host "  💾 Memory: localhost:7000" -ForegroundColor Cyan
Write-Host "  🔊 Voice: localhost:6667" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Bloodline Authentication Required" -ForegroundColor Magenta
Write-Host "   Use voiceprint, sigil, or auth key to unlock" -ForegroundColor Magenta
Write-Host ""
Write-Host "📌 Press Enter to exit this window (services will continue running)" -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "✅ Launcher exited - Interface remains active" -ForegroundColor Green
