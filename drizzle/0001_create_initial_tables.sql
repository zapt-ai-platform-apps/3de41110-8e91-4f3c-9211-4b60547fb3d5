CREATE TABLE IF NOT EXISTS "user_preferences" (
  "id" SERIAL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "notification_time" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "onboarding_responses" (
  "id" SERIAL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "responses" JSONB NOT NULL,
  "completed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "journal_entries" (
  "id" SERIAL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "reflections" TEXT,
  "intentions" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  UNIQUE ("user_id", "date")
);