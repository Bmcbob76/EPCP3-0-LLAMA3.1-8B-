// ═══════════════════════════════════════════════════════════════
// ECHO PRIME X - SOVEREIGN INTERFACE v11.0
// Core GUI Logic - Tab Management, WebSocket Bridge, I/O
// ═══════════════════════════════════════════════════════════════

class SovereignInterface {
    constructor() {
        this.currentModule = 'echo_core';
        this.authenticated = false;
        this.websockets = {};
        this.statusUpdateInterval = null;
        this.startTime = Date.now();
        
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupSidebar();
        this.setupAuthentication();
        this.setupStatusBar();
        this.connectWebSockets();
        this.setupVoiceCommands();
        
        console.log('🧠 ECHO PRIME X - SOVEREIGN INTERFACE v11.0 INITIALIZED');
    }

    // ═══ TAB NAVIGATION ═══
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const moduleFrame = document.getElementById('moduleFrame');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const module = btn.getAttribute('data-module');
                this.switchModule(module);
                
                // Update active state
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Add new module button
        const addModuleBtn = document.querySelector('.add-module-btn');
        addModuleBtn.addEventListener('click', () => {
            this.promptAddModule();
        });
    }

    switchModule(moduleName) {
        const moduleFrame = document.getElementById('moduleFrame');
        moduleFrame.src = `tabs/${moduleName}.html`;
        this.currentModule = moduleName;
        console.log(`🔄 Switched to module: ${moduleName}`);
        
        // Announce via TTS if available
        this.speak(`Switching to ${moduleName.replace('_', ' ')} module`);
    }

    promptAddModule() {
        const moduleName = prompt('Enter new module name (e.g., custom_module):');
        if (moduleName) {
            alert(`📥 Module injection: ${moduleName}\nThis feature will be available in Phase II`);
        }
    }

    // ═══ SIDEBAR CONTROLS ═══
    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const controlButtons = document.querySelectorAll('.control-btn');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        controlButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleControlAction(action);
            });
        });
    }

    handleControlAction(action) {
        console.log(`⚙️ Control action: ${action}`);
        
        const actions = {
            restart: () => {
                if (confirm('🔁 Restart system? This will reload all modules.')) {
                    this.systemRestart();
                }
            },
            inject: () => {
                this.promptAddModule();
            },
            flush: () => {
                if (confirm('🧹 Flush memory? This will clear temporary data.')) {
                    this.memoryFlush();
                }
            },
            lockdown: () => {
                this.toggleLockdown();
            },
            godmode: () => {
                if (confirm('⚡ Activate GodMode? Requires bloodline verification.')) {
                    this.activateGodMode();
                }
            },
            backup: () => {
                this.createBackup();
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    systemRestart() {
        this.speak('System restart initiated');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    memoryFlush() {
        this.speak('Memory flush in progress');
        // Send flush command to backend
        this.sendCommand('memory', 'flush');
    }

    toggleLockdown() {
        const lockStatus = document.getElementById('lockStatus');
        const isLocked = lockStatus.textContent === 'Active';
        
        lockStatus.textContent = isLocked ? 'Disabled' : 'Active';
        lockStatus.style.color = isLocked ? '#ff0066' : '#00ff41';
        
        this.speak(isLocked ? 'Lockdown disabled' : 'Lockdown enabled');
    }

    activateGodMode() {
        this.speak('GodMode requires bloodline authentication');
        // Show auth overlay
        document.getElementById('authOverlay').classList.remove('hidden');
    }

    createBackup() {
        this.speak('Creating system backup');
        alert('💾 Backup created: echo_prime_' + new Date().toISOString().split('T')[0] + '.tar.gz');
    }

    // ═══ AUTHENTICATION ═══
    setupAuthentication() {
        const authOverlay = document.getElementById('authOverlay');
        const voiceprintBtn = document.getElementById('voiceprintAuth');
        const sigilBtn = document.getElementById('sigilAuth');
        const keyfileBtn = document.getElementById('keyfileAuth');
        const authStatus = document.getElementById('authStatus');

        // Simulate authentication check
        setTimeout(() => {
            if (!this.authenticated) {
                authOverlay.classList.remove('hidden');
            }
        }, 1000);

        voiceprintBtn.addEventListener('click', () => {
            authStatus.textContent = '🎤 Listening for voiceprint...';
            setTimeout(() => {
                this.authenticate('voiceprint');
            }, 2000);
        });

        sigilBtn.addEventListener('click', () => {
            authStatus.textContent = '🧿 Scanning for Echo Sigil...';
            setTimeout(() => {
                this.authenticate('sigil');
            }, 2000);
        });

        keyfileBtn.addEventListener('click', () => {
            authStatus.textContent = '🔑 Checking auth key file...';
            setTimeout(() => {
                this.authenticate('keyfile');
            }, 1500);
        });
    }

    authenticate(method) {
        const authStatus = document.getElementById('authStatus');
        const authOverlay = document.getElementById('authOverlay');
        
        // Simulate successful authentication
        authStatus.textContent = `✅ ${method.toUpperCase()} authentication successful!`;
        authStatus.style.color = '#00ff41';
        
        setTimeout(() => {
            authOverlay.classList.add('hidden');
            this.authenticated = true;
            this.speak('Welcome Commander. Echo Prime is online.');
        }, 1500);
    }

    // ═══ STATUS BAR ═══
    setupStatusBar() {
        this.updateSystemStatus();
        
        // Update status every 2 seconds
        this.statusUpdateInterval = setInterval(() => {
            this.updateSystemStatus();
        }, 2000);
    }

    updateSystemStatus() {
        // Update uptime
        const uptime = Date.now() - this.startTime;
        const hours = Math.floor(uptime / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);
        
        document.getElementById('uptime').textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Simulate status updates
        this.fetchStatus('voice', (status) => {
            document.getElementById('voiceStatus').textContent = status;
        });
        
        this.fetchStatus('swarm', (status) => {
            document.getElementById('swarmStatus').textContent = status;
        });
        
        this.fetchStatus('ip', (status) => {
            document.getElementById('ipAddress').textContent = status;
        });
    }

    fetchStatus(type, callback) {
        // In production, this would fetch from backend APIs
        const mockStatuses = {
            voice: ['Ready', 'Active', 'Processing'],
            swarm: ['98% Ready', '100% Active', '95% Ready'],
            ip: ['10.0.0.7', '192.168.1.100', '10.0.0.7']
        };
        
        const statuses = mockStatuses[type] || ['Unknown'];
        callback(statuses[Math.floor(Math.random() * statuses.length)]);
    }

    // ═══ WEBSOCKET CONNECTIONS ═══
    connectWebSockets() {
        const endpoints = {
            trainer: 'ws://localhost:5058',
            swarm: 'ws://localhost:8343',
            memory: 'ws://localhost:7000',
            voice: 'ws://localhost:6667'
        };

        Object.keys(endpoints).forEach(name => {
            this.connectWebSocket(name, endpoints[name]);
        });
    }

    connectWebSocket(name, url) {
        try {
            const ws = new WebSocket(url);
            
            ws.onopen = () => {
                console.log(`✅ WebSocket connected: ${name}`);
                this.websockets[name] = ws;
            };
            
            ws.onmessage = (event) => {
                this.handleWebSocketMessage(name, event.data);
            };
            
            ws.onerror = () => {
                console.log(`⚠️ WebSocket connection failed: ${name} (${url})`);
            };
            
            ws.onclose = () => {
                console.log(`🔌 WebSocket disconnected: ${name}`);
                delete this.websockets[name];
            };
        } catch (error) {
            console.log(`⚠️ WebSocket unavailable: ${name}`);
        }
    }

    handleWebSocketMessage(source, data) {
        console.log(`📨 Message from ${source}:`, data);
        
        try {
            const message = JSON.parse(data);
            // Handle different message types
            if (message.type === 'status') {
                this.updateModuleStatus(source, message.status);
            }
        } catch (e) {
            // Handle raw text messages
        }
    }

    sendCommand(target, command, data = {}) {
        if (this.websockets[target]) {
            const message = JSON.stringify({ command, data, timestamp: Date.now() });
            this.websockets[target].send(message);
            console.log(`📤 Sent command to ${target}:`, command);
        } else {
            console.log(`⚠️ WebSocket not connected: ${target}`);
            // Fallback to HTTP API
            this.sendHTTPCommand(target, command, data);
        }
    }

    sendHTTPCommand(target, command, data) {
        const ports = {
            trainer: 5058,
            swarm: 8343,
            memory: 7000,
            voice: 6667
        };
        
        const port = ports[target];
        if (!port) return;
        
        fetch(`http://localhost:${port}/api/${command}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => console.log(`✅ HTTP response from ${target}:`, data))
        .catch(error => console.log(`⚠️ HTTP request failed to ${target}:`, error));
    }

    updateModuleStatus(module, status) {
        // Update status bar based on module updates
        console.log(`📊 ${module} status:`, status);
    }

    // ═══ VOICE COMMANDS ═══
    setupVoiceCommands() {
        // Setup speech recognition if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript.toLowerCase();
                this.handleVoiceCommand(command);
            };

            // Auto-start recognition after auth
            setTimeout(() => {
                if (this.authenticated) {
                    try {
                        this.recognition.start();
                        console.log('🎤 Voice recognition active');
                    } catch (e) {
                        console.log('⚠️ Voice recognition not available');
                    }
                }
            }, 3000);
        }
    }

    handleVoiceCommand(command) {
        console.log('🎤 Voice command:', command);
        
        // Parse commands like "echo show swarm brain"
        if (command.includes('show')) {
            const modules = ['echo core', 'swarm', 'voice', 'memory', 'agent', 'device', 
                           'security', 'network', 'file', 'performance', 'investigator', 
                           'chat', 'labs', 'sigil'];
            
            modules.forEach(module => {
                if (command.includes(module)) {
                    const moduleName = module.replace(' ', '_') + (module === 'echo core' ? '' : 
                                      module === 'swarm' ? '_control' :
                                      module === 'voice' ? '_bridge' :
                                      module === 'memory' ? '_grid' :
                                      module === 'agent' ? '_launcher' :
                                      module === 'device' ? '_ops' :
                                      module === 'network' ? '_ops' :
                                      module === 'file' ? '_system' :
                                      module === 'chat' ? '_threads' :
                                      module === 'labs' ? '_labs' : 
                                      module === 'sigil' ? '_trigger' : '');
                    
                    this.switchModule(moduleName);
                }
            });
        }
    }

    speak(text) {
        // Use Web Speech API for TTS
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }
        
        console.log(`🔊 Echo speaks: ${text}`);
    }
}

// Initialize the interface when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sovereignInterface = new SovereignInterface();
});
