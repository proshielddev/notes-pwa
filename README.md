# Tonero - Complete Integration 🎯

Your Tonero UI with Chat integration, ready to deploy as a PWA!

## Files Included

✅ **index.html** - Your Tonero UI + Chat tab + PWA meta tags
✅ **app.js** - Tonero planner logic + Chat functionality  
✅ **server.js** - Backend API for plans, notes, and chat

## How to Use These Files

### In Cursor (notes-pwa project):

1. **Replace `public/index.html`**
   - Delete current file
   - Copy/paste the new `index.html` content

2. **Replace `public/app.js`**
   - Delete current file
   - Copy/paste the new `app.js` content

3. **Replace `server.js`** (root level, not in public/)
   - Delete current file
   - Copy/paste the new `server.js` content

4. **Keep existing files:**
   - ✅ `public/manifest.json` (already have)
   - ✅ `public/sw.js` (already have)
   - ✅ `public/icon-192.png` (already have)
   - ✅ `public/icon-512.png` (already have)
   - ✅ `package.json` (already have)

## Test Locally

```bash
npm start
```

Open `http://localhost:3000`

You should see:
- **Planner tab**: Brain dump, plan generation, notes extraction
- **Chat tab**: Talk to Claude

## Deploy to Railway

```bash
git add .
git commit -m "Integrate Tonero UI with Chat"
git push
```

Railway auto-deploys. Wait 2 minutes.

## Install on Phone

1. Open your Railway URL on phone
2. Safari → Share → Add to Home Screen
3. Tap the Tonero icon!

## Features

### Planner Tab
- Brain dump textarea
- Generate AI-powered plans
- Extract notes from conversations
- View saved notes

### Chat Tab
- Talk to Claude about your tasks
- Ask Claude to write notes
- Get help organizing your work

### PWA Features
- Install on home screen
- Works offline (except chat)
- Brown "T" app icon
- Full-screen experience

## Notes on the Backend

The `server.js` includes:
- `/api/plan` - Generates plans (currently mock, integrate with your Claude API)
- `/api/extract-notes` - Extracts notes (currently mock)
- `/api/notes` - Lists saved notes
- `/api/notes/:filename` - Read/write specific notes
- `/api/chat` - Proxies to Claude API for chat

**Important:** The `/api/plan` and `/api/extract-notes` endpoints have mock responses. You'll need to integrate them with your actual Tonero backend or Claude API to get real plan generation.

## Customization

### Change Colors
Edit CSS variables in `index.html`:
- `#1a1a1a` - Main dark color
- `#f5f5f5` - Light backgrounds
- `#3b82f6` - Blue accents

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short"
}
```

### Change Icon
Replace `public/icon-192.png` and `public/icon-512.png`

## Troubleshooting

**Chat not working?**
- Make sure you enter your Claude API key when prompted
- Check browser console for errors

**Notes not loading?**
- Backend must be running
- Check `notes/` directory exists

**PWA not installing?**
- Must be HTTPS (Railway provides this)
- Clear Safari cache and try again
- Icons must be visible (not blank)

## Next Steps

1. Copy the 3 files to your `notes-pwa` project in Cursor
2. Test locally with `npm start`
3. Deploy with `git push`
4. Install on your phone!

🎉 You're ready to go!
