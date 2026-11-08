// server.js — starts the web server and wires everything together.
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());          // lets the React app (another port) call this API
app.use(express.json());  // turns incoming JSON bodies into req.body

// Every route in products.js is mounted under /api/products
app.use('/api/products', productsRouter);

// Catch-all for URLs that don't exist
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Catch-all for malformed JSON and unexpected errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
