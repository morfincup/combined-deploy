const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const db = require("../db");

const router = express.Router();

const RegisterSchema = z.object({
  fullName: z.string().min(3),
  phone9: z.string().regex(/^\d{9}$/),
  password: z.string().min(4),
  courseType: z.enum(["maktab", "mtm"]),
  region: z.string().min(2),
  district: z.string().min(2),
});

const LoginSchema = z.object({
  phone9: z.string().regex(/^\d{9}$/),
  password: z.string().min(1),
});

// STUDENT REGISTER
router.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { fullName, phone9, password, courseType, region, district } = parsed.data;

  const exists = await db.query("SELECT id FROM users WHERE phone9=$1", [phone9]);
  if (exists.rowCount > 0) return res.status(409).json({ error: "PHONE_EXISTS" });

  const passwordHash = await bcrypt.hash(password, 10);

  const id = cryptoUUID();
  await db.query(
    `INSERT INTO users (id, full_name, phone9, password_hash, role, has_access, course_type, region, district)
     VALUES ($1,$2,$3,$4,'student',FALSE,$5,$6,$7)`,
    [id, fullName, phone9, passwordHash, courseType, region, district]
  );

  const token = jwt.sign({ userId: id, role: "student", courseType }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// STUDENT LOGIN
router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { phone9, password } = parsed.data;

  const r = await db.query(
    "SELECT id, password_hash, role, course_type FROM users WHERE phone9=$1",
    [phone9]
  );
  if (r.rowCount === 0) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const u = r.rows[0];
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const token = jwt.sign(
    { userId: u.id, role: u.role, courseType: u.course_type },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({ token });
});

// ADMIN LOGIN (bootstrap)
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body || {};
  if (username !== process.env.ADMIN_BOOTSTRAP_USERNAME || password !== process.env.ADMIN_BOOTSTRAP_PASSWORD) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }
  const token = jwt.sign({ userId: "admin", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2d" });
  res.json({ token });
});

function cryptoUUID() {
  return require("crypto").randomUUID();
}

module.exports = router;
