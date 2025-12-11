-- ===========================================================
--  SUPABASE VAULT SETUP FOR ENCRYPTION KEYS
-- ===========================================================

-- Create vault table for secure key storage
CREATE TABLE IF NOT EXISTS vault (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  secret TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert encryption key (run this ONCE in Supabase SQL editor)
INSERT INTO vault (name, secret) 
VALUES ('encryption_key', 'N1507J2102Since22072020Love32Bit!')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS for security
ALTER TABLE vault ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read vault
CREATE POLICY "vault_select" ON vault
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: No one can insert/update vault via client (admin only)
CREATE POLICY "vault_no_insert" ON vault
FOR INSERT WITH CHECK (false);

CREATE POLICY "vault_no_update" ON vault
FOR UPDATE USING (false);

CREATE POLICY "vault_no_delete" ON vault
FOR DELETE USING (false);

-- ===========================================================
-- INSTRUCTIONS:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Your encryption key is now stored securely in Supabase
-- 3. The app will automatically fetch it from vault
-- 4. Fallback to environment variable if vault unavailable
-- ===========================================================