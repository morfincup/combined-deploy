const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
const d = getDb();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = d.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = bcrypt.hashSync(password, 10);
  const info = d.prepare('INSERT INTO users (name, email, passwordHash, premium, createdAt) VALUES (?, ?, ?, 0, ?)').run(
    name,
    email,
    passwordHash,
    new Date().toISOString()
  );

  const token = jwt.sign({ userId: info.lastInsertRowid, role: 'user' }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
  return res.json({ token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email, password required' });

  const user = d.prepare('SELECT id, passwordHash FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, role: 'user' }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
  return res.json({ token });
});

router.get('/me', authRequired, (req, res) => {
  const u = d.prepare('SELECT id, name, email, premium, createdAt FROM users WHERE id = ?').get(req.user.userId);
  if (!u) return res.status(404).json({ error: 'User not found' });
  return res.json({ user: u });
});

module.exports = router;