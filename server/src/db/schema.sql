CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  coins         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adds coins to existing users tables created before this column existed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS coins INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS plants (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  stage      INTEGER NOT NULL DEFAULT 0,
  points     INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sold_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id),
  plant_id         INTEGER NOT NULL REFERENCES plants(id),
  duration_minutes INTEGER NOT NULL,
  points_earned    INTEGER NOT NULL,
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS decoration_types (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  cost      INTEGER NOT NULL,
  asset_key TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_decorations (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id),
  decoration_type_id INTEGER NOT NULL REFERENCES decoration_types(id),
  pos_x              REAL,
  pos_y              REAL,
  purchased_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
