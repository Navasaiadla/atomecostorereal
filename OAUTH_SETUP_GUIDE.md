# OAuth Authentication Setup Guide

## 🚀 Google & Apple Authentication Setup

Your authentication system now supports Google and Apple OAuth! Here's how to set it up:

## 📋 Prerequisites

1. **Supabase Project**: You already have this ✅
2. **Environment Variables**: Your `.env.local` file should be set up ✅
3. **OAuth Providers**: Need to configure Google and Apple in Supabase

## 🔧 Step 1: Configure Google OAuth

### 1.1 Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add these Authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   http://localhost:3001/auth/callback
   ```
7. Copy the **Client ID** and **Client Secret**

### 1.2 Configure in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google **Client ID** and **Client Secret**
5. Save the configuration

## 🍎 Step 2: Configure Apple OAuth

### 2.1 Create Apple Developer Account
1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Go to **Certificates, Identifiers & Profiles**
4. Create a new **App ID** for your application
5. Enable **Sign In with Apple** capability

### 2.2 Create Apple OAuth App
1. In Apple Developer Console, go to **Keys**
2. Create a new key with **Sign In with Apple** enabled
3. Download the key file (`.p8` format)
4. Note the **Key ID** and **Team ID**

### 2.3 Configure in Supabase
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Apple** and click **Enable**
4. Enter your Apple credentials:
   - **Client ID**: Your App ID (e.g., `com.yourcompany.yourapp`)
   - **Client Secret**: Generate using your key (see below)
   - **Key ID**: From your Apple key
   - **Team ID**: Your Apple Developer Team ID
   - **Private Key**: Content of your `.p8` file

## 🔑 Step 3: Generate Apple Client Secret

Apple requires a JWT token as the client secret. You can generate this using:

```bash
# Install the required package
npm install jsonwebtoken

# Create a script to generate the secret
node -e "
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('path/to/your/AuthKey_KEYID.p8');
const teamId = 'YOUR_TEAM_ID';
const clientId = 'com.yourcompany.yourapp';
const keyId = 'YOUR_KEY_ID';

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId
});

console.log('Apple Client Secret:', token);
"
```

## 🎯 Step 4: Test OAuth Authentication

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit your login/register page**:
   - Go to `http://localhost:3001/login` or `http://localhost:3001/register`

3. **Test OAuth buttons**:
   - Click "Continue with Google" or "Continue with Apple"
   - Complete the OAuth flow
   - You should be redirected back to your app

## 🔍 Step 5: Verify Setup

### Check OAuth Configuration
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Verify Google and Apple are **Enabled**
3. Check that redirect URLs are correct

### Test Authentication Flow
1. Try signing in with Google
2. Try signing in with Apple
3. Verify user profiles are created automatically
4. Check that users are redirected to home page

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check that your redirect URIs match exactly in both Google/Apple and Supabase
   - Include both production and development URLs

2. **"OAuth provider not configured"**
   - Verify the provider is enabled in Supabase
   - Check that all credentials are entered correctly

3. **"Client secret invalid"**
   - For Apple: Regenerate the JWT token
   - For Google: Verify the client secret is correct

4. **"User not created"**
   - Check the `/api/auth/create-profile` route
   - Verify RLS policies allow profile creation

### Debug Steps

1. **Check browser console** for errors
2. **Check Supabase logs** in the dashboard
3. **Verify environment variables** are set correctly
4. **Test with `/debug-auth`** page

## 📱 Mobile Considerations

For mobile apps, you'll need to add additional redirect URIs:

```
com.yourapp://auth/callback
```

## 🔒 Security Best Practices

1. **Never commit OAuth secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** (especially Apple keys)
4. **Monitor OAuth usage** in Supabase dashboard
5. **Implement proper error handling** for OAuth failures

## 🎉 Success!

Once configured, your users can:
- ✅ Sign up with Google
- ✅ Sign up with Apple
- ✅ Sign in with Google
- ✅ Sign in with Apple
- ✅ Automatic profile creation
- ✅ Seamless redirect to home page

## 📞 Need Help?

If you encounter issues:
1. Check the Supabase documentation
2. Verify your OAuth app configurations
3. Test with the debug page
4. Check browser console for errors

---

**Your OAuth authentication is now ready to use!** 🚀 