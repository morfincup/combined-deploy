require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { initDb, seedIfEmpty } = require('./db');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const testsRoutes = require('./routes/tests');

const app = express();

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: false
}));
app.use(express.json({ limit: '1mb' }));

// Initialize DB & seed data
initDb();
seedIfEmpty();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testsRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});