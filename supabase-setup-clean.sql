-- ===========================================================
--  TABLES FOR NELSON & JULIANA LOVE APP ❤️
-- ===========================================================

-- =======================
-- MESSAGES TABLE
-- =======================
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  text TEXT,
  sender_id TEXT NOT NULL CHECK (sender_id IN ('nelson', 'juliana')),
  receiver_id TEXT NOT NULL CHECK (receiver_id IN ('nelson', 'juliana')),
  message_status TEXT DEFAULT 'sent' CHECK (message_status IN ('sent', 'delivered', 'read')),
  image_url TEXT,
  audio_url TEXT,
  reactions JSONB DEFAULT '{}'::jsonb CHECK (jsonb_typeof(reactions) = 'object'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- TYPING STATUS
-- =======================
CREATE TABLE IF NOT EXISTS typing_status (
  user_id TEXT PRIMARY KEY CHECK (user_id IN ('nelson', 'juliana')),
  is_typing BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- USER STATUS (online/last_seen)
-- =======================
CREATE TABLE IF NOT EXISTS user_status (
  user_id TEXT PRIMARY KEY CHECK (user_id IN ('nelson', 'juliana')),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- GAME STATE (Truth or Dare)
-- =======================
CREATE TABLE IF NOT EXISTS game_state (
  id SERIAL PRIMARY KEY,
  current_turn TEXT CHECK (current_turn IN ('nelson', 'juliana')),
  waiting_for_answer BOOLEAN DEFAULT FALSE,
  last_question_id BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- PHOTOS (Gallery)
-- =======================
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  uploaded_by TEXT CHECK (uploaded_by IN ('nelson', 'juliana')),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================================
-- INITIAL DEFAULT ROWS
-- ===========================================================

INSERT INTO typing_status (user_id, is_typing) VALUES
('nelson', FALSE),
('juliana', FALSE)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO user_status (user_id, is_online) VALUES
('nelson', FALSE),
('juliana', FALSE)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO game_state (current_turn, waiting_for_answer)
VALUES ('nelson', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ===========================================================
-- ENABLE RLS (security required before policies)
-- ===========================================================

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- ===========================================================
-- GOOGLE OAUTH AUTHORIZED USERS
-- (Users will be created automatically when they sign in with Google)
-- ===========================================================

-- ===========================================================
-- SERVER-SIDE SECURITY FUNCTION
-- ===========================================================

-- Create bulletproof function to validate authorized emails
CREATE OR REPLACE FUNCTION is_authorized_email()
RETURNS BOOLEAN AS $$
DECLARE
  valid BOOLEAN;
BEGIN
  SELECT TRUE INTO valid
  FROM auth.users
  WHERE LOWER(email) IN (
    'nelsonasagwara81@gmail.com',
    'oluwanifemiojo88@gmail.com'
  )
  AND id = auth.uid();
  
  RETURN COALESCE(valid, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================================
-- SECURE POLICIES (Only authorized emails can access)
-- ===========================================================

-- Drop ALL existing policies if they exist
DROP POLICY IF EXISTS "messages_select" ON messages;
DROP POLICY IF EXISTS "messages_insert" ON messages;
DROP POLICY IF EXISTS "messages_update" ON messages;
DROP POLICY IF EXISTS "typing_select" ON typing_status;
DROP POLICY IF EXISTS "typing_update" ON typing_status;
DROP POLICY IF EXISTS "status_select" ON user_status;
DROP POLICY IF EXISTS "status_update" ON user_status;
DROP POLICY IF EXISTS "game_select" ON game_state;
DROP POLICY IF EXISTS "game_update" ON game_state;
DROP POLICY IF EXISTS "photos_select" ON photos;
DROP POLICY IF EXISTS "photos_insert" ON photos;
DROP POLICY IF EXISTS "photos_update" ON photos;
DROP POLICY IF EXISTS "secure_messages" ON messages;
DROP POLICY IF EXISTS "secure_typing" ON typing_status;
DROP POLICY IF EXISTS "secure_status" ON user_status;
DROP POLICY IF EXISTS "secure_game" ON game_state;
DROP POLICY IF EXISTS "secure_photos" ON photos;

-- Create new secure policies
CREATE POLICY "secure_messages" ON messages FOR ALL USING (is_authorized_email());
CREATE POLICY "secure_typing" ON typing_status FOR ALL USING (is_authorized_email());
CREATE POLICY "secure_status" ON user_status FOR ALL USING (is_authorized_email());
CREATE POLICY "secure_game" ON game_state FOR ALL USING (is_authorized_email());
CREATE POLICY "secure_photos" ON photos FOR ALL USING (is_authorized_email());

-- ===========================================================
-- STORAGE (Bucket for Images)
-- ===========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Secure storage policies
DROP POLICY IF EXISTS "photos_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "photos_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "photos_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "secure_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "secure_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "secure_storage_update" ON storage.objects;

CREATE POLICY "secure_storage_insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos' AND is_authorized_email());

CREATE POLICY "secure_storage_select" ON storage.objects
FOR SELECT USING (bucket_id = 'photos' AND is_authorized_email());

CREATE POLICY "secure_storage_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'photos' AND is_authorized_email());

-- ===========================================================
-- REALTIME ENABLE FOR ALL TABLES (skip if already added)
-- ===========================================================

DO $$
BEGIN
  -- Add tables to realtime publication if not already added
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'typing_status') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE typing_status;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_status') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'game_state') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_state;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'photos') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE photos;
  END IF;
END $$;