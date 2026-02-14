import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve service worker from root
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'sw.js'));
});

// Notes directory
const NOTES_DIR = path.join(__dirname, 'notes');
await fs.mkdir(NOTES_DIR, { recursive: true });

// Conversation history for context
let conversationHistory = [];

// ===== TONERO API ENDPOINTS =====

// Generate Plan (using Claude API)
app.post('/api/plan', async (req, res) => {
  try {
    const { dump, available_minutes, energy } = req.body;
    
    // Save to conversation history
    conversationHistory.push({
      role: 'user',
      content: `Brain dump: ${dump}\nAvailable time: ${available_minutes} minutes\nEnergy level: ${energy}`
    });
    
    // Mock response for now - you'll need to integrate with Claude API or your existing backend
    const plan = {
      top3: [
        {
          title: "Review project proposal",
          why: "High impact deliverable due soon",
          first_step: "Open the latest draft and read through",
          estimate_minutes: 45
        }
      ],
      quick_wins: [
        {
          title: "Reply to pending emails",
          first_step: "Sort inbox by unread",
          estimate_minutes: 15
        }
      ],
      deep_work: [],
      waiting_on: [],
      risks: [],
      one_question: "What's the most critical blocker to address first?"
    };
    
    conversationHistory.push({
      role: 'assistant',
      content: JSON.stringify(plan)
    });
    
    res.json({ plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Extract Notes (using Claude API)
app.post('/api/extract-notes', async (req, res) => {
  try {
    const { instruction } = req.body;
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `notes-${timestamp}.md`;
    
    // Mock extraction - you'll integrate with Claude API
    const content = `### ${instruction}\n\n- Key point from conversation\n- Another important item\n- Action item to follow up on\n\nCreated: ${new Date().toLocaleString()}`;
    
    const filepath = path.join(NOTES_DIR, filename);
    await fs.writeFile(filepath, content, 'utf-8');
    
    res.json({ filename, content });
  } catch (error) {
    console.error('Extract notes error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== NOTES ENDPOINTS =====

// List all notes
app.get('/api/notes', async (req, res) => {
  try {
    const files = await fs.readdir(NOTES_DIR);
    const notes = [];
    
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.txt')) {
        const filepath = path.join(NOTES_DIR, file);
        const stats = await fs.stat(filepath);
        const content = await fs.readFile(filepath, 'utf-8');
        const preview = content.substring(0, 100);
        
        notes.push({
          filename: file,
          preview,
          size: stats.size,
          created: stats.birthtime
        });
      }
    }
    
    // Sort by creation date, newest first
    notes.sort((a, b) => b.created - a.created);
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a specific note
app.get('/api/notes/:filename', async (req, res) => {
  try {
    const filepath = path.join(NOTES_DIR, req.params.filename);
    const content = await fs.readFile(filepath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: 'Note not found' });
  }
});

// Create or update a note
app.post('/api/notes/:filename', async (req, res) => {
  try {
    const { content, mode = 'overwrite' } = req.body;
    const filepath = path.join(NOTES_DIR, req.params.filename);
    
    let finalContent = content;
    
    if (mode === 'append') {
      try {
        const existing = await fs.readFile(filepath, 'utf-8');
        finalContent = existing + '\n\n' + content;
      } catch {
        // File doesn't exist, that's fine
      }
    }
    
    await fs.writeFile(filepath, finalContent, 'utf-8');
    res.json({ success: true, message: `Note ${mode === 'append' ? 'updated' : 'created'}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CHAT ENDPOINT =====

// Chat with OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, apiKey } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
      }),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});