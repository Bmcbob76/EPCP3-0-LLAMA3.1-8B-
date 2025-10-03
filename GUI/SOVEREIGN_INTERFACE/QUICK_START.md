# Echo Prime Sovereign Interface - Quick Start Guide

## Installation

1. Clone or download the repository
2. Navigate to the `GUI/SOVEREIGN_INTERFACE` directory

## Launch Methods

### Method 1: PowerShell Launcher (Recommended for Windows)

```powershell
cd GUI/SOVEREIGN_INTERFACE
.\launch_gui.ps1
```

The script will automatically:
- Check if Python is installed
- Start an HTTP server on port 8080
- Open the interface in your default browser

### Method 2: Manual Python Server

```bash
cd GUI/SOVEREIGN_INTERFACE
python -m http.server 8080
```

Then open your browser and navigate to: `http://localhost:8080`

### Method 3: Direct File Opening

Simply open `index.html` in your browser. Note: Some features may be limited without a web server.

## Using the Interface

### Navigation

- **Tab Buttons**: Click on "Echo Core", "Swarm Control", or "Voice Bridge" to switch between tabs
- **Draggable Header**: Click and drag on the "⚡ ECHO PRIME" logo to simulate window movement

### Interactive Elements

1. **Biometric Lock (🔒/🔓)**
   - Located in the top-left area
   - Click to toggle between locked and unlocked states
   - Changes color to indicate status

2. **Voice Input Button (🎤)**
   - Located in the top-right corner
   - Click to activate voice input mode
   - Button pulses when active
   - Automatically deactivates after 3 seconds

### Status Monitoring

The bottom status bar displays real-time information:

- **SWARM**: Connection status to swarm network
- **VOICE**: Voice interface status
- **STATS**: CPU and Memory usage
- **I/O**: Data throughput in KB/s
- **Timestamp**: Current system time

Status indicators:
- 🟢 Green = Connected/Online
- 🔴 Red = Disconnected/Offline

### Tabs Overview

#### Echo Core
- System operations dashboard
- Six status cards showing different subsystems
- Live console output at the bottom
- Real-time system health monitoring

#### Swarm Control
- Manage distributed network nodes
- View active and offline nodes
- Network statistics (requests/min, latency)
- Visual node map
- Control buttons for node operations

#### Voice Bridge
- Voice command interface
- Voice visualizer with animated waveform
- Start/Stop recording controls
- Command history transcript
- Configuration settings display

## Troubleshooting

### Interface Not Loading
- Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari)
- Check that the HTTP server is running
- Try clearing your browser cache

### Status Not Updating
- Status updates every 2 seconds via simulated API calls
- Connection status randomly changes to simulate real conditions

### Tabs Not Switching
- Ensure JavaScript is enabled in your browser
- Check browser console for any errors (F12)

## Development

### File Structure
```
GUI/SOVEREIGN_INTERFACE/
├── index.html              # Main interface
├── launch_gui.ps1          # Launcher script
├── README.md               # Full documentation
├── QUICK_START.md          # This file
├── css/
│   └── sovereign-theme.css # Styling
├── js/
│   ├── api-stubs.js        # API simulation
│   └── sovereign-interface.js # UI logic
└── tabs/
    ├── echo_core.html
    ├── swarm_control.html
    └── voice_bridge.html
```

### Customization

- **Theme Colors**: Edit `css/sovereign-theme.css` CSS variables at the top
- **API Endpoints**: Modify `js/api-stubs.js` to connect to real backends
- **Tab Content**: Edit individual HTML files in `tabs/` directory
- **UI Behavior**: Modify `js/sovereign-interface.js`

## Browser Compatibility

- ✅ Chrome/Chromium (90+)
- ✅ Firefox (88+)
- ✅ Edge (90+)
- ✅ Safari (14+)

## Support

For issues or questions, please refer to the main README.md file or check the repository issues.

---

**Echo Prime Sovereign Interface** - Built with modern web technologies for the future of AI operations.
