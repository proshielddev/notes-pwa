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
app.use(express.static('public'));

// Notes directory
const NOTES_DIR = path.join(__dirname, 'notes');

// Ensure notes directory exists
await fs.mkdir(NOTES_DIR, { recursive: true });

// API Routes

// List all notes
app.get('/api/notes', async (req, res) => {
  try {
    const files = await fs.readdir(NOTES_DIR);
    const notes = files
      .filter(f => f.endsWith('.md') || f.endsWith('.txt'))
      .map(f => ({
        filename: f,
        name: f.replace(/\.(md|txt)$/, ''),
      }));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a note
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

// Delete a note
app.delete('/api/notes/:filename', async (req, res) => {
  try {
    const filepath = path.join(NOTES_DIR, req.params.filename);
    await fs.unlink(filepath);
    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search notes
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const files = await fs.readdir(NOTES_DIR);
    const results = [];
    
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.txt')) continue;
      
      const filepath = path.join(NOTES_DIR, file);
      const content = await fs.readFile(filepath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query)) {
          results.push({
            file,
            line: index + 1,
            content: line.trim(),
          });
        }
      });
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claude API proxy (to avoid CORS issues)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, apiKey } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: message }],
      }),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Notes app running on port ${PORT}`);
  console.log(`📝 Notes stored in: ${NOTES_DIR}`);
});
