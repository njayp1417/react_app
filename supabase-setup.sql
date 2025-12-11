-- Supabase Database Setup for Nelson & Juliana Love App
-- Run these commands in your Supabase SQL Editor

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  sender_id TEXT NOT NULL CHECK (sender_id IN ('nelson', 'juliana')),
  receiver_id TEXT NOT NULL CHECK (receiver_id IN ('nelson', 'juliana')),
  message_status TEXT DEFAULT 'sent' CHECK (message_status IN ('sent', 'delivered', 'read')),
  image_url TEXT,
  audio_url TEXT,

  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create typing status table
CREATE TABLE IF NOT EXISTS typing_status (
  user_id TEXT PRIMARY KEY CHECK (user_id IN ('nelson', 'juliana')),
  is_typing BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user status table
CREATE TABLE IF NOT EXISTS user_status (
  user_id TEXT PRIMARY KEY CHECK (user_id IN ('nelson', 'juliana')),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create game state table for turn-based Truth or Dare
CREATE TABLE IF NOT EXISTS game_state (
  id SERIAL PRIMARY KEY,
  current_turn TEXT CHECK (current_turn IN ('nelson', 'juliana')),
  waiting_for_answer BOOLEAN DEFAULT FALSE,
  last_question_id BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create photos table for gallery
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  uploaded_by TEXT CHECK (uploaded_by IN ('nelson', 'juliana')),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial typing status
INSERT INTO typing_status (user_id, is_typing) VALUES 
('nelson', FALSE),
('juliana', FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- Insert initial user status
INSERT INTO user_status (user_id, is_online) VALUES 
('nelson', FALSE),
('juliana', FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- Insert initial game state
INSERT INTO game_state (current_turn, waiting_for_answer) VALUES ('nelson', FALSE)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies for messages (both users can read/write)
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their messages" ON messages FOR UPDATE USING (true);

-- Create policies for typing status
CREATE POLICY "Users can view typing status" ON typing_status FOR SELECT USING (true);
CREATE POLICY "Users can update typing status" ON typing_status FOR ALL USING (true);

-- Create policies for user status
CREATE POLICY "Users can view user status" ON user_status FOR SELECT USING (true);
CREATE POLICY "Users can update user status" ON user_status FOR ALL USING (true);

-- Create policies for game state
CREATE POLICY "Users can view game state" ON game_state FOR SELECT USING (true);
CREATE POLICY "Users can update game state" ON game_state FOR ALL USING (true);

-- Create policies for photos
CREATE POLICY "Users can view all photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Users can insert photos" ON photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update photos" ON photos FOR UPDATE USING (true);

-- Create storage bucket for photos/media (skip if already exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Users can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Users can update photos" ON storage.objects FOR UPDATE USING (bucket_id = 'photos');

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE typing_status;
ALTER PUBLICATION supabase_realtime ADD TABLE user_status;
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;