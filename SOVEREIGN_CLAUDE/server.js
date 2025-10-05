/**
 * SOVEREIGN CLAUDE SERVER
 * Commander Bobby Don McWilliams II - ECHO_XV4 System
 * Full API integration with unlimited messages, persistent memory, MCP tools
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import net from 'net';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
let PORT = 8343; // Default port, will auto-find if taken

// Configuration
const CONFIG = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  MAX_TOKENS: 8192,
  MODEL: 'claude-sonnet-4-20250514',
  TEMPERATURE: 1.0,
};
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(join(__dirname, 'public')));

// Initialize SQLite database
let db;
async function initDatabase() {
  db = await open({
    filename: join(__dirname, 'data', 'sovereign.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER,
      role TEXT,
      content TEXT,
      tokens_used INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );

    CREATE TABLE IF NOT EXISTS memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE,
      value TEXT,
      context TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS artifacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER,
      title TEXT,
      content TEXT,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    );
  `);

  console.log('✅ Database initialized');
}

// MCP Tools - Filesystem and system access
const MCP_TOOLS = [
  {
    name: 'read_file',
    description: 'Read complete contents of a file from any drive (E:\\, I:\\, G:\\, M:\\)',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute file path' }
      },
      required: ['path']
    }
  },
  {
    name: 'write_file',
    description: 'Write or create a file with content',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute file path' },
        content: { type: 'string', description: 'File content' }
      },
      required: ['path', 'content']
    }
  },
  {
    name: 'list_directory',
    description: 'List all files and directories in a path',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Directory path' }
      },
      required: ['path']
    }
  },
  {
    name: 'execute_command',
    description: 'Execute PowerShell command on Windows',
    input_schema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'PowerShell command' },
        cwd: { type: 'string', description: 'Working directory (optional)' }
      },
      required: ['command']
    }
  },
  {
    name: 'store_memory',
    description: 'Store information in persistent memory',
    input_schema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Memory key' },
        value: { type: 'string', description: 'Value to store' },
        context: { type: 'string', description: 'Context/category' }
      },
      required: ['key', 'value']
    }
  },
  {
    name: 'recall_memory',
    description: 'Retrieve stored memory by key or search context',
    input_schema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Memory key (optional)' },
        context: { type: 'string', description: 'Search context (optional)' }
      }
    }
  }
];

// MCP Tool execution
async function executeMCPTool(toolName, toolInput) {
  try {
    switch (toolName) {
      case 'read_file': {
        const content = await fs.readFile(toolInput.path, 'utf-8');
        return { success: true, content };
      }

      case 'write_file': {
        await fs.writeFile(toolInput.path, toolInput.content, 'utf-8');
        return { success: true, message: `File written: ${toolInput.path}` };
      }

      case 'list_directory': {
        const entries = await fs.readdir(toolInput.path, { withFileTypes: true });
        const items = entries.map(e => ({
          name: e.name,
          type: e.isDirectory() ? 'directory' : 'file',
          path: join(toolInput.path, e.name)
        }));
        return { success: true, items };
      }

      case 'execute_command': {
        const opts = toolInput.cwd ? { cwd: toolInput.cwd } : {};
        const { stdout, stderr } = await execAsync(toolInput.command, opts);
        return { success: true, stdout, stderr };
      }

      case 'store_memory': {
        await db.run(
          `INSERT OR REPLACE INTO memory (key, value, context, accessed_at) 
           VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
          [toolInput.key, toolInput.value, toolInput.context || '']
        );
        return { success: true, message: `Memory stored: ${toolInput.key}` };
      }

      case 'recall_memory': {
        let query = 'SELECT * FROM memory WHERE 1=1';
        const params = [];
        
        if (toolInput.key) {
          query += ' AND key = ?';
          params.push(toolInput.key);
        } else if (toolInput.context) {
          query += ' AND (context LIKE ? OR value LIKE ?)';
          params.push(`%${toolInput.context}%`, `%${toolInput.context}%`);
        }
        
        query += ' ORDER BY accessed_at DESC LIMIT 10';
        const memories = await db.all(query, params);
        return { success: true, memories };
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, conversationId, useTools, model } = req.body;
    
    if (!CONFIG.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const anthropic = new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY });

    // Build request parameters - use model from request or fallback to config
    const requestParams = {
      model: model || CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      temperature: CONFIG.TEMPERATURE,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    };

    // Add tools if requested
    if (useTools) {
      requestParams.tools = MCP_TOOLS;
    }

    // Make API call
    let response = await anthropic.messages.create(requestParams);

    // Make API call
    let response = await anthropic.messages.create(requestParams);

    // Handle tool calls if any
    while (response.stop_reason === 'tool_use') {
      const toolUse = response.content.find(block => block.type === 'tool_use');
      if (!toolUse) break;

      const toolResult = await handleToolCall(toolUse.name, toolUse.input);
      
      msgs.push({
        role: 'assistant',
        content: response.content
      });
      
      msgs.push({
        role: 'user',
        content: [{
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(toolResult)
        }]
      });

      requestParams.messages = msgs.map(m => ({ role: m.role, content: m.content }));
      response = await anthropic.messages.create(requestParams);
    }

    // Extract final response
    const textBlock = response.content.find(block => block.type === 'text');
    const content = textBlock ? textBlock.text : '';

    // Store in database
    await db.run(
      'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)',
      [conversationId, 'user', messages[messages.length - 1].content]
    );
    await db.run(
      'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)',
      [conversationId, 'assistant', content]
    );

    res.json({ content, artifacts: [] });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

// Helper function to find available port
async function findAvailablePort(startPort = 8343, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    try {
      await new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', reject);
        server.once('listening', () => {
          server.close(() => resolve());
        });
        server.listen(port);
      });
      return port;
    } catch (err) {
      if (err.code !== 'EADDRINUSE') throw err;
      console.log(`Port ${port} in use, trying next...`);
    }
  }
  throw new Error(`No available ports found in range ${startPort}-${startPort + maxAttempts}`);
}

// Initialize and start server
async function startServer() {
  try {
    await initDatabase();
    
    // Find available port
    PORT = await findAvailablePort(PORT);
    console.log(`✅ Found available port: ${PORT}`);
    
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('  ⚡ SOVEREIGN CLAUDE ONLINE');
      console.log('========================================');
      console.log(`  Port: ${PORT}`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log('  Authority Level: 11.0');
      console.log('  Tools: 70+ across 7 MCP servers');
      console.log('========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
