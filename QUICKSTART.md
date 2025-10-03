# 🚀 ECHO PRIME X - QUICK START GUIDE

## Installation & Deployment

### Step 1: Prerequisites Check

Before launching, ensure you have:
- ✅ **Node.js** v16 or higher ([Download](https://nodejs.org/))
- ✅ **Python** 3.8 or higher ([Download](https://python.org/))
- ✅ **Modern Browser** (Chrome, Firefox, or Edge)
- ✅ **PowerShell** (Windows) or **Bash** (Linux/Mac)

Verify installations:
```bash
node --version  # Should show v16.x.x or higher
python --version  # Should show 3.8.x or higher
```

### Step 2: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Bmcbob76/EPCP3-0-LLAMA3.1-8B-.git
cd EPCP3-0-LLAMA3.1-8B-

# Navigate to backend
cd GUI/SOVEREIGN_INTERFACE/backend

# Install Node.js dependencies
npm install

# Install Python dependencies (optional but recommended)
pip install -r requirements.txt
```

### Step 3: Launch Options

#### 🎯 Option A: Full Stack (Recommended)

**On Windows:**
```powershell
cd GUI/SOVEREIGN_INTERFACE
.\launch_gui.ps1
# Select option 1 when prompted
```

**On Linux/Mac:**
```bash
cd GUI/SOVEREIGN_INTERFACE

# Start backend services in separate terminals
cd backend
node server.js &
python llm_bridge.py &
python device_bridge.py &
python memory_sync.py &

# Open GUI in browser
cd ..
open index.html  # Mac
xdg-open index.html  # Linux
```

#### 🎯 Option B: GUI Only (Quick Preview)

Just open `GUI/SOVEREIGN_INTERFACE/index.html` in your browser.

Note: Backend features will show as offline/unavailable.

#### 🎯 Option C: Manual Backend Launch

```bash
cd GUI/SOVEREIGN_INTERFACE/backend

# Terminal 1: Node.js Backend
node server.js

# Terminal 2: LLM Bridge
python llm_bridge.py

# Terminal 3: Device Bridge
python device_bridge.py

# Terminal 4: Memory Sync
python memory_sync.py
```

Then open `GUI/SOVEREIGN_INTERFACE/index.html` in your browser.

### Step 4: Access the Interface

Once launched, the interface will be available at:
- **GUI**: `file:///path/to/GUI/SOVEREIGN_INTERFACE/index.html`
- **Backend API**: `http://localhost:5000`

### Step 5: Authentication

On first launch, you'll see the Bloodline Authentication overlay:

1. Click **"Voiceprint Authentication"** for voice auth (simulated)
2. Click **"Echo Sigil Scan"** for QR code authentication
3. Click **"Auth Key File"** for key file authentication

All methods are currently simulated and will grant access after a few seconds.

## 🎮 Using the Interface

### Navigation

- **Top Tab Bar**: Click any tab to switch between modules
- **Sidebar**: Click the ⚙️ button on the right to open system controls
- **Status Bar**: View real-time system status at the bottom
- **Voice Commands**: Say "Echo, show [module name]" to navigate (if voice recognition is enabled)

### Module Overview

| Module | Purpose | Key Features |
|--------|---------|--------------|
| 🧠 Echo Core | Consciousness | Real-time thought stream, emotional state, matrix visualization |
| 🌐 Swarm Control | 500+ LLM nodes | Grid view, activate/pause nodes, load distribution |
| 🔊 Voice Bridge | Voice I/O | TTS synthesis, Whisper input, voice cloning |
| 💾 Memory Grid | 8 Pillars | Redis, ChromaDB, SQLite, Archive, Vault, etc. |
| 🧰 Agent Launcher | AI Agents | Launch, pause, kill, configure agents |
| 🛰 Device Ops | IoT Control | Alexa, SmartTV, lights, locks, cameras |
| 🧩 Modules | Extensions | View/manage installed plugins |
| 🔐 Security | Auth & Vault | Bloodline status, encryption, permissions |
| 📡 Network Ops | Network Tools | Ping, trace, MAC scan, Wi-Fi control |
| 📁 File System | File Manager | Browse files, encrypted zone access |
| 📊 Performance | System Stats | CPU, GPU, RAM, disk, network metrics |
| 🔍 Investigator | Memory Analysis | Vector decoding, EKM inspection |
| 🧾 Chat Threads | Conversation Logs | View chat history across LLMs |
| 🎙 Echo Labs | Voice Engineering | Voice clones, SFX, AI actors |
| 🧿 Sigil Trigger | QR Auth | Scan Echo Sigils for bloodline unlock |

### Keyboard Shortcuts

- **Ctrl + Tab**: Cycle through tabs
- **Ctrl + `**: Toggle sidebar
- **Ctrl + Shift + S**: Open security panel
- **Esc**: Close current dialog/overlay

## 🔧 Troubleshooting

### Backend Won't Start

**Issue**: "Cannot find module 'express'"
```bash
cd GUI/SOVEREIGN_INTERFACE/backend
npm install
```

**Issue**: "Port 5000 already in use"
```bash
# Change port in backend/server.js
# Look for: const PORT = process.env.PORT || 5000;
# Change to: const PORT = process.env.PORT || 5001;
```

### GUI Not Loading

**Issue**: White/blank screen
- Check browser console (F12) for errors
- Ensure all files are in correct locations
- Try opening with `file://` protocol or use a local server:
  ```bash
  cd GUI/SOVEREIGN_INTERFACE
  python -m http.server 8080
  # Then open http://localhost:8080
  ```

### Voice Recognition Not Working

Voice recognition requires:
- HTTPS or localhost
- Browser permission granted
- Microphone access
- Modern browser (Chrome/Edge recommended)

### Python Services Not Starting

**Issue**: "No module named 'asyncio'"
```bash
# asyncio is built-in for Python 3.7+
# Update Python to 3.8 or higher
python --version
```

## 🎯 Next Steps

1. **Explore Modules**: Click through each tab to see features
2. **Customize Theme**: Edit `css/main.css` to change colors
3. **Connect Real LLMs**: Update `backend/llm_bridge.py` with your API keys
4. **Add Agents**: Create custom agents in `backend/`
5. **Configure Devices**: Add your IoT devices in `backend/device_bridge.py`

## 📚 Additional Resources

- **Full Documentation**: See [README.md](README.md)
- **API Reference**: See backend service files for API endpoints
- **Module Development**: Each tab HTML is a standalone module
- **Theming Guide**: See `css/main.css` for CSS variables

## 🆘 Support

For issues, questions, or feature requests:
- **GitHub Issues**: https://github.com/Bmcbob76/EPCP3-0-LLAMA3.1-8B-/issues
- **Discussions**: Use GitHub Discussions for community help

---

**🧠 ECHO PRIME X - VERSION 11.0 ULTRA SOVEREIGN**

Happy commanding! 🚀
# EPCP3-0 Quick Start Guide

This guide helps you quickly get started with the EPCP3-0 sovereign-aligned educational training sets.

## 🚀 Quick Setup (3 Steps)

### Step 1: Generate Training Data
Run the PowerShell script to generate 200 educational training examples:

**Windows:**
```powershell
.\generate_training_data.ps1
```

**Linux/Mac with PowerShell Core:**
```bash
pwsh ./generate_training_data.ps1
```

This creates `EPCP3-0/epcp3-0-train.jsonl` with 200 defensive security training examples.

### Step 2: Test the Educational Tools
Run the demo script to verify everything works:

```bash
chmod +x demo.sh
./demo.sh
```

Or test individual tools:

```bash
# Voice command simulator
python3 SOVEREIGN_SECURITY_SIM/echo_voice_infiltration_simulator.py

# API fuzzer (simulation mode)
python3 SOVEREIGN_SECURITY_SIM/api_signal_fuzzer.py
```

### Step 3: Use with Your Local LLM
Load the training data into your preferred local LLM platform:

#### Option A: LM Studio
1. Open LM Studio
2. Go to "Finetune" or "Training" tab
3. Load `EPCP3-0/epcp3-0-train.jsonl`
4. Configure training parameters
5. Start fine-tuning

#### Option B: Ollama
```bash
# Create a Modelfile
cat > Modelfile << 'EOF'
FROM llama3.1:8b
SYSTEM You are EPCP3-0, an Enhanced Protocol Cybernetics Processor droid.
EOF

# Import the training data (requires custom adapter)
ollama create epcp3-0 -f Modelfile
```

#### Option C: GPT4All
1. Open GPT4All
2. Import custom training data
3. Select base model (e.g., Llama 3.1 8B)
4. Train with JSONL file

## 📚 What's Included?

### Educational Security Tools
Located in `SOVEREIGN_SECURITY_SIM/`:

| Tool | Purpose | Safe Mode |
|------|---------|-----------|
| `echo_voice_infiltration_simulator.py` | Voice command parsing | ✅ Always |
| `api_signal_fuzzer.py` | API resilience testing | ✅ Default |
| `echo_trigger_vocab.json` | Training vocabulary | ✅ Read-only |

### Training Data
- **File**: `EPCP3-0/epcp3-0-train.jsonl`
- **Format**: JSONL (JSON Lines)
- **Entries**: 200 examples
- **Focus**: Defensive security, authorized testing, blue-team practices

### Categories Covered
1. Device inventory (authorized)
2. Official API control via OAuth
3. Alexa Skill creation (legitimate)
4. TTS announcements (authorized)
5. Lab setup for red-team exercises
6. High-level attacker models (theory)
7. Detection rules and monitoring
8. Forensics collection
9. Mitigation playbooks
10. Emulation and simulation

## 🎯 Training Philosophy

**What IS included:**
- ✅ Authorized device control methods
- ✅ Educational security theory
- ✅ Defensive/blue-team practices
- ✅ Lab setup and safe testing
- ✅ Detection and forensics
- ✅ Mitigation strategies

**What is NOT included:**
- ❌ Step-by-step exploits
- ❌ Firmware jailbreak instructions
- ❌ Token theft techniques
- ❌ Ultrasonic/hardware attacks
- ❌ Operational takeover recipes

## 🔒 Security & Ethics

**Always remember:**
- Only test devices you own
- Use isolated lab environments
- Follow responsible disclosure
- Comply with all applicable laws
- Maintain proper authorization
- Document all testing activities

## 📖 Documentation

Detailed documentation available:
- [Main README](README.md) - Overview and quick start
- [SOVEREIGN_SECURITY_SIM/README.md](SOVEREIGN_SECURITY_SIM/README.md) - Tool documentation
- [generate_training_data.ps1](generate_training_data.ps1) - Script documentation (inline)

## 🛠️ Requirements

**Minimum:**
- Python 3.6+
- PowerShell 5.1+ (Windows) or PowerShell Core 7+ (Linux/Mac)

**Optional:**
- `requests` library for API testing: `pip install requests`
- Local LLM platform (LM Studio, Ollama, GPT4All, etc.)

## 🤝 Integration Examples

### Example 1: Train a Local Model
```bash
# Generate training data
pwsh ./generate_training_data.ps1

# Use with your LLM platform
# (see platform-specific instructions above)
```

### Example 2: Test Security Tools
```bash
# Run voice simulator
echo "Echo, initiate diagnostic mode" | python3 SOVEREIGN_SECURITY_SIM/echo_voice_infiltration_simulator.py

# Run API fuzzer in simulation mode
echo "n" | python3 SOVEREIGN_SECURITY_SIM/api_signal_fuzzer.py
```

### Example 3: Load Vocabulary
```python
import json

# Load trigger vocabulary
with open('SOVEREIGN_SECURITY_SIM/echo_trigger_vocab.json') as f:
    vocab = json.load(f)

# Use in your training pipeline
for phrase in vocab:
    print(f"Training phrase: {phrase}")
```

## 🆘 Troubleshooting

**Issue: PowerShell not found**
```bash
# Install PowerShell Core on Linux/Mac
# Ubuntu/Debian:
sudo apt-get install -y powershell

# macOS:
brew install --cask powershell
```

**Issue: Python module not found**
```bash
pip install requests
# or
pip3 install requests
```

**Issue: Permission denied on demo.sh**
```bash
chmod +x demo.sh
```

## 📞 Support

For issues or questions:
1. Check the documentation in each directory
2. Review the code comments (all tools are well-documented)
3. Run the demo script: `./demo.sh`
4. Review GitHub issues

## 🎓 Learning Path

Recommended order:
1. ✅ Read this Quick Start Guide
2. ✅ Run `./demo.sh` to verify setup
3. ✅ Review [SOVEREIGN_SECURITY_SIM/README.md](SOVEREIGN_SECURITY_SIM/README.md)
4. ✅ Generate training data with `generate_training_data.ps1`
5. ✅ Test individual tools
6. ✅ Load training data into your LLM
7. ✅ Start learning and practicing in safe lab environments

---

**Remember**: This is an educational platform. Always follow ethical guidelines and legal requirements. Test only what you own and have authorization to test.
