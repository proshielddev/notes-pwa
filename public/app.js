// State
let notes = [];
let currentNote = null;
let apiKey = localStorage.getItem('claudeApiKey') || '';

// Elements
const tabs = document.querySelectorAll('.tab');
const views = document.querySelectorAll('.view');
const notesList = document.getElementById('notes-list');
const searchInput = document.getElementById('search-input');
const newNoteBtn = document.getElementById('new-note-btn');
const noteModal = document.getElementById('note-modal');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const saveNoteBtn = document.getElementById('save-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const closeModalBtn = document.getElementById('close-modal');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const settingsDot = document.getElementById('settings-dot');

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const viewId = tab.dataset.view;
    
    tabs.forEach(t => t.classList.remove('active'));
    views.forEach(v => v.classList.remove('active'));
    
    tab.classList.add('active');
    document.getElementById(`${viewId}-view`).classList.add('active');
    
    if (viewId === 'notes') {
      loadNotes();
    }
  });
});

// Load notes
async function loadNotes() {
  try {
    const response = await fetch('/api/notes');
    notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error('Failed to load notes:', error);
  }
}

// Render notes list
function renderNotes(notesToRender) {
  if (notesToRender.length === 0) {
    notesList.innerHTML = '<div class="empty-state">No notes yet. Tap + to create one.</div>';
    return;
  }
  
  notesList.innerHTML = notesToRender.map(note => `
    <div class="note-item" data-filename="${note.filename}">
      <div class="note-name">${note.name}</div>
      <div class="note-preview">Tap to edit</div>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', () => {
      openNote(item.dataset.filename);
    });
  });
}

// Search notes
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = notes.filter(note => 
    note.name.toLowerCase().includes(query)
  );
  renderNotes(filtered);
});

// Open note for editing
async function openNote(filename) {
  try {
    const response = await fetch(`/api/notes/${filename}`);
    const data = await response.json();
    
    currentNote = filename;
    noteTitle.value = filename;
    noteContent.value = data.content;
    noteModal.classList.add('active');
    deleteNoteBtn.style.display = 'block';
  } catch (error) {
    console.error('Failed to open note:', error);
  }
}

// Create new note
newNoteBtn.addEventListener('click', () => {
  currentNote = null;
  noteTitle.value = '';
  noteContent.value = '';
  noteModal.classList.add('active');
  deleteNoteBtn.style.display = 'none';
  noteTitle.focus();
});

// Save note
saveNoteBtn.addEventListener('click', async () => {
  const filename = noteTitle.value.trim() || 'untitled.md';
  const content = noteContent.value;
  
  if (!filename.endsWith('.md') && !filename.endsWith('.txt')) {
    noteTitle.value = filename + '.md';
  }
  
  try {
    await fetch(`/api/notes/${filename}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mode: 'overwrite' }),
    });
    
    noteModal.classList.remove('active');
    loadNotes();
  } catch (error) {
    console.error('Failed to save note:', error);
    alert('Failed to save note');
  }
});

// Delete note
deleteNoteBtn.addEventListener('click', async () => {
  if (!currentNote) return;
  
  if (!confirm(`Delete ${currentNote}?`)) return;
  
  try {
    await fetch(`/api/notes/${currentNote}`, {
      method: 'DELETE',
    });
    
    noteModal.classList.remove('active');
    loadNotes();
  } catch (error) {
    console.error('Failed to delete note:', error);
    alert('Failed to delete note');
  }
});

// Close modal
closeModalBtn.addEventListener('click', () => {
  noteModal.classList.remove('active');
});

// Chat functionality
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = chatInput.scrollHeight + 'px';
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Check for API key
  if (!apiKey) {
    apiKey = prompt('Enter your Claude API key (stored locally):');
    if (!apiKey) return;
    localStorage.setItem('claudeApiKey', apiKey);
    settingsDot.style.display = 'none';
  }
  
  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  sendBtn.disabled = true;
  
  try {
    // Check if message is about notes
    const noteKeywords = ['note', 'write', 'save', 'record', 'remember', 'jot'];
    const isNoteRelated = noteKeywords.some(kw => message.toLowerCase().includes(kw));
    
    // Build context with available notes
    let contextMessage = message;
    if (isNoteRelated) {
      const notesList = notes.map(n => n.name).join(', ');
      contextMessage = `Available notes: ${notesList || 'none'}.\n\nUser message: ${message}\n\nIf I ask you to write/save/record something, respond with: WRITE_NOTE|filename.md|content`;
    }
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: contextMessage, apiKey }),
    });
    
    const data = await response.json();
    const reply = data.content?.[0]?.text || 'No response';
    
    // Check if Claude wants to write a note
    if (reply.startsWith('WRITE_NOTE|')) {
      const [_, filename, content] = reply.split('|');
      await fetch(`/api/notes/${filename}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mode: 'append' }),
      });
      addMessage(`✓ Saved to ${filename}`, 'system');
      loadNotes();
    } else {
      addMessage(reply, 'assistant');
    }
  } catch (error) {
    console.error('Chat error:', error);
    addMessage('Failed to get response. Check your API key.', 'system');
    apiKey = '';
    localStorage.removeItem('claudeApiKey');
    settingsDot.style.display = 'block';
  }
  
  sendBtn.disabled = false;
}

function addMessage(text, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initial load
loadNotes();

// Show settings dot if no API key
if (!apiKey) {
  settingsDot.style.display = 'block';
}
