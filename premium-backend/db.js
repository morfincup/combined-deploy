const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite');
let db;

function getDb() {
  if (!db) db = new Database(DB_PATH);
  return db;
}

function initDb() {
  const d = getDb();
  d.pragma('journal_mode = WAL');

  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      premium INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topicId INTEGER NOT NULL,
      question TEXT NOT NULL,
      optionsJson TEXT NOT NULL,
      correctIndex INTEGER NOT NULL,
      FOREIGN KEY(topicId) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      topicId INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(topicId) REFERENCES topics(id)
    );

    CREATE TABLE IF NOT EXISTS attempt_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attemptId INTEGER NOT NULL,
      questionId INTEGER NOT NULL,
      chosenIndex INTEGER NOT NULL,
      correctIndex INTEGER NOT NULL,
      isCorrect INTEGER NOT NULL,
      FOREIGN KEY(attemptId) REFERENCES attempts(id),
      FOREIGN KEY(questionId) REFERENCES questions(id)
    );
  `);
}

function seedIfEmpty() {
  const d = getDb();

  // Seed admin
  const adminCount = d.prepare('SELECT COUNT(*) AS c FROM admin_users').get().c;
  if (adminCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = bcrypt.hashSync(password, 10);
    d.prepare('INSERT INTO admin_users (username, passwordHash, createdAt) VALUES (?, ?, ?)').run(
      username,
      passwordHash,
      new Date().toISOString()
    );
    console.log(`Seeded admin user -> username: ${username} password: ${password}`);
  }

  // Seed topics & questions
  const topicCount = d.prepare('SELECT COUNT(*) AS c FROM topics').get().c;
  const questionCount = d.prepare('SELECT COUNT(*) AS c FROM questions').get().c;

  if (topicCount === 0 && questionCount === 0) {
    const topics = ['JavaScript Basics', 'Node.js & Express', 'Databases'];
    const insertTopic = d.prepare('INSERT INTO topics (name) VALUES (?)');
    const topicIds = {};
    for (const t of topics) {
      const info = insertTopic.run(t);
      topicIds[t] = info.lastInsertRowid;
    }

    const insertQ = d.prepare('INSERT INTO questions (topicId, question, optionsJson, correctIndex) VALUES (?, ?, ?, ?)');
    const add = (topic, q, opts, correct) => {
      insertQ.run(topicIds[topic], q, JSON.stringify(opts), correct);
    };

    // JS Basics (10)
    add('JavaScript Basics', 'Which keyword declares a block-scoped variable?', ['var', 'let', 'function', 'constantly'], 1);
    add('JavaScript Basics', 'What is the result of typeof null?', ['null', 'object', 'undefined', 'number'], 1);
    add('JavaScript Basics', 'Which method converts JSON string to object?', ['JSON.parse()', 'JSON.stringify()', 'toJSON()', 'parseJSON()'], 0);
    add('JavaScript Basics', 'Which operator checks both value and type equality?', ['==', '=', '===', '=>'], 2);
    add('JavaScript Basics', 'Which Array method adds to the end?', ['shift', 'pop', 'push', 'unshift'], 2);
    add('JavaScript Basics', 'Promise represents:', ['Immediate value', 'Future completion/failure', 'A loop', 'A class'], 1);
    add('JavaScript Basics', 'What does NaN stand for?', ['Not a Number', 'New and Nice', 'Node and NPM', 'Name as Number'], 0);
    add('JavaScript Basics', 'Which statement handles exceptions?', ['try/catch', 'if/else', 'switch', 'throw/case'], 0);
    add('JavaScript Basics', 'Which creates a copy of an array?', ['arr.copy()', '[...arr]', 'arr.clone()', 'arr = arr'], 1);
    add('JavaScript Basics', 'Which is NOT a primitive type?', ['string', 'boolean', 'object', 'number'], 2);

    // Node & Express (10)
    add('Node.js & Express', 'Express is primarily used to:', ['Build desktop apps', 'Build web servers/APIs', 'Edit images', 'Compile C++'], 1);
    add('Node.js & Express', 'Which middleware parses JSON bodies?', ['express.json()', 'express.static()', 'express.router()', 'express.parse()'], 0);
    add('Node.js & Express', 'What does req.params contain?', ['Query string', 'Route parameters', 'Request body', 'Headers only'], 1);
    add('Node.js & Express', 'What does npm stand for?', ['Node Package Manager', 'New Project Module', 'Network Protocol Manager', 'Node Program Maker'], 0);
    add('Node.js & Express', 'A common pattern for auth tokens is:', ['JWT', 'CSV', 'PNG', 'HTML'], 0);
    add('Node.js & Express', 'Which status code means Unauthorized?', ['200', '301', '401', '500'], 2);
    add('Node.js & Express', 'Which method defines a GET route?', ['app.post()', 'app.get()', 'app.put()', 'app.route()'], 1);
    add('Node.js & Express', 'CORS is about:', ['Database schema', 'Cross-origin requests', 'CPU optimization', 'File compression'], 1);
    add('Node.js & Express', 'Environment variables are commonly loaded with:', ['dotenv', 'helmet', 'cors', 'bcrypt'], 0);
    add('Node.js & Express', 'In Node.js, fs module is for:', ['Networking', 'File system', 'Cryptography only', 'Math'], 1);

    // Databases (10)
    add('Databases', 'SQL stands for:', ['Structured Query Language', 'Simple Query List', 'Standard Question Logic', 'System Query Link'], 0);
    add('Databases', 'A primary key:', ['Must be NULL', 'Uniquely identifies a row', 'Is always text', 'Is optional'], 1);
    add('Databases', 'Which is a relational database?', ['SQLite', 'Redis', 'MongoDB', 'Elastic'], 0);
    add('Databases', 'Normalization helps to:', ['Increase duplication', 'Reduce redundancy', 'Encrypt data', 'Speed up internet'], 1);
    add('Databases', 'An index generally:', ['Slows reads', 'Speeds up reads', 'Deletes data', 'Renames tables'], 1);
    add('Databases', 'A foreign key:', ['Links to another table', 'Encrypts a column', 'Is a password', 'Is a file'], 0);
    add('Databases', 'ACID property "A" is:', ['Atomicity', 'Accuracy', 'Availability', 'Anonymity'], 0);
    add('Databases', 'In SQL, WHERE is used to:', ['Group rows', 'Filter rows', 'Sort rows', 'Create tables'], 1);
    add('Databases', 'A transaction is:', ['A backup', 'A unit of work', 'A table', 'A user'], 1);
    add('Databases', 'Which command creates a table?', ['SELECT', 'UPDATE', 'CREATE TABLE', 'INSERT'], 2);

    console.log('Seeded topics/questions.');
  }
}

module.exports = { getDb, initDb, seedIfEmpty };