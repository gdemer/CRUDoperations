// db.js — opens (or creates) the SQLite database file and makes sure the table exists.
const Database = require('better-sqlite3');
const path = require('path');

// The whole database lives in ONE file next to this script.
// SQLITE_FILE lets tests use a different file without touching real data.
const dbFile = process.env.SQLITE_FILE || path.join(__dirname, 'products.db');
const db = new Database(dbFile);

// "IF NOT EXISTS" makes this safe to run every time the server starts.
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT    NOT NULL,
    price REAL    NOT NULL CHECK (price >= 0)
  )
`);

module.exports = db;
