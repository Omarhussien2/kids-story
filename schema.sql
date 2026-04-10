-- SQL Schema for Khayal Masr
-- Copy and paste this into Supabase SQL Editor

-- Table: Stories
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    child_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    challenge_type TEXT,
    custom_challenge_text TEXT,
    content TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Payments
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    story_id INTEGER REFERENCES stories(id),
    screenshot_url TEXT,
    amount REAL DEFAULT 200.0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Samples
CREATE TABLE IF NOT EXISTS samples (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    file_url TEXT,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
