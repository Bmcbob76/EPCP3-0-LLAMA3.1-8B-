// Echo Prime Sovereign Interface - Main JavaScript

class SovereignInterface {
    constructor() {
        this.currentTab = 'echo_core';
        this.biometricLocked = true;
        this.voiceActive = false;
        this.init();
    }

    init() {
        this.setupTabSwitching();
        this.setupBiometricToggle();
        this.setupVoiceInput();
        this.setupDraggableBar();
        this.startStatusUpdates();
        this.startTimestamp();
    }

    // Tab Switching
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const dynamicFrame = document.getElementById('dynamicFrame');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                
                // Update active state
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load tab content
                dynamicFrame.src = `tabs/${tabName}.html`;
                this.currentTab = tabName;
                
                console.log(`[ECHO] Switched to tab: ${tabName}`);
            });
        });
    }

    // Biometric Lock Toggle
    setupBiometricToggle() {
        const biometricBtn = document.getElementById('biometricToggle');
        
        biometricBtn.addEventListener('click', () => {
            this.biometricLocked = !this.biometricLocked;
            
            if (this.biometricLocked) {
                biometricBtn.textContent = '🔒';
                biometricBtn.classList.remove('unlocked');
                console.log('[ECHO] Biometric lock ENGAGED');
            } else {
                biometricBtn.textContent = '🔓';
                biometricBtn.classList.add('unlocked');
                console.log('[ECHO] Biometric lock DISENGAGED');
            }
        });
    }

    // Voice Input Toggle
    setupVoiceInput() {
        const voiceBtn = document.getElementById('voiceInputBtn');
        
        voiceBtn.addEventListener('click', () => {
            this.voiceActive = !this.voiceActive;
            
            if (this.voiceActive) {
                voiceBtn.classList.add('active');
                console.log('[ECHO] Voice input ACTIVATED');
                this.simulateVoiceInput();
            } else {
                voiceBtn.classList.remove('active');
                console.log('[ECHO] Voice input DEACTIVATED');
            }
        });
    }

    simulateVoiceInput() {
        // Simulate voice input for 3 seconds
        setTimeout(() => {
            if (this.voiceActive) {
                console.log('[ECHO] Voice command received: "Echo Prime, status report"');
                this.voiceActive = false;
                document.getElementById('voiceInputBtn').classList.remove('active');
            }
        }, 3000);
    }

    // Draggable Top Bar
    setupDraggableBar() {
        const topBar = document.getElementById('topBar');
        const dragHandle = topBar.querySelector('.drag-handle');
        
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            if (e.target === dragHandle || e.target.classList.contains('logo')) {
                isDragging = true;
                initialX = e.clientX;
                initialY = e.clientY;
                
                dragHandle.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                // Visual feedback only (in Electron, this would move window)
                console.log(`[ECHO] Window drag: X=${currentX}, Y=${currentY}`);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = 'move';
                console.log('[ECHO] Window drag ended');
            }
        });
    }

    // Status Updates
    startStatusUpdates() {
        // Update status every 2 seconds
        setInterval(() => {
            this.updateConnectionStatus();
            this.updateIOStatus();
        }, 2000);
        
        // Initial update
        this.updateConnectionStatus();
    }

    updateConnectionStatus() {
        // Simulate checking connection status from API stubs
        if (window.APIStubs) {
            const swarmStatus = window.APIStubs.getSwarmStatus();
            const voiceStatus = window.APIStubs.getVoiceStatus();
            const stats = window.APIStubs.getStats();
            
            // Update UI
            this.updateStatus('swarm', swarmStatus);
            this.updateStatus('voice', voiceStatus);
            
            const statsValue = document.getElementById('statsStatus');
            statsValue.textContent = `CPU: ${stats.cpu}% | MEM: ${stats.memory}%`;
        }
    }

    updateStatus(service, status) {
        const statusValue = document.getElementById(`${service}Status`);
        const indicator = statusValue.parentElement.querySelector('.status-indicator');
        
        statusValue.textContent = status.state.toUpperCase();
        indicator.setAttribute('data-status', status.connected ? 'connected' : 'disconnected');
    }

    updateIOStatus() {
        const ioStatus = document.getElementById('ioStatus');
        const randomIO = Math.floor(Math.random() * 100);
        ioStatus.textContent = `${randomIO} KB/s`;
    }

    // Timestamp
    startTimestamp() {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            const timestamp = document.getElementById('timestamp');
            timestamp.textContent = `${hours}:${minutes}:${seconds}`;
        };
        
        setInterval(updateTime, 1000);
        updateTime();
    }
}

// Initialize interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ECHO] Sovereign Interface initializing...');
    window.sovereignInterface = new SovereignInterface();
    console.log('[ECHO] Sovereign Interface ready');
});
