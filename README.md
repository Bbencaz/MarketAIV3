# MarketAIv3

A powerful social media post creator that leverages AI to generate and enhance images for your marketing campaigns.

This is a code bundle for MarketAIv3. The original project is available at https://www.figma.com/design/cIwzmJNbLxHqiRtupV6HyY/MarketAIv3.

## 🚀 Features

- **AI-Generated Posts**: Create social media posts from text descriptions
- **Image Enhancement**: Upload and enhance images with AI-powered editing
- **Multi-Platform Support**: Optimize posts for Instagram, Facebook, Twitter, LinkedIn, and TikTok
- **User Authentication**: Secure login and catalog management
- **Post Catalog**: Save and manage your created posts

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Bbencaz/MarketAIV3.git
cd MarketAIV3
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Copy environment example file
cp .env.example .env

# Edit .env and configure your settings (optional for basic usage)
# VITE_BACKEND_URL=http://localhost:3000
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment example file
cp .env.example .env

# Edit backend/.env and configure your Ngrok URL
# COLAB_AI_SERVER_URL=https://your-ngrok-url.ngrok-free.dev/edit
```

**Important**: You must configure the `COLAB_AI_SERVER_URL` in `backend/.env` for the AI image enhancement feature to work. This should point to your Google Colab instance with an Ngrok tunnel.

### 4. Environment Variables

#### Frontend (.env)
```env
# Backend server URL (default: http://localhost:3000)
VITE_BACKEND_URL=http://localhost:3000

# Optional: Supabase configuration
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Backend (backend/.env)
```env
# Port for the backend server
PORT=3000

# External Ngrok AI Server URL (REQUIRED for AI features)
COLAB_AI_SERVER_URL=https://your-ngrok-url.ngrok-free.dev/edit

# Request timeout in milliseconds (default: 180000 = 3 minutes)
REQUEST_TIMEOUT=180000

# Retry configuration
MAX_RETRIES=3
RETRY_DELAY=2000
```

## 🏃‍♂️ Running the Application

You need to run both the frontend and backend servers:

### Terminal 1: Start the Backend Server

```bash
cd backend
npm start
```

You should see output like:
```
============================================================
MarketAIV3 Backend Server
============================================================
Server is running on http://localhost:3000
AI Server URL: https://your-ngrok-url.ngrok-free.dev/edit
AI Server Status: CONFIGURED
Request Timeout: 180000ms
Max Retries: 3
Retry Delay: 2000ms
============================================================
```

### Terminal 2: Start the Frontend Development Server

```bash
# From the root directory
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy).

## 🔍 Verifying the Setup

1. **Check Backend Health**: Visit http://localhost:3000/api/health in your browser
2. **Open Frontend**: Visit http://localhost:5173 in your browser
3. **Test the Application**:
   - Select "Upload & Enhance" creation method
   - Upload an image
   - Provide an enhancement prompt
   - Click "Enhance with AI"

## ⚠️ Troubleshooting

### Backend won't start
- **Issue**: Port 3000 already in use
- **Solution**: Change `PORT` in `backend/.env` to another port (e.g., 3001)

### AI Server Connection Failed
- **Issue**: "Could not connect to the AI server"
- **Solutions**:
  - Ensure your Google Colab notebook is running
  - Verify the Ngrok URL is correct in `backend/.env`
  - Check that the Ngrok tunnel hasn't expired (Ngrok URLs change on restart)

### Frontend can't connect to backend
- **Issue**: "Cannot connect to the backend server"
- **Solutions**:
  - Ensure the backend server is running (`cd backend && npm start`)
  - Check that `VITE_BACKEND_URL` in `.env` matches your backend URL
  - Verify the backend is running on the correct port

### Image upload fails
- **Issue**: "File too large" or "Invalid file type"
- **Solutions**:
  - Ensure image is smaller than 10MB
  - Use supported image formats (JPEG, PNG, GIF, WebP)

### Request timeouts
- **Issue**: "The AI server took too long to respond"
- **Solutions**:
  - Try with a simpler prompt
  - Use a smaller image
  - Increase `REQUEST_TIMEOUT` in `backend/.env`
  - The AI server may be overloaded - wait and try again

## 🏗️ Project Structure

```
MarketAIV3/
├── backend/              # Backend Node.js server
│   ├── routes/          # API routes
│   ├── server.js        # Server entry point
│   ├── package.json     # Backend dependencies
│   └── .env             # Backend environment variables
├── src/                 # Frontend React source
│   ├── components/      # React components
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main application component
├── package.json        # Frontend dependencies
├── vite.config.ts      # Vite configuration
└── README.md           # This file
```

## 🔧 Development

### Backend Development

The backend uses Express.js and provides:
- `/api/health` - Health check endpoint
- `/api/edit` - Image enhancement endpoint with retry logic

Key features:
- Input validation for image uploads and prompts
- Automatic retry on timeout/network errors
- Comprehensive error messages
- File size limits (10MB max)

### Frontend Development

The frontend uses React + TypeScript + Vite and provides:
- Multi-step wizard for post creation
- Real-time preview
- Platform-specific optimization
- User authentication and catalog management

## 🐛 Known Issues

- The AI image enhancement feature requires an active Ngrok tunnel to a Google Colab instance
- Ngrok URLs expire and need to be updated in `backend/.env` when the Colab session restarts
- Large images or complex prompts may take 1-3 minutes to process

## 📝 Notes

- Do NOT commit your `.env` files - they contain sensitive configuration
- The `.env.example` files show what variables are needed
- Backend runs on port 3000 by default
- Frontend runs on port 5173 by default (Vite)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

If you encounter issues not covered in the troubleshooting section:
1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all services (backend, frontend, Colab/Ngrok) are running
4. Create an issue on GitHub with detailed error messages
