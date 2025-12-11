import { createClient } from '@supabase/supabase-js';

// Supabase config - Nelson & Juliana Love App
const supabaseUrl = 'https://rxhvrzdibuyuicsevkob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4aHZyemRpYnV5dWljc2V2a29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MzQxNDYsImV4cCI6MjA4MTAxMDE0Nn0.F3RlbQlEhTYA81x-8gNx8d10qO8xy2XYlZXYo7PbEP8';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;