const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const { adminRequired } = require('../middleware/auth');

const router = express.Router();
const d = getDb();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username, password required' });

  const admin = d.prepare('SELECT id, passwordHash FROM admin_users WHERE username = ?').get(username);
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = bcrypt.compareSync(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin.id, role: 'admin' }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
  return res.json({ token });
});

router.get('/users', adminRequired, (req, res) => {
  const users = d.prepare('SELECT id, name, email, premium, createdAt FROM users ORDER BY createdAt DESC').all();
  return res.json({ users });
});

router.patch('/users/:id/premium', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  const { premium } = req.body || {};
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid user id' });
  const p = premium ? 1 : 0;

  const existing = d.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'User not found' });

  d.prepare('UPDATE users SET premium = ? WHERE id = ?').run(p, id);
  const user = d.prepare('SELECT id, name, email, premium, createdAt FROM users WHERE id = ?').get(id);
  return res.json({ user });
});

module.exports = router;