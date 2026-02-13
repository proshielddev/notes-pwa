# Notes Agent PWA 📱

A Progressive Web App for taking notes with Claude AI assistance. Works on your phone like a native app!

## ✨ Features

- **📝 Notes Editor**: Create, edit, search, and delete notes
- **💬 Chat with Claude**: AI assistant that can read/write your notes
- **📱 PWA**: Install on your phone home screen
- **🌙 Dark Theme**: Easy on the eyes
- **💾 Offline Support**: Works without internet (except Claude chat)

## 🚀 Quick Deploy

### Option 1: Railway (Recommended for Node.js apps)

1. **Sign up at [railway.app](https://railway.app)**

2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy**:
   ```bash
   cd notes-pwa
   railway login
   railway init
   railway up
   ```

4. **Get your URL**: Railway will give you a URL like `https://your-app.up.railway.app`

### Option 2: Render

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**:
   - Connect your GitHub repo (push this code first)
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Deploy**: Render will build and give you an HTTPS URL

### Option 3: Fly.io

1. **Install Fly CLI**: https://fly.io/docs/hands-on/install-flyctl/

2. **Deploy**:
   ```bash
   cd notes-pwa
   fly launch
   fly deploy
   ```

## 📲 Installing on Your Phone

### iPhone (Safari)

1. Open your deployed URL in **Safari**
2. Tap the **Share** button (square with arrow up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon appears on your home screen!

### Android (Chrome)

1. Open your deployed URL in **Chrome**
2. Chrome will show **"Install app"** prompt, OR
3. Tap menu (⋮) → **"Install app"** or **"Add to Home Screen"**
4. The app icon appears on your home screen!

## 🔑 Setup Your API Key

1. Get your Claude API key from [console.anthropic.com](https://console.anthropic.com)
2. Open the app
3. Go to **Chat** tab
4. Send a message
5. It will prompt for your API key
6. Key is stored locally on your device

## 📂 Project Structure

```
notes-pwa/
├── server.js           # Express backend
├── package.json        # Dependencies
├── notes/             # Your notes are stored here
└── public/
    ├── index.html     # Main app UI
    ├── app.js         # Frontend logic
    ├── manifest.json  # PWA config
    ├── sw.js          # Service worker (offline support)
    ├── icon-192.png   # App icon (small)
    └── icon-512.png   # App icon (large)
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run locally
npm start

# Open in browser
http://localhost:3000

# Test on phone (same WiFi network)
http://YOUR_COMPUTER_IP:3000
```

## 🎨 Customization

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

### Change Theme Colors
Edit CSS variables in `public/index.html`:
```css
:root {
  --bg: #0a0a0a;          /* Background */
  --accent: #00ff88;      /* Accent color */
}
```

### Change Icons
Replace `icon-192.png` and `icon-512.png` with your own 192x192 and 512x512 PNG icons.

## 🔒 Security Notes

- API keys are stored locally on your device only
- Notes are stored on your server
- Use HTTPS in production (all deployment options provide this)
- Consider adding authentication if hosting publicly

## 📝 How It Works

### Notes Tab
- **Tap +** to create a new note
- **Tap a note** to edit it
- **Search** to filter notes
- **Delete** button in the editor

### Chat Tab
- Chat with Claude about anything
- Say **"write this to notes.md"** to save content
- Claude can read your existing notes for context
- Works best with natural language

## 🐛 Troubleshooting

**App won't install on iPhone?**
- Must use Safari browser
- URL must be HTTPS
- Try clearing browser cache

**App won't install on Android?**
- Must use Chrome browser
- URL must be HTTPS
- Check if installation is allowed in settings

**Chat not working?**
- Check your Claude API key
- Verify you have API credits
- Check browser console for errors

**Notes not syncing?**
- Notes are stored on the server
- Each device/browser has separate view
- Backend must be running for sync

## 🚀 Next Steps

Want to add more features? Here are ideas:

- **Folders/Tags**: Organize notes better
- **Voice Input**: Speak to create notes
- **Export**: Download notes as ZIP
- **Sync**: Multi-device sync with database
- **Sharing**: Share notes with others
- **Templates**: Quick note templates
- **Rich Text**: Markdown preview

Fork it, hack it, make it yours! 🎉
# notes-pwa
