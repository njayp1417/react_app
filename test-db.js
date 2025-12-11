// Test database connection and data
import { supabase } from './src/firebase.config.js';

async function testDatabase() {
  console.log('Testing database connection...');
  
  try {
    // Test user_status table
    const { data: userStatus, error: userError } = await supabase
      .from('user_status')
      .select('*');
    
    console.log('User Status:', userStatus);
    if (userError) console.error('User Status Error:', userError);
    
    // Test messages table
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .limit(5);
    
    console.log('Recent Messages:', messages);
    if (msgError) console.error('Messages Error:', msgError);
    
    // Test typing_status table
    const { data: typing, error: typingError } = await supabase
      .from('typing_status')
      .select('*');
    
    console.log('Typing Status:', typing);
    if (typingError) console.error('Typing Error:', typingError);
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();