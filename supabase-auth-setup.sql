-- ===========================================================
--  SUPABASE AUTHENTICATION SETUP
-- ===========================================================

-- Enable email confirmations (optional - set to false for development)
-- This can be configured in Supabase Dashboard > Authentication > Settings

-- Create user profiles table (optional - for additional user data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_type TEXT CHECK (user_type IN ('nelson', 'juliana')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "user_profiles_select" ON user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, user_type, name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'user_type',
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================================
-- INSTRUCTIONS:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Go to Authentication > Settings in Supabase Dashboard
-- 3. Set "Enable email confirmations" to OFF for development
-- 4. Your app now uses real Supabase authentication!
-- ===========================================================