# Google OAuth Setup for Secret Verification

## 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set Application type: "Web application"
6. Add Authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000` (for development)

## 2. Supabase Configuration
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID: `your-google-client-id`
   - Client Secret: `your-google-client-secret`

## 3. Environment Variables
Add to your `.env` file:
```
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## 4. How It Works
- Only Nelson & Juliana's Google accounts will be whitelisted
- After Google verification, they still need to select their profile
- This adds an extra security layer that only you two know about
- Anyone else trying to access will be blocked at Google verification

## 5. Whitelist Your Google Accounts
In Supabase, you can restrict to specific email domains or emails:
- nelson.youremail@gmail.com
- juliana.youremail@gmail.com