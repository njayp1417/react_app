-- Add game state table to track turns
CREATE TABLE IF NOT EXISTS game_state (
  id SERIAL PRIMARY KEY,
  current_turn TEXT CHECK (current_turn IN ('nelson', 'juliana')),
  waiting_for_answer BOOLEAN DEFAULT FALSE,
  last_question_id BIGINT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial game state
INSERT INTO game_state (current_turn, waiting_for_answer) VALUES ('nelson', FALSE)
ON CONFLICT DO NOTHING;

-- Enable RLS and policies
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view game state" ON game_state FOR SELECT USING (true);
CREATE POLICY "Users can update game state" ON game_state FOR ALL USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;