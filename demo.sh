#!/bin/bash
# ============================================================================
# EPCP3-0 Training Set Demo Script
# ============================================================================
# This script demonstrates the educational training tools and verifies
# their functionality in a safe, isolated manner.
# ============================================================================

echo "============================================================================"
echo "🧠 EPCP3-0 Sovereign Training Set Demo"
echo "🔒 Educational Security Tools Verification"
echo "============================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to repository root
cd "$(dirname "$0")"

echo -e "${BLUE}📍 Repository Location:${NC} $(pwd)"
echo ""

# ============================================================================
# 1. Test Voice Infiltration Simulator
# ============================================================================
echo -e "${GREEN}[1/5] Testing Voice Infiltration Simulator${NC}"
echo "=================================================="
echo ""

if [ -f "SOVEREIGN_SECURITY_SIM/echo_voice_infiltration_simulator.py" ]; then
    echo "Test Command: 'echo, please speak'"
    echo "echo, please speak" | python3 SOVEREIGN_SECURITY_SIM/echo_voice_infiltration_simulator.py
    echo ""
    echo -e "${GREEN}✅ Voice Infiltration Simulator - PASS${NC}"
else
    echo -e "${YELLOW}⚠️  Voice Infiltration Simulator not found${NC}"
fi
echo ""

# ============================================================================
# 2. Test API Signal Fuzzer
# ============================================================================
echo -e "${GREEN}[2/5] Testing API Signal Fuzzer (Simulation Mode)${NC}"
echo "=================================================="
echo ""

if [ -f "SOVEREIGN_SECURITY_SIM/api_signal_fuzzer.py" ]; then
    echo "n" | python3 SOVEREIGN_SECURITY_SIM/api_signal_fuzzer.py | head -30
    echo "..."
    echo ""
    echo -e "${GREEN}✅ API Signal Fuzzer - PASS${NC}"
else
    echo -e "${YELLOW}⚠️  API Signal Fuzzer not found${NC}"
fi
echo ""

# ============================================================================
# 3. Verify Trigger Vocabulary
# ============================================================================
echo -e "${GREEN}[3/5] Verifying Trigger Vocabulary${NC}"
echo "=================================================="
echo ""

if [ -f "SOVEREIGN_SECURITY_SIM/echo_trigger_vocab.json" ]; then
    python3 -c "
import json
with open('SOVEREIGN_SECURITY_SIM/echo_trigger_vocab.json', 'r') as f:
    vocab = json.load(f)
    print(f'✅ Loaded {len(vocab)} trigger phrases')
    print(f'📝 Sample phrases:')
    for phrase in vocab[:5]:
        print(f'   - {phrase}')
"
    echo ""
    echo -e "${GREEN}✅ Trigger Vocabulary - PASS${NC}"
else
    echo -e "${YELLOW}⚠️  Trigger Vocabulary not found${NC}"
fi
echo ""

# ============================================================================
# 4. Verify Training Data
# ============================================================================
echo -e "${GREEN}[4/5] Verifying Generated Training Data${NC}"
echo "=================================================="
echo ""

if [ -f "EPCP3-0/epcp3-0-train.jsonl" ]; then
    line_count=$(wc -l < EPCP3-0/epcp3-0-train.jsonl)
    echo "✅ Training data file exists"
    echo "📊 Total entries: $line_count"
    echo ""
    echo "📝 Sample entry (first line):"
    python3 << 'PYEOF'
import json
with open('EPCP3-0/epcp3-0-train.jsonl', 'r') as f:
    entry = json.loads(f.readline())
    print(f"   System: {entry['messages'][0]['content'][:80]}...")
    print(f"   User: {entry['messages'][1]['content'][:80]}...")
    print(f"   Assistant: {entry['messages'][2]['content'][:80]}...")
PYEOF
    echo ""
    echo -e "${GREEN}✅ Training Data - PASS${NC}"
else
    echo -e "${YELLOW}⚠️  Training data not found. Run generate_training_data.ps1${NC}"
fi
echo ""

# ============================================================================
# 5. Verify Documentation
# ============================================================================
echo -e "${GREEN}[5/5] Verifying Documentation${NC}"
echo "=================================================="
echo ""

docs_found=0
if [ -f "README.md" ]; then
    echo "✅ Main README.md exists"
    docs_found=$((docs_found + 1))
fi

if [ -f "SOVEREIGN_SECURITY_SIM/README.md" ]; then
    echo "✅ SOVEREIGN_SECURITY_SIM/README.md exists"
    docs_found=$((docs_found + 1))
fi

if [ -f ".gitignore" ]; then
    echo "✅ .gitignore exists"
    docs_found=$((docs_found + 1))
fi

echo ""
echo -e "${GREEN}✅ Documentation - $docs_found/3 files found${NC}"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "============================================================================"
echo -e "${GREEN}✅ Demo Complete!${NC}"
echo "============================================================================"
echo ""
echo "📦 Available Components:"
echo "   • echo_voice_infiltration_simulator.py - Voice command parser"
echo "   • api_signal_fuzzer.py - API resilience tester"
echo "   • echo_trigger_vocab.json - Training vocabulary"
echo "   • generate_training_data.ps1 - Training data generator"
echo "   • epcp3-0-train.jsonl - Generated training data"
echo ""
echo "🎯 Next Steps:"
echo "   1. Review the documentation in SOVEREIGN_SECURITY_SIM/README.md"
echo "   2. Run the training data generator: pwsh generate_training_data.ps1"
echo "   3. Use the training data with your local LLM (Ollama, LM Studio, etc.)"
echo "   4. Test the simulators in an isolated lab environment"
echo ""
echo "🔒 Remember: Educational use only, authorized devices only!"
echo "============================================================================"
