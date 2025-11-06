#!/bin/bash

# Setup Verification Script for MarketAIV3
echo "======================================"
echo "MarketAIV3 Setup Verification Script"
echo "======================================"
echo ""

# Check Node.js
echo "1. Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✓ Node.js is installed: $NODE_VERSION"
else
    echo "   ✗ Node.js is NOT installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check npm
echo "2. Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "   ✓ npm is installed: $NPM_VERSION"
else
    echo "   ✗ npm is NOT installed. Please install npm."
    exit 1
fi

# Check frontend dependencies
echo "3. Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✓ Frontend dependencies are installed"
else
    echo "   ⚠ Frontend dependencies are NOT installed. Run 'npm install' in the root directory."
fi

# Check backend dependencies
echo "4. Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✓ Backend dependencies are installed"
else
    echo "   ⚠ Backend dependencies are NOT installed. Run 'npm install' in the backend directory."
fi

# Check environment files
echo "5. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✓ Frontend .env file exists"
else
    echo "   ⚠ Frontend .env file not found. Copy .env.example to .env"
fi

if [ -f "backend/.env" ]; then
    echo "   ✓ Backend .env file exists"
    
    # Check if COLAB_AI_SERVER_URL is configured
    if grep -q "COLAB_AI_SERVER_URL=https://" backend/.env; then
        echo "   ✓ COLAB_AI_SERVER_URL appears to be configured"
    else
        echo "   ⚠ COLAB_AI_SERVER_URL may not be configured properly in backend/.env"
    fi
else
    echo "   ⚠ Backend .env file not found. Copy backend/.env.example to backend/.env"
fi

# Test backend server (quick start/stop)
echo "6. Testing backend server..."
cd backend

# Use a different port to avoid conflicts with running servers
TEST_PORT=3099
PORT=$TEST_PORT node routes/index.js &
SERVER_PID=$!
sleep 2

if curl -s http://localhost:$TEST_PORT/api/health > /dev/null 2>&1; then
    echo "   ✓ Backend server started successfully"
    
    # Get health check data
    HEALTH_DATA=$(curl -s http://localhost:$TEST_PORT/api/health)
    AI_SERVER_CONFIGURED=$(echo $HEALTH_DATA | grep -o '"colabServerConfigured":[^,}]*' | cut -d':' -f2)
    
    if [ "$AI_SERVER_CONFIGURED" = "true" ]; then
        echo "   ✓ AI Server URL is properly configured"
    else
        echo "   ⚠ AI Server URL may need configuration"
    fi
else
    echo "   ✗ Backend server failed to start"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null
cd ..

echo ""
echo "======================================"
echo "Setup Verification Complete!"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. If any items are marked with ⚠, address them before running"
echo "2. Start the backend: cd backend && npm start"
echo "3. In a new terminal, start the frontend: npm run dev"
echo "4. Visit http://localhost:5173 in your browser"
echo ""
