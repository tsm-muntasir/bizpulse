const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const app = express();
const SECRET = 'your_jwt_secret'; // Change this in production!

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const db = new Database('bizpulse.db');
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT
);
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY,
  revenue INTEGER,
  activeUsers INTEGER
);
`);

// Seed a demo user
try {
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', 'password');
} catch {}

// Seed analytics data if not present
const row = db.prepare('SELECT COUNT(*) as count FROM analytics').get();
if (row.count === 0) {
  db.prepare('INSERT INTO analytics (revenue, activeUsers) VALUES (?, ?)').run(42000, 1572);
}

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // In production, hash passwords!
  const token = jwt.sign({ username: user.username, id: user.id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected analytics route
app.get('/api/analytics', authenticateToken, (req, res) => {
  const data = db.prepare('SELECT revenue, activeUsers FROM analytics ORDER BY id DESC LIMIT 1').get();
  res.json(data);
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BizPulse backend running on port ${PORT}`);
});