const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configuration from environment variables
const COLAB_AI_SERVER_URL = process.env.COLAB_AI_SERVER_URL;
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '180000', 10);
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3', 10);
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY || '2000', 10);

// Ensure COLAB_AI_SERVER_URL is configured
if (!COLAB_AI_SERVER_URL) {
  console.error('[ERROR] COLAB_AI_SERVER_URL is not set in environment variables!');
  console.error('[ERROR] Please configure COLAB_AI_SERVER_URL in your .env file.');
  console.error('[ERROR] The /api/edit endpoint will not work until this is configured.');
}

// Validate Ngrok URL on startup
const validateServerUrl = (url) => {
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('URL must use HTTP or HTTPS protocol');
    }
    return true;
  } catch (error) {
    console.error(`[ERROR] Invalid COLAB_AI_SERVER_URL: ${error.message}`);
    return false;
  }
};

// Helper function to wait/delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry logic wrapper
const retryRequest = async (fn, maxRetries = MAX_RETRIES, retryDelay = RETRY_DELAY) => {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Only retry on timeout or network errors
      const shouldRetry = 
        error.code === 'ECONNABORTED' || 
        error.code === 'ENOTFOUND' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        (error.response && error.response.status >= 500);
      
      if (attempt < maxRetries && shouldRetry) {
        console.log(`[${new Date().toISOString()}] Retry attempt ${attempt}/${maxRetries} after ${retryDelay}ms...`);
        await delay(retryDelay);
      } else {
        break;
      }
    }
  }
  throw lastError;
};

// Validate URL on startup
if (COLAB_AI_SERVER_URL && !validateServerUrl(COLAB_AI_SERVER_URL)) {
  console.warn('[WARNING] COLAB_AI_SERVER_URL is invalid. The /api/edit endpoint may not work correctly.');
  console.warn('[WARNING] Please set a valid COLAB_AI_SERVER_URL in your .env file.');
}


// --- API ROUTES ---

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    colabServerUrl: COLAB_AI_SERVER_URL || null,
    colabServerConfigured: COLAB_AI_SERVER_URL ? validateServerUrl(COLAB_AI_SERVER_URL) : false
  });
});

// This is the route that was missing from your running server
app.post('/api/edit', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const imageFile = req.file;

  // Input validation
  if (!prompt || !imageFile) {
    return res.status(400).json({ 
      error: 'Prompt and image file are required',
      details: {
        promptProvided: !!prompt,
        imageProvided: !!imageFile
      }
    });
  }

  // Validate prompt length
  if (prompt.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Prompt cannot be empty'
    });
  }

  if (prompt.length > 1000) {
    return res.status(400).json({ 
      error: 'Prompt is too long (max 1000 characters)'
    });
  }

  // Validate AI server URL is configured
  if (!COLAB_AI_SERVER_URL) {
    return res.status(503).json({ 
      error: 'AI server URL is not configured',
      message: 'Please contact the administrator to set COLAB_AI_SERVER_URL in the server configuration',
      code: 'AI_SERVER_NOT_CONFIGURED'
    });
  }

  if (!validateServerUrl(COLAB_AI_SERVER_URL)) {
    return res.status(503).json({ 
      error: 'AI server is not configured properly',
      message: 'Please contact the administrator to configure the COLAB_AI_SERVER_URL',
      code: 'AI_SERVER_INVALID_URL'
    });
  }

  console.log(`[${new Date().toISOString()}] Forwarding request to Colab. Prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);
  console.log(`[${new Date().toISOString()}] Image: ${imageFile.originalname} (${imageFile.size} bytes)`);

  try {
    const result = await retryRequest(async () => {
      const form = new FormData();
      form.append('image', imageFile.buffer, { filename: imageFile.originalname });
      form.append('prompt', prompt);

      const response = await axios.post(COLAB_AI_SERVER_URL, form, {
        headers: { ...form.getHeaders() },
        responseType: 'arraybuffer',
        timeout: REQUEST_TIMEOUT,
        validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      });

      // Handle non-2xx responses
      if (response.status >= 400) {
        const errorText = Buffer.from(response.data).toString('utf-8');
        throw {
          response: {
            status: response.status,
            data: errorText
          }
        };
      }

      return response;
    });

    console.log(`[${new Date().toISOString()}] Successfully received edited image from Colab.`);
    res.set('Content-Type', 'image/jpeg');
    res.send(result.data);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error communicating with Colab:`, error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('The request to the AI server timed out.');
      return res.status(504).json({ 
        error: 'The AI server took too long to respond',
        message: 'The request timed out after multiple retries. Please try again with a simpler prompt or smaller image.',
        code: 'TIMEOUT'
      });
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('Could not connect to the AI server.');
      return res.status(503).json({ 
        error: 'Could not connect to the AI server',
        message: 'The AI server is not reachable. It may be offline or the URL may be incorrect.',
        code: 'CONNECTION_FAILED'
      });
    }

    if (error.response) {
      const status = error.response.status;
      let errorMessage = 'Failed to communicate with the AI server';
      
      try {
        const errorData = JSON.parse(error.response.data);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Not JSON, use default message
      }

      return res.status(status).json({ 
        error: errorMessage,
        message: `The AI server returned an error (Status: ${status})`,
        code: 'AI_SERVER_ERROR',
        status
      });
    }

    // Generic error
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      message: 'Please try again later or contact support if the problem persists.',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Handle multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image must be smaller than 10MB'
      });
    }
    return res.status(400).json({
      error: 'File upload error',
      message: error.message
    });
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files are allowed'
    });
  }

  next(error);
});


// --- SERVER START ---
app.listen(port, () => {
  console.log('='.repeat(60));
  console.log('MarketAIV3 Backend Server');
  console.log('='.repeat(60));
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`AI Server URL: ${COLAB_AI_SERVER_URL || 'NOT CONFIGURED'}`);
  console.log(`AI Server Status: ${COLAB_AI_SERVER_URL && validateServerUrl(COLAB_AI_SERVER_URL) ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
  console.log(`Request Timeout: ${REQUEST_TIMEOUT}ms`);
  console.log(`Max Retries: ${MAX_RETRIES}`);
  console.log(`Retry Delay: ${RETRY_DELAY}ms`);
  console.log('='.repeat(60));
  console.log(`Health Check: http://localhost:${port}/api/health`);
  console.log(`Edit Endpoint: http://localhost:${port}/api/edit`);
  console.log('='.repeat(60));
  if (!COLAB_AI_SERVER_URL) {
    console.warn('\n⚠️  WARNING: AI Server URL is NOT configured!');
    console.warn('Please set COLAB_AI_SERVER_URL in your .env file.');
    console.warn('The /api/edit endpoint will not work until this is configured.\n');
  } else if (!validateServerUrl(COLAB_AI_SERVER_URL)) {
    console.warn('\n⚠️  WARNING: AI Server URL is invalid!');
    console.warn('Please check COLAB_AI_SERVER_URL in your .env file.\n');
  }
});