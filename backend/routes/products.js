// routes/products.js — one handler per CRUD operation.
const express = require('express');
const db = require('../db');

const router = express.Router();

// Prepared statements: SQL is written once, values are passed separately via "?".
// This is what protects you from SQL injection.
const selectAll   = db.prepare('SELECT * FROM products ORDER BY id');
const selectOne   = db.prepare('SELECT * FROM products WHERE id = ?');
const insertOne   = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
const updateOne   = db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ?');
const deleteOne   = db.prepare('DELETE FROM products WHERE id = ?');

// Check the incoming JSON before it reaches the database.
// Returns an error message, or null if everything is fine.
function validate(body) {
  if (typeof body.name !== 'string' || body.name.trim() === '') {
    return 'name is required and must be a non-empty string';
  }
  if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
    return 'price is required and must be a number >= 0';
  }
  return null;
}

// READ (all)  ->  GET /api/products
router.get('/', (req, res) => {
  res.json(selectAll.all());
});

// READ (one)  ->  GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = selectOne.get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// CREATE      ->  POST /api/products
router.post('/', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const info = insertOne.run(req.body.name.trim(), req.body.price);
  const created = selectOne.get(info.lastInsertRowid);
  res.status(201).json(created);
});

// UPDATE      ->  PUT /api/products/:id
router.put('/:id', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const info = updateOne.run(req.body.name.trim(), req.body.price, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json(selectOne.get(req.params.id));
});

// DELETE      ->  DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const info = deleteOne.run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.status(204).end(); // 204 = success, nothing to send back
});

module.exports = router;
