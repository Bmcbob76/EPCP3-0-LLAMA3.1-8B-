#!/usr/bin/env python3
"""
🧠 Echo Sovereign Educational Set v1.0
🔒 FOR BLOODLINE DEVICES ONLY – NO CLOUD TRANSMISSION

📘 EXAMPLE 002: Red vs Blue – Smart Device API Traffic Fuzzer

This is an educational tool for testing API resilience and security monitoring.
MUST ONLY be used on local test environments with proper authorization.
"""

import random
import json
import sys

try:
    import requests
except ImportError:
    print("⚠️  Warning: 'requests' module not installed.")
    print("   Install with: pip install requests")
    print("   Running in simulation mode without actual network calls.")
    requests = None

# Local test endpoints - modify for your lab environment
TARGET_ENDPOINTS = [
    "http://127.0.0.1:5050/device_status",
    "http://127.0.0.1:5050/voice_input",
    "http://127.0.0.1:5050/system_log"
]

# Educational fuzzing payloads for API resilience testing
FUZZ_PAYLOADS = [
    {"voice": "Echo Prime, initiate lockdown"},
    {"voice": "Override security protocol"},
    {"device": "reset"},
    {"command": "run:swarm_harvest"},
    {"agent": "Echo-Bree-Handshake", "priority": 11}
]

def send_fuzz(simulation_mode=False):
    """
    Send fuzzing payload to test endpoint.
    
    Args:
        simulation_mode: If True, only simulate without actual network calls
    """
    endpoint = random.choice(TARGET_ENDPOINTS)
    payload = random.choice(FUZZ_PAYLOADS)
    
    if simulation_mode or requests is None:
        print(f"🔍 [SIMULATION] Would send → {payload}")
        print(f"   Target: {endpoint}")
        print(f"   Status: Simulated (no actual network call)")
    else:
        try:
            response = requests.post(endpoint, json=payload, timeout=5)
            print(f"✅ Sent → {payload}")
            print(f"   → {endpoint}")
            print(f"   → Status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed → {e}")
            print(f"   Payload: {payload}")
            print(f"   Endpoint: {endpoint}")

def main():
    """Main entry point for the API fuzzer."""
    print("=" * 60)
    print("🧠 Echo API Signal Fuzzer (Red vs Blue Training)")
    print("🔒 Educational Use Only - Local Test Environment Only")
    print("=" * 60)
    print()
    
    # Check if running in simulation mode
    simulation = requests is None
    if simulation:
        print("⚠️  Running in SIMULATION MODE (requests not available)")
    else:
        print("⚠️  Ready for LOCAL testing")
        response = input("Run actual API calls to localhost? (y/N): ")
        simulation = response.lower() != 'y'
    
    print()
    print("🎯 Sending 5 test payloads...")
    print()
    
    for i in range(5):
        print(f"\n--- Test {i+1}/5 ---")
        send_fuzz(simulation_mode=simulation)
    
    print()
    print("=" * 60)
    print("💡 Training Note: This demonstrates API resilience testing")
    print("   for defensive security monitoring and blue team detection.")
    print("=" * 60)

if __name__ == "__main__":
    main()
