# Quick Setup Guide for MarketAIV3

This guide will get you up and running in 5 minutes.

## Prerequisites

- Node.js v16+ installed ([Download](https://nodejs.org/))
- npm (comes with Node.js)

## Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

```bash
# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env

# Edit backend/.env and set your Ngrok URL
# COLAB_AI_SERVER_URL=https://your-actual-ngrok-url.ngrok-free.dev/edit
nano backend/.env  # or use your preferred editor
```

**Important:** You MUST update `COLAB_AI_SERVER_URL` in `backend/.env` with your actual Ngrok tunnel URL for the AI enhancement feature to work.

### 3. Verify Setup (Optional but Recommended)

```bash
# Run the verification script
bash verify-setup.sh
```

This will check that everything is configured correctly.

### 4. Start the Application

Open two terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

You should see:
```
============================================================
MarketAIV3 Backend Server
============================================================
Server is running on http://localhost:3000
AI Server URL: https://your-ngrok-url.ngrok-free.dev/edit
AI Server Status: CONFIGURED
...
```

**Terminal 2 - Frontend Development Server:**
```bash
# From project root
npm run dev
```

You should see:
```
  VITE v6.4.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Open in Browser

Visit http://localhost:5173 in your web browser.

## Testing the Application

1. Select "Upload & Enhance" as the creation method
2. Upload an image (JPG, PNG, etc., max 10MB)
3. Enter a description of how you want to enhance the image
4. Click "Enhance with AI"
5. Wait for the AI to process (may take 30-60 seconds)

## Common Issues

### Backend won't start - "Port already in use"

Change the port in `backend/.env`:
```env
PORT=3001
```

Then also update the frontend `.env`:
```env
VITE_BACKEND_URL=http://localhost:3001
```

### "Cannot connect to the backend server"

Make sure:
1. The backend server is running (check Terminal 1)
2. The backend URL in `.env` matches the backend's port
3. There are no firewall issues

### "Could not connect to the AI server"

This means:
1. Your Ngrok URL in `backend/.env` is incorrect or expired
2. The Google Colab notebook isn't running
3. The Ngrok tunnel has expired (they restart periodically)

**Solution:** Update `COLAB_AI_SERVER_URL` in `backend/.env` with the new URL and restart the backend.

### Request times out

- Try with a smaller image
- Use a simpler prompt
- The AI server may be busy - wait and retry
- Increase `REQUEST_TIMEOUT` in `backend/.env` (default is 180000ms = 3 minutes)

## Environment Variables Reference

### Frontend (.env)
- `VITE_BACKEND_URL` - Backend server URL (default: http://localhost:3000)

### Backend (backend/.env)
- `PORT` - Backend server port (default: 3000)
- `COLAB_AI_SERVER_URL` - Ngrok tunnel URL to AI server (**REQUIRED**)
- `REQUEST_TIMEOUT` - Request timeout in ms (default: 180000)
- `MAX_RETRIES` - Number of retry attempts (default: 3)
- `RETRY_DELAY` - Delay between retries in ms (default: 2000)

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the troubleshooting section in README.md
- Check the health endpoint: http://localhost:3000/api/health

## Need Help?

1. Check the console logs in both terminals
2. Visit the health endpoint to verify backend status
3. Ensure all environment variables are set correctly
4. Review the full README.md for detailed troubleshooting
