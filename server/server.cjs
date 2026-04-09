const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'database.json');

// Helper to ensure db logic works smoothly without breaking if corrupted
const getDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { accounts: [{ username: "admin", password: "password", role: "admin" }], employees: [] };
  }
};

const saveDB = (dbState) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
};

app.get('/api/accounts', (req, res) => {
  res.json(getDB().accounts);
});

app.post('/api/accounts', (req, res) => {
  const accounts = req.body;
  const db = getDB();
  db.accounts = accounts;
  saveDB(db);
  res.json({ success: true });
});

app.get('/api/employees', (req, res) => {
  res.json(getDB().employees);
});

app.post('/api/employees', (req, res) => {
  const employees = req.body;
  const db = getDB();
  db.employees = employees;
  saveDB(db);
  res.json({ success: true });
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`☁ Cloud API and Web Server running on port ${PORT}`);
});
