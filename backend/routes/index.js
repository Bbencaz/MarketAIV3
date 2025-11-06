const express = require('express');
const router = express.Router();

// A simple home route for the API
router.get('/', (req, res) => {
  res.send('Hello from the MarketAI backend API!');
});

// You can add more specific routes here later. For example:
// router.get('/products', (req, res) => { ... });

module.exports = router;