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
const upload = multer({ storage: storage });

const COLAB_AI_SERVER_URL = 'https://marshiest-signe-unparried.ngrok-free.dev/edit';


// --- API ROUTES ---

// This is the route that was missing from your running server
app.post('/api/edit', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const imageFile = req.file;

  if (!prompt || !imageFile) {
    return res.status(400).send({ error: 'Prompt and image file are required' });
  }

  console.log(`[${new Date().toISOString()}] Forwarding request to Colab. Prompt: "${prompt}"`);

  try {
    const form = new FormData();
    form.append('image', imageFile.buffer, { filename: imageFile.originalname });
    form.append('prompt', prompt);

    const response = await axios.post(COLAB_AI_SERVER_URL, form, {
      headers: { ...form.getHeaders() },
      responseType: 'arraybuffer',
      timeout: 180000 
    });

    console.log(`[${new Date().toISOString()}] Successfully received edited image from Colab.`);
    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error communicating with Colab:`, error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('The request to the AI server timed out.');
      res.status(504).send({ error: 'The AI server took too long to respond. Please try again.' });
    } else {
      const status = error.response ? error.response.status : 500;
      res.status(status).send({ error: `Failed to communicate with the AI server. Status: ${status}` });
    }
  }
});


// --- SERVER START ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});