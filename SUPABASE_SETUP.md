# Supabase Setup Guide for Nelson & Juliana Love App

## Step 1: Database Setup

1. Go to your Supabase dashboard: https://rxhvrzdibuyuicsevkob.supabase.co
2. Navigate to the SQL Editor
3. Copy and paste the entire content from `supabase-setup.sql`
4. Run the SQL script to create all tables and policies

## Step 2: Authentication Setup

The app uses simple email/password authentication:
- **Nelson**: `nelson@loveapp.com` / `loveforever2024`
- **Juliana**: `juliana@loveapp.com` / `loveforever2024`

## Step 3: Storage Setup

1. Go to Storage in your Supabase dashboard
2. The `photos` bucket should be created automatically
3. Make sure it's set to public access

## Step 4: Real-time Features

The following features work in real-time:
- ✅ **Chat Messages** - Instant messaging between Nelson & Juliana
- ✅ **Typing Indicators** - See when partner is typing
- ✅ **Online Status** - See if partner is online/offline
- ✅ **Message Status** - Sent/Delivered/Read indicators
- ✅ **Media Sharing** - Photos, videos, voice messages
- ✅ **Message Reactions** - React with emojis
- ✅ **Reply to Messages** - Quote and reply functionality

## Step 5: Test the Connection

1. Run the app: `npm start`
2. Login as Nelson on one browser/device
3. Login as Juliana on another browser/device
4. Test real-time chat functionality

## Features Ready to Use

### 💬 Chat Screen
- Real-time messaging
- Voice messages (hold mic button)
- Photo/video sharing
- Message reactions (❤️😂👍)
- Reply to messages
- Typing indicators
- Online/offline status

### 📸 Gallery Screen
- Upload and share photos
- Real-time photo updates
- Favorite photos

### 🎮 Games Screen
- Truth or Dare game
- Score tracking
- Custom questions

### 👤 Profile Screen
- User information
- Love notes
- Relationship stats

## Database Tables Created

- `messages` - Chat messages with media support
- `typing_status` - Real-time typing indicators
- `user_status` - Online/offline status
- `photos` - Gallery photos
- `game_scores` - Game statistics
- `truth_dare_questions` - Truth or dare questions
- `love_notes` - Personal love notes

## Security

- Row Level Security (RLS) enabled on all tables
- Only Nelson and Juliana can access the data
- Real-time subscriptions secured by policies

## Next Steps

1. Run the SQL setup script in Supabase
2. Test the authentication
3. Start chatting in real-time!

The app is now ready for Nelson and Juliana to connect and communicate in real-time! 💕