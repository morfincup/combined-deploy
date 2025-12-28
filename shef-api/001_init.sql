-- ENUM types (PostgreSQL uchun)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE course_type AS ENUM ('maktab', 'mtm');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE test_type AS ENUM ('topic', 'module', 'final');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE correct_opt AS ENUM ('a', 'b', 'c', 'd');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  phone9 VARCHAR(9) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  has_access BOOLEAN NOT NULL DEFAULT FALSE,
  course_type course_type NOT NULL,
  region VARCHAR(120),
  district VARCHAR(120),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- MODULES
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY,
  course_type course_type NOT NULL,
  order_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(course_type, order_number)
);

-- TOPICS (mavzular)
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  order_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  lecture_content TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(module_id, order_number)
);

-- QUESTIONS (har bir mavzuga bog'laymiz)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a VARCHAR(500) NOT NULL,
  option_b VARCHAR(500) NOT NULL,
  option_c VARCHAR(500) NOT NULL,
  option_d VARCHAR(500) NOT NULL,
  correct_option correct_opt NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ATTEMPTS
CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_type test_type NOT NULL,
  module_id UUID NULL REFERENCES modules(id) ON DELETE SET NULL,
  topic_id UUID NULL REFERENCES topics(id) ON DELETE SET NULL,
  score INT NOT NULL,
  passed BOOLEAN NOT NULL,
  total_questions INT NOT NULL,
  correct_count INT NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ACTIVATIONS (billing)
CREATE TABLE IF NOT EXISTS activations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activated_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  activated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_topics_module ON topics(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_users_course ON users(course_type);
