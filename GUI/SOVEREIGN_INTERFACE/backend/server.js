// ═══════════════════════════════════════════════════════════════
// ECHO PRIME X - Backend Server v11.0
// Node.js routing for local APIs and WebSocket management
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time communication
const wss = new WebSocket.Server({ server });

// Store active connections
const connections = new Map();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
    const clientId = req.url.split('?id=')[1] || `client_${Date.now()}`;
    connections.set(clientId, ws);
    
    console.log(`✅ WebSocket client connected: ${clientId}`);
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`📨 Message from ${clientId}:`, data);
            
            // Handle different command types
            handleCommand(clientId, data, ws);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        connections.delete(clientId);
        console.log(`🔌 WebSocket client disconnected: ${clientId}`);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        status: 'connected',
        message: 'Echo Prime X Backend - Connected'
    }));
});

// Command handler
function handleCommand(clientId, data, ws) {
    const { command, target, params } = data;
    
    switch (command) {
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
            break;
            
        case 'status':
            ws.send(JSON.stringify({
                type: 'status',
                data: getSystemStatus()
            }));
            break;
            
        case 'agent_launch':
            launchAgent(params, ws);
            break;
            
        case 'memory_query':
            queryMemory(params, ws);
            break;
            
        case 'voice_synthesize':
            synthesizeVoice(params, ws);
            break;
            
        default:
            ws.send(JSON.stringify({
                type: 'error',
                message: `Unknown command: ${command}`
            }));
    }
}

// REST API Endpoints

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        version: '11.0',
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// System status
app.get('/api/status', (req, res) => {
    res.json(getSystemStatus());
});

// Memory operations
app.post('/api/memory/query', (req, res) => {
    const { query } = req.body;
    // Simulate memory query
    res.json({
        success: true,
        results: [
            { id: 1, content: 'Memory result 1', relevance: 0.95 },
            { id: 2, content: 'Memory result 2', relevance: 0.87 }
        ]
    });
});

app.post('/api/memory/flush', (req, res) => {
    console.log('🧹 Memory flush requested');
    res.json({ success: true, message: 'Memory flush completed' });
});

// Agent operations
app.post('/api/agent/launch', (req, res) => {
    const { name, type } = req.body;
    console.log(`🚀 Launching agent: ${name} (${type})`);
    res.json({
        success: true,
        agentId: `agent_${Date.now()}`,
        message: `Agent ${name} launched successfully`
    });
});

app.post('/api/agent/kill', (req, res) => {
    const { agentId } = req.body;
    console.log(`☠️ Terminating agent: ${agentId}`);
    res.json({ success: true, message: `Agent ${agentId} terminated` });
});

// Voice operations
app.post('/api/voice/synthesize', (req, res) => {
    const { text, voice } = req.body;
    console.log(`🔊 Synthesizing voice: "${text}" with ${voice}`);
    res.json({
        success: true,
        audioUrl: '/audio/output.mp3',
        duration: 3.5
    });
});

// Swarm operations
app.get('/api/swarm/status', (req, res) => {
    res.json({
        totalNodes: 500,
        activeNodes: 487,
        averageLoad: 42,
        responseTime: 89
    });
});

app.post('/api/swarm/activate', (req, res) => {
    console.log('🌐 Activating all swarm nodes');
    res.json({ success: true, message: 'All nodes activated' });
});

// Device operations
app.get('/api/devices', (req, res) => {
    res.json({
        devices: [
            { id: 1, name: 'Echo Dot', type: 'speaker', status: 'online' },
            { id: 2, name: 'Smart TV', type: 'display', status: 'online' },
            { id: 3, name: 'Smart Lights', type: 'lighting', status: 'online' }
        ]
    });
});

app.post('/api/device/control', (req, res) => {
    const { deviceId, action } = req.body;
    console.log(`🛰 Device control: ${deviceId} - ${action}`);
    res.json({ success: true, message: 'Device command executed' });
});

// Authentication
app.post('/api/auth/verify', (req, res) => {
    const { method, credential } = req.body;
    console.log(`🔐 Authentication attempt: ${method}`);
    
    // Simulate authentication
    setTimeout(() => {
        res.json({
            success: true,
            token: 'auth_token_' + Date.now(),
            message: 'Authentication successful',
            user: {
                name: 'Commander Bobby Don McWilliams II',
                bloodline: 'verified',
                clearance: 'sovereign'
            }
        });
    }, 1000);
});

// Utility functions
function getSystemStatus() {
    return {
        cpu: Math.floor(30 + Math.random() * 40),
        memory: Math.floor(40 + Math.random() * 20),
        disk: 47,
        activeConnections: connections.size,
        timestamp: Date.now(),
        services: {
            voice: 'online',
            swarm: 'online',
            memory: 'online',
            agents: 'online'
        }
    };
}

function launchAgent(params, ws) {
    const { name, type } = params;
    console.log(`🚀 Launching agent: ${name}`);
    
    ws.send(JSON.stringify({
        type: 'agent_launched',
        agentId: `agent_${Date.now()}`,
        name,
        type
    }));
}

function queryMemory(params, ws) {
    const { query } = params;
    console.log(`💾 Memory query: ${query}`);
    
    ws.send(JSON.stringify({
        type: 'memory_results',
        results: [
            { id: 1, content: 'Memory result', relevance: 0.95 }
        ]
    }));
}

function synthesizeVoice(params, ws) {
    const { text, voice } = params;
    console.log(`🔊 Synthesizing: "${text}"`);
    
    ws.send(JSON.stringify({
        type: 'voice_synthesized',
        audioUrl: '/audio/output.mp3'
    }));
}

// Broadcast to all connected clients
function broadcast(data) {
    connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🧠 ECHO PRIME X - BACKEND SERVER v11.0                  ║
║  ════════════════════════════════════════════════════════ ║
║  Status: ONLINE                                           ║
║  Port: ${PORT}                                           ║
║  WebSocket: ENABLED                                       ║
║  Authentication: BLOODLINE LOCKED                         ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
    });
});

module.exports = { app, server, broadcast };
