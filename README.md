# EPCP3-0-LLAMA3.1-8B-
EPCP3-0 ULTIMATE is a modular desktop AI copilot for developers and creators. Features chat, code editing (Monaco), infinite memory, C-3PO personality, local models (Ollama), and optional paid upgrades (Claude, GPT-4, Gemini) for advanced code analysis and up to 1M token context.

## 🧠 Sovereign-Aligned Educational Training Sets

This repository now includes advanced educational training materials for cybersecurity, IoT security, and defensive security practices.

### 📦 Components

#### 1. **SOVEREIGN_SECURITY_SIM/** - Educational Security Tools
A collection of educational tools for learning about IoT and voice assistant security:
- **echo_voice_infiltration_simulator.py** - Voice command parsing simulator
- **api_signal_fuzzer.py** - API resilience testing tool
- **echo_trigger_vocab.json** - Training vocabulary for command recognition
- **README.md** - Complete documentation and usage guidelines

#### 2. **generate_training_data.ps1** - Training Data Generator
PowerShell script that generates 200 defensive and educational training examples:
- Device inventory and authorized API control
- Lab setup and safe testing practices
- Blue-team detection and forensics
- High-level red-team theory (non-actionable)
- Incident response and mitigation playbooks
- Output: `EPCP3-0/epcp3-0-train.jsonl`

### 🎯 Educational Focus

These training sets emphasize:
- ✅ **Authorized testing** on owned devices
- ✅ **Defensive security** and blue-team practices
- ✅ **Isolated lab environments**
- ✅ **Responsible disclosure** and ethical frameworks
- ✅ **Non-actionable theory** for education
- ❌ **No operational exploits** or real-world attack recipes

### 🚀 Quick Start

**New to EPCP3-0 Training Sets?** → See [QUICKSTART.md](QUICKSTART.md) for a 3-step setup guide.

#### Generate Training Data
```powershell
# Windows PowerShell
.\generate_training_data.ps1
```

```bash
# Linux/Mac with PowerShell Core
pwsh ./generate_training_data.ps1
```

#### Run Educational Simulators
```bash
# Voice command simulator
python SOVEREIGN_SECURITY_SIM/echo_voice_infiltration_simulator.py

# API fuzzer (simulation mode)
python SOVEREIGN_SECURITY_SIM/api_signal_fuzzer.py
```

### 🔒 Security & Privacy

- **Local Execution**: All tools run locally, no cloud transmission
- **Offline Capable**: Works without internet connectivity
- **Sovereign Control**: Full local control and monitoring
- **Educational Only**: Designed for learning, not exploitation
- **Authorization Required**: Only use on systems you own

### 🛡️ Responsible Use

**IMPORTANT**: These tools are for educational purposes only. Users must:
- Only test authorized systems
- Comply with all applicable laws
- Follow ethical hacking principles
- Maintain proper documentation
- Use isolated lab environments

### 📚 Documentation

See individual component READMEs for detailed documentation:
- [SOVEREIGN_SECURITY_SIM/README.md](SOVEREIGN_SECURITY_SIM/README.md) - Security tools documentation
- [generate_training_data.ps1](generate_training_data.ps1) - Training data generator (includes inline documentation)

### 🔧 Integration with EPCP3-0

The generated training data (`EPCP3-0/epcp3-0-train.jsonl`) can be used to fine-tune local LLMs:
- **LM Studio** - Load and fine-tune with local models
- **Ollama** - Import custom training data
- **GPT4All** - Use with local model training
- **OpenRouter** - Deploy with filterless configurations

### 🎓 Training Philosophy

**Sovereign Security Education** focuses on:
1. Understanding security concepts deeply
2. Developing defensive capabilities
3. Practicing in safe, controlled environments
4. Building ethical frameworks
5. Emphasizing authorization and responsibility

---

**License**: Educational use only. Users are responsible for compliance with all applicable laws and regulations.
