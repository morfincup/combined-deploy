const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// USERS list
router.get("/users", auth, adminOnly, async (req, res) => {
  const r = await db.query(
    "SELECT id, full_name, phone9, has_access, course_type, region, district, created_at FROM users WHERE role='student' ORDER BY created_at DESC"
  );
  res.json({ users: r.rows });
});

// Toggle access
router.post("/users/:id/toggle-access", auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  const r = await db.query("UPDATE users SET has_access = NOT has_access WHERE id=$1 RETURNING id, has_access", [id]);
  if (r.rowCount === 0) return res.status(404).json({ error: "NOT_FOUND" });
  res.json({ user: r.rows[0] });
});

// BILLING activation create (and open access)
router.post("/billing/activate", auth, adminOnly, async (req, res) => {
  const { userId, amount = 0, notes = "" } = req.body || {};
  const aid = cryptoUUID();

  await db.query(
    "INSERT INTO activations (id, user_id, amount, notes) VALUES ($1,$2,$3,$4)",
    [aid, userId, amount, notes]
  );
  await db.query("UPDATE users SET has_access=TRUE WHERE id=$1", [userId]);

  res.json({ ok: true, activationId: aid });
});

// BILLING list
router.get("/billing", auth, adminOnly, async (req, res) => {
  const r = await db.query(
    `SELECT a.id, a.user_id, a.amount, a.notes, a.activated_at, u.full_name, u.phone9
     FROM activations a
     JOIN users u ON u.id = a.user_id
     ORDER BY a.activated_at DESC`
  );
  res.json({ activations: r.rows });
});

// CONTENT: modules
router.get("/modules", auth, adminOnly, async (req, res) => {
  const { courseType } = req.query;
  const r = await db.query(
    "SELECT id, course_type, order_number, title FROM modules WHERE course_type=$1 ORDER BY order_number ASC",
    [courseType]
  );
  res.json({ modules: r.rows });
});

router.post("/modules", auth, adminOnly, async (req, res) => {
  const { courseType, orderNumber, title } = req.body || {};
  const id = cryptoUUID();
  await db.query(
    "INSERT INTO modules (id, course_type, order_number, title) VALUES ($1,$2,$3,$4)",
    [id, courseType, orderNumber, title]
  );
  res.json({ id });
});

router.delete("/modules/:id", auth, adminOnly, async (req, res) => {
  await db.query("DELETE FROM modules WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});

// CONTENT: topics
router.get("/modules/:moduleId/topics", auth, adminOnly, async (req, res) => {
  const r = await db.query(
    "SELECT id, order_number, title, lecture_content FROM topics WHERE module_id=$1 ORDER BY order_number ASC",
    [req.params.moduleId]
  );
  res.json({ topics: r.rows });
});

router.post("/topics", auth, adminOnly, async (req, res) => {
  const { moduleId, orderNumber, title, lectureContent = "" } = req.body || {};
  const id = cryptoUUID();
  await db.query(
    "INSERT INTO topics (id, module_id, order_number, title, lecture_content) VALUES ($1,$2,$3,$4,$5)",
    [id, moduleId, orderNumber, title, lectureContent]
  );
  res.json({ id });
});

router.put("/topics/:id", auth, adminOnly, async (req, res) => {
  const { title, lectureContent } = req.body || {};
  await db.query(
    "UPDATE topics SET title=$1, lecture_content=$2 WHERE id=$3",
    [title, lectureContent, req.params.id]
  );
  res.json({ ok: true });
});

router.delete("/topics/:id", auth, adminOnly, async (req, res) => {
  await db.query("DELETE FROM topics WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});

// QUESTIONS: import row style
// body: { topicId, rows: [{q,a,b,c,d,correct}] }
router.post("/questions/import", auth, adminOnly, async (req, res) => {
  const { topicId, rows = [] } = req.body || {};
  let inserted = 0;

  for (const r of rows) {
    if (!r?.q || !r?.a || !r?.b || !r?.c || !r?.d) continue;
    if (!["a","b","c","d"].includes((r.correct || "").toLowerCase())) continue;

    const id = cryptoUUID();
    await db.query(
      `INSERT INTO questions (id, topic_id, question_text, option_a, option_b, option_c, option_d, correct_option)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, topicId, r.q, r.a, r.b, r.c, r.d, r.correct.toLowerCase()]
    );
    inserted++;
  }

  res.json({ inserted });
});

function cryptoUUID() {
  return require("crypto").randomUUID();
}

module.exports = router;
