const express = require('express');
const fs = require('fs');
const { getLLMResponse } = require('./llm'); // Utility to call Ollama/OpenRouter

const app = express();
app.use(express.json());

const DATA_PATH = './conversations.json';

function loadData() {
    if (!fs.existsSync(DATA_PATH)) return { threads: [], messages: [] };
    return JSON.parse(fs.readFileSync(DATA_PATH));
}

function saveData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// List threads
app.get('/api/threads', (req, res) => {
    const { threads } = loadData();
    res.json(threads);
});

// Get messages for a thread
app.get('/api/messages', (req, res) => {
    const { threads, messages } = loadData();
    const threadId = req.query.thread;
    const thread = threads.find(t => t.id === threadId);
    const threadMsgs = messages.filter(m => m.threadId === threadId);
    res.json({ thread, messages: threadMsgs });
});

// Create new thread
app.post('/api/threads', (req, res) => {
    const data = loadData();
    const id = String(Date.now());
    const icon = '💬'; // Default, or pick based on name/LLM
    const thread = {
        id, name: req.body.name, icon, messageCount: 0, lastActive: new Date().toISOString(), active: false
    };
    data.threads.push(thread);
    saveData(data);
    res.json(thread);
});

// Send message to thread (calls LLM API)
app.post('/api/messages', async (req, res) => {
    const data = loadData();
    const threadId = req.body.threadId;
    const text = req.body.text;
    const userMsg = {
        id: String(Date.now()),
        threadId,
        author: 'Commander',
        role: 'user',
        time: new Date().toLocaleString(),
        text
    };
    data.messages.push(userMsg);
    // Call LLM (Ollama/OpenRouter) for reply
    const thread = data.threads.find(t => t.id === threadId);
    const llmRole = thread.name; // Use name to route to correct LLM (Echo Prime, Claude, etc.)
    const assistantReply = await getLLMResponse(llmRole, text);
    const assistantMsg = {
        id: String(Date.now() + 1),
        threadId,
        author: llmRole,
        role: 'assistant',
        time: new Date().toLocaleString(),
        text: assistantReply
    };
    data.messages.push(assistantMsg);
    thread.messageCount += 2;
    thread.lastActive = new Date().toISOString();
    saveData(data);
    res.json({ userMsg, assistantMsg });
});

app.listen(3000, () => console.log('Chat Threads API running on port 3000'));