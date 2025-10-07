const fetch = require('node-fetch');

// Map thread name to LLM endpoint/model
const LLM_ENDPOINTS = {
    'Echo Prime': 'http://localhost:11434/api/generate?model=llama3',
    'Claude': 'https://openrouter.ai/api/claude-3-opus',
    'GPT-4': 'https://openrouter.ai/api/gpt-4',
    'Gemini': 'https://openrouter.ai/api/gemini-pro',
    'Swarm Brain': 'http://localhost:11434/api/generate?model=mixtral',
    // Add more mappings as needed
};

async function getLLMResponse(llmRole, userText) {
    const endpoint = LLM_ENDPOINTS[llmRole];
    if (!endpoint) return '[No LLM configured for this thread]';
    // Example: Ollama local
    if (endpoint.startsWith('http://localhost:11434')) {
        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({prompt: userText})
        });
        const data = await resp.json();
        return data.response || '[No response]';
    }
    // Example: OpenRouter remote
    else {
        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {'Authorization': 'Bearer YOUR_OPENROUTER_API_KEY', 'Content-Type': 'application/json'},
            body: JSON.stringify({prompt: userText})
        });
        const data = await resp.json();
        return data.response || '[No response]';
    }
}

module.exports = { getLLMResponse };