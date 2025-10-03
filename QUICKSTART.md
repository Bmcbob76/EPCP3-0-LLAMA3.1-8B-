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
