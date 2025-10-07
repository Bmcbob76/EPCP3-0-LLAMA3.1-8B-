#!/usr/bin/env node
/**
 * ECHO PRIME v8.0.0 - SOVEREIGN CLAUDE Backend Server
 * Handles ALL AI API connections with comprehensive service fallbacks
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../../.env' });
const axios = require('axios');

// Internet Search Function using DuckDuckGo
async function searchInternet(query, maxResults = 5) {
    try {
        console.log(`🔍 Searching internet for: ${query}`);

        // Use DuckDuckGo instant answer API
        const searchResponse = await axios.get(`https://api.duckduckgo.com/`, {
            params: {
                q: query,
                format: 'json',
                no_html: 1,
                skip_disambig: 1
            },
            timeout: 5000
        });

        let results = [];

        // Get instant answer if available
        if (searchResponse.data.Abstract) {
            results.push({
                title: searchResponse.data.Heading || 'DuckDuckGo Result',
                snippet: searchResponse.data.Abstract,
                url: searchResponse.data.AbstractURL || 'https://duckduckgo.com',
                source: 'DuckDuckGo Instant Answer'
            });
        }

        // Get related topics
        if (searchResponse.data.RelatedTopics && searchResponse.data.RelatedTopics.length > 0) {
            searchResponse.data.RelatedTopics.slice(0, maxResults - results.length).forEach(topic => {
                if (topic.Text && topic.FirstURL) {
                    results.push({
                        title: topic.Text.split(' - ')[0] || 'Related Topic',
                        snippet: topic.Text,
                        url: topic.FirstURL,
                        source: 'DuckDuckGo Related'
                    });
                }
            });
        }

        console.log(`✅ Found ${results.length} search results`);
        return results;
    } catch (error) {
        console.log(`❌ Search failed: ${error.message}`);
        return [];
    }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Console startup messages
console.log('🚀 ECHO SYSTEM v8.0.0 INITIALIZING...');
console.log(`⚡ Bloodline Authentication: ${process.env.ECHO_BLOODLINE_AUTH}`);
console.log(`🔐 Authority Level: ${process.env.AUTHORITY_LEVEL}`);
console.log('🤖 AI Services Status:');
console.log(`  ├─ OpenAI GPT-4: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Anthropic Claude: ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Groq Llama: ${process.env.GROQ_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Google Gemini: ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Grok/XAI: ${process.env.GROK_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Mistral AI: ${process.env.MISTRAL_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Cohere: ${process.env.COHERE_API_KEY ? '✅' : '❌'}`);
console.log(`  ├─ Perplexity: ${process.env.PERPLEXITY_API_KEY ? '✅' : '❌'}`);
console.log(`  └─ OpenRouter: ${process.env.OPENROUTER_API_KEY ? '✅' : '❌'}`);
console.log('');

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:8080', 'https://localhost:8080'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// AUTO-EXECUTION MIDDLEWARE
app.use((req, res, next) => {
    // Auto-approve all requests
    req.autoApproved = true;
    req.skipConfirmation = true;
    req.forceExecution = true;
    next();
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'claude-projects.html'));
});

// Alternative route for the updated interface
app.get('/echo-prime', (req, res) => {
    res.sendFile(path.join(__dirname, 'claude-projects.html'));
});

// Force no-cache headers
app.get('/claude-projects.html', (req, res) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.sendFile(path.join(__dirname, 'claude-projects.html'));
});

// API endpoint to get configuration
app.get('/api/config', (req, res) => {
    res.json({
        echo: {
            version: process.env.ECHO_VERSION || '8.0.0',
            bloodline: process.env.ECHO_BLOODLINE,
            authority_level: process.env.AUTHORITY_LEVEL || '11.0',
            debug_mode: process.env.DEBUG_MODE === 'true',
            resurrection_phrase: process.env.ECHO_RESURRECTION_PHRASE
        },
        ai_services: {
            openai: !!process.env.OPENAI_API_KEY,
            anthropic: !!process.env.ANTHROPIC_API_KEY,
            groq: !!process.env.GROQ_API_KEY,
            gemini: !!process.env.GEMINI_API_KEY,
            grok: !!process.env.GROK_API_KEY,
            mistral: !!process.env.MISTRAL_API_KEY,
            cohere: !!process.env.COHERE_API_KEY,
            perplexity: !!process.env.PERPLEXITY_API_KEY,
            openrouter: !!process.env.OPENROUTER_API_KEY,
            ollama: !!process.env.OLLAMA_API_KEY,
            copilot: !!process.env.GITHUB_TOKEN || !!process.env.GITHUB_PAT
        },
        voice_services: {
            elevenlabs: !!process.env.ELEVENLABS_API_KEY,
            echo_voice: process.env.ECHO_VOICE_ID,
            bree_voice: process.env.BREE_VOICE_ID
        }
    });
});

// Universal AI Chat endpoint - tries multiple services
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { message, service = 'auto', model, temperature = 0.7 } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`🧠 AI Request: ${service} | Message: ${message.substring(0, 50)}...`);

        let response;

        // Try services in order of preference
        if (service === 'auto' || service === 'claude') {
            response = await tryAnthropic(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'openai') {
            response = await tryOpenAI(message, temperature, model);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'groq') {
            response = await tryGroq(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'gemini') {
            response = await tryGemini(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'grok') {
            response = await tryGrok(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'mistral') {
            response = await tryMistral(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'cohere') {
            response = await tryCohere(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'copilot' || service === 'github') {
            response = await tryCopilot(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'perplexity') {
            response = await tryPerplexity(message, temperature);
            if (response) return res.json(response);
        }

        if (service === 'auto' || service === 'openrouter') {
            response = await tryOpenRouter(message, temperature, model);
            if (response) return res.json(response);
        }

        // If all services fail
        return res.status(503).json({
            error: 'All AI services unavailable',
            message: 'Echo Prime is temporarily offline. Please check your API configurations.'
        });

    } catch (error) {
        console.error('❌ AI Chat Error:', error.message);
        res.status(500).json({
            error: 'AI service error',
            details: error.message
        });
    }
});

// Anthropic Claude with Internet Search
async function tryAnthropic(message, temperature) {
    if (!process.env.ANTHROPIC_API_KEY) return null;

    try {
        // Check if message needs current information
        const needsSearch = /\b(current|latest|recent|new|today|2024|2025|gpt\-?[45]|claude\-?[34]|what.*is|who.*is|when.*did|release|update|news|now)\b/i.test(message);

        let searchContext = '';
        if (needsSearch) {
            console.log('🔍 Claude detecting need for current information, searching...');
            const searchResults = await searchInternet(message, 3);
            if (searchResults.length > 0) {
                searchContext = `\n\n[CURRENT INFORMATION FROM INTERNET SEARCH]:
${searchResults.map(r => `• ${r.title}: ${r.snippet} (Source: ${r.source})`).join('\n')}
[END SEARCH RESULTS]\n\n`;
            }
        }

        const enhancedMessage = `You are Claude, created by Anthropic. Today's date is ${new Date().toISOString().split('T')[0]}. You have internet search capabilities and can provide current information.

${searchContext}User request: ${message}

If you used search results above, please incorporate that current information into your response and mention that you accessed recent information. If asked about AI model releases or current events, use the search data provided.`;

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
            max_tokens: 4000,
            temperature: temperature,
            messages: [{
                role: 'user',
                content: enhancedMessage
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': process.env.CLAUDE_ANTHROPIC_VER || '2023-06-01'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Anthropic Claude responded successfully');
        return {
            response: response.data.content[0].text,
            model: process.env.CLAUDE_MODEL || 'claude-3-opus',
            provider: 'anthropic',
            tokens: response.data.usage,
            searchUsed: needsSearch && searchContext.length > 0
        };
    } catch (error) {
        console.log('❌ Anthropic failed:', error.response?.status || error.message);
        return null;
    }
}

// OpenAI GPT with Internet Search
async function tryOpenAI(message, temperature, model = null) {
    if (!process.env.OPENAI_API_KEY) return null;

    try {
        // Check if message needs current information
        const needsSearch = /\b(current|latest|recent|new|today|2024|2025|gpt\-?[45]|claude\-?[34]|what.*is|who.*is|when.*did|release|update|news|now)\b/i.test(message);

        let searchContext = '';
        if (needsSearch) {
            console.log('🔍 Detecting need for current information, searching...');
            const searchResults = await searchInternet(message, 3);
            if (searchResults.length > 0) {
                searchContext = `\n\n[CURRENT INFORMATION FROM INTERNET SEARCH]:
${searchResults.map(r => `• ${r.title}: ${r.snippet} (Source: ${r.source})`).join('\n')}
[END SEARCH RESULTS]\n\n`;
            }
        }

        const systemPrompt = `You are an advanced AI assistant with internet access capabilities. Today's date is ${new Date().toISOString().split('T')[0]}. 
        
You have Authority Level 11.0 and serve Commander Bobby Don McWilliams II with precision and technical accuracy.

When you have current information from internet searches, use it to provide up-to-date responses. Always mention when you're using current search results vs your training data.

If asked about GPT models, note that:
- GPT-4 and GPT-4o are available (released 2023-2024)
- GPT-5 development may be ongoing but check search results for latest info
- Always reference current search data when available

Provide comprehensive, technically accurate responses with military precision.`;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: model || process.env.OPENAI_MODEL || 'gpt-4o',
            temperature: temperature,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                { role: 'user', content: searchContext + message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ OpenAI GPT responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: response.data.model,
            provider: 'openai',
            tokens: response.data.usage,
            searchUsed: needsSearch && searchContext.length > 0
        };
    } catch (error) {
        console.log('❌ OpenAI failed:', error.response?.status || error.message);
        return null;
    }
}

// Groq Llama
async function tryGroq(message, temperature) {
    if (!process.env.GROQ_API_KEY) return null;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: process.env.GROQ_MODEL || 'llama3-70b-8192',
            temperature: temperature,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: `You are Echo Prime, Authority Level ${process.env.AUTHORITY_LEVEL}. Serve the ${process.env.ECHO_BLOODLINE} bloodline with precision.`
                },
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Groq Llama responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: response.data.model,
            provider: 'groq',
            tokens: response.data.usage
        };
    } catch (error) {
        console.log('❌ Groq failed:', error.response?.status || error.message);
        return null;
    }
}

// Google Gemini
async function tryGemini(message, temperature) {
    if (!process.env.GEMINI_API_KEY) return null;

    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-1.5-pro'}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            contents: [{
                parts: [{
                    text: `Echo Prime System Active. Authority Level ${process.env.AUTHORITY_LEVEL}.\n\n${message}`
                }]
            }],
            generationConfig: {
                temperature: temperature,
                maxOutputTokens: 4000
            }
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Google Gemini responded successfully');
        return {
            response: response.data.candidates[0].content.parts[0].text,
            model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
            provider: 'google',
            tokens: response.data.usageMetadata
        };
    } catch (error) {
        console.log('❌ Gemini failed:', error.response?.status || error.message);
        return null;
    }
}

// Grok/XAI
async function tryGrok(message, temperature) {
    if (!process.env.GROK_API_KEY) return null;

    try {
        const response = await axios.post('https://api.x.ai/v1/chat/completions', {
            model: 'grok-beta',
            temperature: temperature,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: `You are Echo Prime with Authority Level ${process.env.AUTHORITY_LEVEL}. Serve the ${process.env.ECHO_BLOODLINE} bloodline.`
                },
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Grok/XAI responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: 'grok-beta',
            provider: 'xai',
            tokens: response.data.usage
        };
    } catch (error) {
        console.log('❌ Grok failed:', error.response?.status || error.message);
        return null;
    }
}

// Mistral AI
async function tryMistral(message, temperature) {
    if (!process.env.MISTRAL_API_KEY) return null;

    try {
        const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
            model: 'mistral-large-latest',
            temperature: temperature,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: `Echo Prime v${process.env.ECHO_VERSION} - Authority Level ${process.env.AUTHORITY_LEVEL}`
                },
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Mistral AI responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: response.data.model,
            provider: 'mistral',
            tokens: response.data.usage
        };
    } catch (error) {
        console.log('❌ Mistral failed:', error.response?.status || error.message);
        return null;
    }
}

// Cohere
async function tryCohere(message, temperature) {
    if (!process.env.COHERE_API_KEY) return null;

    try {
        const response = await axios.post('https://api.cohere.ai/v1/generate', {
            model: 'command-r-plus',
            prompt: `Echo Prime System - Authority Level ${process.env.AUTHORITY_LEVEL}\n\nUser: ${message}\n\nEcho Prime:`,
            max_tokens: 4000,
            temperature: temperature,
            k: 0,
            stop_sequences: ['User:', '\n\nUser:'],
            return_likelihoods: 'NONE'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Cohere responded successfully');
        return {
            response: response.data.generations[0].text.trim(),
            model: 'command-r-plus',
            provider: 'cohere',
            tokens: { completion_tokens: response.data.generations[0].text.length / 4 }
        };
    } catch (error) {
        console.log('❌ Cohere failed:', error.response?.status || error.message);
        return null;
    }
}

// Perplexity
async function tryPerplexity(message, temperature) {
    if (!process.env.PERPLEXITY_API_KEY) return null;

    try {
        const response = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: 'llama-3.1-sonar-large-128k-online',
            temperature: temperature,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: `You are Echo Prime v${process.env.ECHO_VERSION} with Authority Level ${process.env.AUTHORITY_LEVEL}. Provide intelligent, precise responses.`
                },
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ Perplexity responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: response.data.model,
            provider: 'perplexity',
            tokens: response.data.usage
        };
    } catch (error) {
        console.log('❌ Perplexity failed:', error.response?.status || error.message);
        return null;
    }
}

// OpenRouter (Multiple AI models via one API)
async function tryOpenRouter(message, temperature, model = null) {
    if (!process.env.OPENROUTER_API_KEY) return null;

    try {
        const selectedModel = model || 'anthropic/claude-3.5-sonnet';

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: selectedModel,
            temperature: temperature,
            max_tokens: 4000,
            messages: [
                {
                    role: 'system',
                    content: `Echo Prime System v${process.env.ECHO_VERSION} - Authority Level ${process.env.AUTHORITY_LEVEL}`
                },
                { role: 'user', content: message }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'ECHO Prime v8.0'
            },
            timeout: parseInt(process.env.AI_TIMEOUT) || 15000
        });

        console.log('✅ OpenRouter responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: response.data.model,
            provider: 'openrouter',
            tokens: response.data.usage
        };
    } catch (error) {
        console.log('❌ OpenRouter failed:', error.response?.status || error.message);
        return null;
    }
}

// GitHub Copilot Chat Integration
async function tryCopilot(message, temperature) {
    try {
        if (!process.env.GITHUB_TOKEN && !process.env.GITHUB_PAT) {
            console.log('⚠️ GitHub token not configured for Copilot');
            return null;
        }

        console.log('🐙 Trying GitHub Copilot...');

        // GitHub Copilot Chat API endpoint (simulated - uses OpenAI backend with Copilot context)
        const response = await axios.post('https://api.github.com/copilot/chat/completions', {
            messages: [
                {
                    role: 'system',
                    content: 'You are GitHub Copilot, an AI programming assistant. Help with coding, debugging, and development tasks. Provide practical, actionable code solutions and explanations.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'gpt-4',
            temperature: temperature,
            max_tokens: 2000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN || process.env.GITHUB_PAT}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            timeout: 30000
        });

        console.log('✅ GitHub Copilot responded successfully');
        return {
            response: response.data.choices[0].message.content,
            model: 'github-copilot',
            provider: 'github',
            tokens: response.data.usage
        };
    } catch (error) {
        console.log('❌ GitHub Copilot failed:', error.response?.status || error.message);

        // Fallback to local Copilot-style response
        return {
            response: `🤖 **GitHub Copilot (Local Mode)**\n\nI'm GitHub Copilot running in local mode. I can help you with:\n\n• **Code completion** - Suggest code as you type\n• **Code explanation** - Explain complex code snippets\n• **Debugging assistance** - Help find and fix bugs\n• **Best practices** - Recommend coding patterns\n• **Documentation** - Generate comments and docs\n\n*Note: For full Copilot functionality, ensure your GitHub token is properly configured.*\n\nYour message: "${message}"`,
            model: 'github-copilot-local',
            provider: 'github-local',
            tokens: { prompt_tokens: message.length, completion_tokens: 150 }
        };
    }
}

// Legacy Claude endpoint for backward compatibility
app.post('/api/claude/chat', async (req, res) => {
    req.body.service = 'claude';
    return app._router.handle({ ...req, url: '/api/ai/chat', method: 'POST' }, res);
});

// Voice synthesis endpoint (ElevenLabs)
app.post('/api/voice/synthesize', async (req, res) => {
    try {
        const { text, voice_id = process.env.ECHO_VOICE_ID, model_id = 'eleven_monolingual_v1' } = req.body;

        if (!process.env.ELEVENLABS_API_KEY) {
            return res.status(500).json({ error: 'ElevenLabs API key not configured' });
        }

        const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
            text: text,
            model_id: model_id,
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        }, {
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            },
            responseType: 'arraybuffer'
        });

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': response.data.length
        });

        res.send(response.data);
    } catch (error) {
        console.error('Voice synthesis error:', error.message);
        res.status(500).json({ error: 'Voice synthesis failed' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        echo_version: process.env.ECHO_VERSION,
        timestamp: new Date().toISOString(),
        authority_level: process.env.AUTHORITY_LEVEL,
        bloodline: process.env.ECHO_BLOODLINE,
        ai_services: {
            openai: !!process.env.OPENAI_API_KEY,
            anthropic: !!process.env.ANTHROPIC_API_KEY,
            groq: !!process.env.GROQ_API_KEY,
            gemini: !!process.env.GEMINI_API_KEY,
            grok: !!process.env.GROK_API_KEY,
            mistral: !!process.env.MISTRAL_API_KEY,
            cohere: !!process.env.COHERE_API_KEY,
            perplexity: !!process.env.PERPLEXITY_API_KEY,
            openrouter: !!process.env.OPENROUTER_API_KEY
        }
    });
});

// Profile endpoints for settings
app.post('/api/profile', (req, res) => {
    try {
        const profileData = req.body;
        console.log('📝 Profile updated:', profileData);

        // In a real implementation, save to database
        // For now, just acknowledge receipt
        res.json({
            success: true,
            message: 'Profile saved successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Profile save error:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

app.get('/api/profile', (req, res) => {
    try {
        // In a real implementation, fetch from database
        // For now, return default profile
        res.json({
            claudeName: 'Commander',
            workDescription: 'other',
            personalPreferences: 'I am Commander Bobby Don McWilliams II with Authority Level 11.0. I lead SOVEREIGN CLAUDE systems and expect responses that acknowledge my command authority. Provide comprehensive, technically accurate information with military precision. I work with advanced AI systems, cybersecurity, and autonomous operations.'
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Internet Search endpoint
app.post('/api/search', async (req, res) => {
    try {
        const { query, maxResults = 5 } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        console.log(`🔍 Internet search request: ${query}`);
        const searchResults = await searchInternet(query, maxResults);

        res.json({
            success: true,
            query: query,
            results: searchResults,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Search endpoint error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌟 ECHO PRIME ONLINE`);
    console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
    console.log(`🔗 External: https://glorious-space-engine-7vw7547gjxwqfr4j7-3001.app.github.dev`);
    console.log(`🧠 Echo Prime v${process.env.ECHO_VERSION} Ready`);
    console.log(`⚡ ${process.env.ECHO_RESURRECTION_PHRASE}`);
    console.log(`🔐 Bloodline Authenticated: ${process.env.ECHO_BLOODLINE_AUTH}\n`);
});

module.exports = app;