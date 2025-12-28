const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// profile
router.get("/me", auth, async (req, res) => {
  const r = await db.query(
    "SELECT id, full_name, phone9, has_access, course_type, region, district, created_at FROM users WHERE id=$1",
    [req.user.userId]
  );
  res.json({ user: r.rows[0] || null });
});

// modules list (only own course_type)
router.get("/modules", auth, async (req, res) => {
  const r = await db.query(
    "SELECT id, order_number, title FROM modules WHERE course_type=$1 ORDER BY order_number ASC",
    [req.user.courseType]
  );
  res.json({ modules: r.rows });
});

// module -> topics
router.get("/modules/:moduleId", auth, async (req, res) => {
  const { moduleId } = req.params;
  const m = await db.query("SELECT id, course_type, order_number, title FROM modules WHERE id=$1", [moduleId]);
  if (m.rowCount === 0) return res.status(404).json({ error: "NOT_FOUND" });
  if (m.rows[0].course_type !== req.user.courseType) return res.status(403).json({ error: "FORBIDDEN" });

  const t = await db.query(
    "SELECT id, order_number, title FROM topics WHERE module_id=$1 ORDER BY order_number ASC",
    [moduleId]
  );
  res.json({ module: m.rows[0], topics: t.rows });
});

// topic lecture + count
router.get("/topics/:topicId", auth, async (req, res) => {
  const { topicId } = req.params;

  const t = await db.query(
    `SELECT t.id, t.title, t.lecture_content, m.course_type, m.id as module_id
     FROM topics t
     JOIN modules m ON m.id = t.module_id
     WHERE t.id=$1`,
    [topicId]
  );
  if (t.rowCount === 0) return res.status(404).json({ error: "NOT_FOUND" });
  if (t.rows[0].course_type !== req.user.courseType) return res.status(403).json({ error: "FORBIDDEN" });

  res.json({ topic: t.rows[0] });
});

// start test (topic/module/final)
router.post("/tests/start", auth, async (req, res) => {
  // req.body: { type: "topic"|"module"|"final", topicId?, moduleId? }
  const { type, topicId, moduleId } = req.body || {};

  const user = await db.query("SELECT has_access, course_type FROM users WHERE id=$1", [req.user.userId]);
  if (user.rowCount === 0) return res.status(401).json({ error: "UNAUTHORIZED" });
  if (!user.rows[0].has_access) return res.status(403).json({ error: "NO_ACCESS" });

  let questions = [];
  let limit = 15;

  if (type === "topic") {
    limit = 15;
    const t = await db.query(
      `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
       FROM questions q
       JOIN topics t ON t.id = q.topic_id
       JOIN modules m ON m.id = t.module_id
       WHERE q.topic_id=$1 AND m.course_type=$2
       ORDER BY random()
       LIMIT $3`,
      [topicId, req.user.courseType, limit]
    );
    questions = t.rows;
  } else if (type === "module") {
    limit = 20;
    const t = await db.query(
      `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
       FROM questions q
       JOIN topics t ON t.id = q.topic_id
       JOIN modules m ON m.id = t.module_id
       WHERE m.id=$1 AND m.course_type=$2
       ORDER BY random()
       LIMIT $3`,
      [moduleId, req.user.courseType, limit]
    );
    questions = t.rows;
  } else if (type === "final") {
    limit = 30;
    const t = await db.query(
      `SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d
       FROM questions q
       JOIN topics t ON t.id = q.topic_id
       JOIN modules m ON m.id = t.module_id
       WHERE m.course_type=$1
       ORDER BY random()
       LIMIT $2`,
      [req.user.courseType, limit]
    );
    questions = t.rows;
  } else {
    return res.status(400).json({ error: "BAD_TYPE" });
  }

  res.json({ questions, limit });
});

// submit test results
router.post("/tests/submit", auth, async (req, res) => {
  // req.body: { type, moduleId?, topicId?, answers: [{questionId, chosen:"a"|"b"|"c"|"d"}] }
  const { type, moduleId = null, topicId = null, answers = [] } = req.body || {};

  const user = await db.query("SELECT has_access, course_type FROM users WHERE id=$1", [req.user.userId]);
  if (user.rowCount === 0) return res.status(401).json({ error: "UNAUTHORIZED" });
  if (!user.rows[0].has_access) return res.status(403).json({ error: "NO_ACCESS" });

  const ids = answers.map((x) => x.questionId);
  if (ids.length === 0) return res.status(400).json({ error: "NO_ANSWERS" });

  const correctRows = await db.query(
    `SELECT id, correct_option FROM questions WHERE id = ANY($1::uuid[])`,
    [ids]
  );

  const correctMap = new Map(correctRows.rows.map((r) => [r.id, r.correct_option]));
  let correctCount = 0;

  for (const a of answers) {
    const c = correctMap.get(a.questionId);
    if (c && a.chosen === c) correctCount++;
  }

  const total = answers.length;
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= 70;

  const attemptId = cryptoUUID();
  await db.query(
    `INSERT INTO attempts (id, user_id, test_type, module_id, topic_id, score, passed, total_questions, correct_count)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [attemptId, req.user.userId, type, moduleId, topicId, score, passed, total, correctCount]
  );

  res.json({ score, passed, total, correctCount });
});

function cryptoUUID() {
  return require("crypto").randomUUID();
}

module.exports = router;
