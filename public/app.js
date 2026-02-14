const API = window.location.origin + "/api";

// State
let apiKey = localStorage.getItem('openaiApiKey') || '';
let currentView = 'welcome'; // 'welcome' or 'chat'

// ===== DOM ELEMENTS (Define these FIRST) =====
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeView = document.getElementById('welcomeView');
const chatView = document.getElementById('chatView');
const backBtn = document.getElementById('backBtn');

// ===== VIEW SWITCHING =====

function showWelcome() {
  welcomeView.style.display = 'block';
  chatView.classList.remove('active');
  currentView = 'welcome';
  updateBackButtonVisibility();
}

function showChat() {
  if (currentView === 'welcome') {
    window.history.pushState({ view: 'chat' }, '', window.location.pathname);
  }
  welcomeView.style.display = 'none';
  chatView.classList.add('active');
  currentView = 'chat';
  updateBackButtonVisibility();
}

// ===== BACK BUTTON =====

function updateBackButtonVisibility() {
  const show = currentView !== 'welcome' || window.history.length > 1;
  if (backBtn) {
    backBtn.classList.toggle('hidden', !show);
  }
}

function initBackButton() {
  if (!backBtn) return;
  backBtn.addEventListener('click', () => {
    window.history.back();
  });
  window.addEventListener('popstate', () => {
    showWelcome();
  });
  updateBackButtonVisibility();
}

// ===== QUICK ACTIONS =====

function quickAction(action) {
  showChat();
  
  const prompts = {
    plan: "Help me create a plan for my tasks",
    analyze: "I need help analyzing some data",
    write: "Help me write something",
    summarize: "I need to summarize some text"
  };
  
  const message = prompts[action] || "How can you help me?";
  chatInput.value = message;
  chatInput.focus();
}

function showMore() {
  addChatMessage("Here are more things I can help with:\n\n• Generate plans from your brain dumps\n• Extract notes from conversations\n• Organize your tasks\n• Answer questions\n• Write and edit content", 'assistant');
  showChat();
}

// ===== CHAT FUNCTIONALITY =====

// Auto-resize input
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = chatInput.scrollHeight + 'px';
});

// Send on Enter (Shift+Enter for new line)
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Send button
sendBtn.addEventListener('click', sendMessage);

// Send message to OpenAI
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Check for API key
  if (!apiKey) {
    apiKey = prompt('Enter your OpenAI API key (stored locally):');
    if (!apiKey) return;
    localStorage.setItem('openaiApiKey', apiKey);
  }
  
  // Switch to chat view if in welcome
  if (currentView === 'welcome') {
    showChat();
  }
  
  // Add user message
  addChatMessage(message, 'user');
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  sendBtn.disabled = true;
  
  // Add loading indicator
  const loadingMsg = addChatMessage('', 'assistant');
  loadingMsg.innerHTML = '<div class="loading"></div>';
  
  try {
    const response = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, apiKey }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }
    
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';
    
    // Remove loading
    loadingMsg.remove();
    
    // Check if wants to write a note
    if (reply.startsWith('WRITE_NOTE|')) {
      const parts = reply.split('|');
      const filename = parts[1];
      const content = parts.slice(2).join('|');
      
      await fetch(`${API}/notes/${filename}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mode: 'append' }),
      });
      addChatMessage(`✓ Saved to ${filename}`, 'system');
      loadNotes();
    } else {
      addChatMessage(reply, 'assistant');
    }
  } catch (error) {
    console.error('Chat error:', error);
    loadingMsg.remove();
    addChatMessage('Failed to get response. Check your API key.', 'system');
    apiKey = '';
    localStorage.removeItem('openaiApiKey');
  }
  
  sendBtn.disabled = false;
  chatInput.focus();
}

// Add message to chat
function addChatMessage(text, role) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.textContent = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return messageDiv;
}

// ===== HEADER BUTTONS =====

document.getElementById('newChatBtn').addEventListener('click', () => {
  if (confirm('Start a new conversation? This will clear the current chat.')) {
    messagesContainer.innerHTML = '<div class="message system">Chat with me about anything!</div>';
    showWelcome();
  }
});

document.getElementById('historyBtn').addEventListener('click', () => {
  loadNotes();
  addChatMessage('Here are your saved notes. You can ask me to read or create notes!', 'system');
  showChat();
});

// ===== NOTES FUNCTIONALITY =====

async function loadNotes() {
  try {
    const res = await fetch(`${API}/notes`);
    if (!res.ok) throw new Error('Failed to load notes');
    
    const data = await res.json();
    console.log('Notes loaded:', data.notes.length);
  } catch (err) {
    console.error('Failed to load notes:', err);
  }
}

// ===== BUTTON EVENT LISTENERS =====

// Quick action buttons
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    if (action === 'more') {
      showMore();
    } else {
      quickAction(action);
    }
  });
});

// ===== INITIALIZATION =====

window.addEventListener('load', () => {
  loadNotes();
  showWelcome();
  initBackButton();
  chatInput.focus();
});