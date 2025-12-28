const express = require('express');
const { getDb } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
const d = getDb();

router.get('/topics', (req, res) => {
  const topics = d.prepare('SELECT id, name FROM topics ORDER BY name ASC').all();
  return res.json({ topics });
});

router.get('/quiz', authRequired, (req, res) => {
  const topicId = Number(req.query.topicId);
  if (!Number.isFinite(topicId)) return res.status(400).json({ error: 'topicId required' });

  const topic = d.prepare('SELECT id, name FROM topics WHERE id = ?').get(topicId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const questions = d.prepare('SELECT id, question, optionsJson FROM questions WHERE topicId = ?').all(topicId);
  if (!questions.length) return res.status(404).json({ error: 'No questions for this topic' });

  // shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = questions[i]; questions[i] = questions[j]; questions[j] = tmp;
  }
  const selected = questions.slice(0, 20).map(q => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.optionsJson)
  }));

  return res.json({ topic, questions: selected });
});

router.post('/submit', authRequired, (req, res) => {
  const { topicId, answers } = req.body || {};
  const tId = Number(topicId);
  if (!Number.isFinite(tId)) return res.status(400).json({ error: 'topicId required' });
  if (!Array.isArray(answers) || answers.length === 0) return res.status(400).json({ error: 'answers[] required' });

  const topic = d.prepare('SELECT id, name FROM topics WHERE id = ?').get(tId);
  if (!topic) return res.status(404).json({ error: 'Topic not found' });

  const qStmt = d.prepare('SELECT id, correctIndex FROM questions WHERE id = ? AND topicId = ?');

  let score = 0;
  const evaluated = [];

  for (const a of answers) {
    const qId = Number(a.questionId);
    const chosen = Number(a.chosenIndex);
    if (!Number.isFinite(qId) || !Number.isFinite(chosen)) continue;

    const q = qStmt.get(qId, tId);
    if (!q) continue;

    const correct = q.correctIndex;
    const isCorrect = (chosen === correct) ? 1 : 0;
    if (isCorrect) score += 1;

    evaluated.push({
      questionId: qId,
      chosenIndex: chosen,
      correctIndex: correct,
      isCorrect: !!isCorrect
    });
  }

  const total = evaluated.length;

  const attemptInfo = d.prepare('INSERT INTO attempts (userId, topicId, score, total, createdAt) VALUES (?, ?, ?, ?, ?)').run(
    req.user.userId,
    tId,
    score,
    total,
    new Date().toISOString()
  );

  const insertAns = d.prepare('INSERT INTO attempt_answers (attemptId, questionId, chosenIndex, correctIndex, isCorrect) VALUES (?, ?, ?, ?, ?)');
  const tx = d.transaction((rows) => {
    for (const row of rows) {
      insertAns.run(attemptInfo.lastInsertRowid, row.questionId, row.chosenIndex, row.correctIndex, row.isCorrect ? 1 : 0);
    }
  });
  tx(evaluated);

  return res.json({
    topic,
    score,
    total,
    attemptId: attemptInfo.lastInsertRowid,
    answers: evaluated
  });
});

router.get('/history', authRequired, (req, res) => {
  const rows = d.prepare(`
    SELECT a.id, a.score, a.total, a.createdAt, t.name as topicName
    FROM attempts a
    JOIN topics t ON t.id = a.topicId
    WHERE a.userId = ?
    ORDER BY a.createdAt DESC
    LIMIT 20
  `).all(req.user.userId);

  return res.json({ attempts: rows });
});

module.exports = router;