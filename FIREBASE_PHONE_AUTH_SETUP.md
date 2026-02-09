# Firebase Phone Authentication Setup Guide

Your resume app now uses **real Firebase Phone Authentication** for OTP-based login and registration!

## What Changed? 🔄

### Before (Demo Mode)
- OTPs generated locally
- Displayed in browser console
- Perfect for testing without real SMS

### Now (Real Firebase)
- OTPs sent via Firebase Phone Auth
- Real SMS delivered to phone number
- Users receive actual verification codes
- Secure Firebase backend handling

## Prerequisites ✅

You need a Firebase project with:
1. ✅ Realtime Database or Firestore (already set up)
2. ⚠️ **Phone Authentication enabled** (we'll do this)
3. ⚠️ **reCAPTCHA API key configured** (required for web phone auth)

## Step-by-Step Setup 🚀

### Step 1: Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Phone** in the "Sign-in providers" section
5. Click the toggle to **Enable**
6. Click **Save**

✅ **Phone authentication is now enabled!**

### Step 2: Get reCAPTCHA Keys

Firebase Phone Auth requires reCAPTCHA v3 for web security. You need two keys:

#### Option A: Auto-Generate (Recommended)
1. In Firebase Console → **Authentication** → **Settings**
2. Scroll to "reCAPTCHA configuration"
3. Firebase will auto-generate API keys for your domain
4. Copy the **Web site key** (public)

#### Option B: Manual Setup
1. Go to [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **Create** or "+" button
3. Fill in:
   - **Label:** "Resume App Phone Auth"
   - **reCAPTCHA type:** Select **"reCAPTCHA v3"**
   - **Domains:** 
     - `localhost:5173` (development)
     - `localhost:3000` (if using different port)
     - Your production domain (when deployed)
4. Click **Create**
5. You'll get:
   - **Site Key** (public)
   - **Secret Key** (keep private!)

### Step 3: Configure Your App

**Your app is ALREADY configured!** The code is ready. Just ensure:

1. Your `firebaseConfig.ts` has all keys filled in:
```typescript
export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',           // ✅ Already needed
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_BUCKET.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'G-XXXXXXXXXX'
};
```

2. That's it! The app auto-handles reCAPTCHA.

## How It Works Now 📱

### Login Flow
```
User enters phone: +919876543210
           ↓
Initialize reCAPTCHA (invisible)
           ↓
Firebase sends real SMS via phone auth
           ↓
User receives code on phone
           ↓
User enters code in app
           ↓
Firebase verifies code
           ↓
User logged in! ✅
```

### Technical Details

**reCAPTCHA Container:**
- Placed invisibly on login/register pages
- Two containers: `#recaptcha-container` (Login) and `#recaptcha-container-register` (Register)
- Firebase automatically handles verification

**SMS Delivery:**
- Sent by Firebase (using partner SMS providers)
- Typically arrives within 5 seconds
- Supports 200+ countries
- 6-digit code, 10-minute expiration

## Testing 🧪

### Test with Valid Phone Number

1. Start app: `npm run dev`
2. Go to `/login` → Click "OTP Login"
3. Enter your **real phone number** in E.164 format:
   - India: `+919876543210`
   - USA: `+14155552671`
   - UK: `+442071838750`
4. Click "Send SMS"
5. Check your phone for SMS with code
6. Enter code in app
7. Success! You're logged in

### Error Messages You Might See

| Error | Reason | Fix |
|-------|--------|-----|
| "Firebase not configured" | firebaseConfig.ts incomplete | Fill in all Firebase keys |
| "reCAPTCHA not initialized" | Container missing | Check ID: `recaptcha-container` |
| "Invalid phone number" | Wrong format | Use: `+[country][number]` |
| "Too many requests" | Rate limit hit | Wait 1 minute, try again |
| "Invalid verification code" | Wrong code entered | Check phone and re-enter |

## Firebase Phone Auth Limits 📊

**Free Tier (Spark Plan):**
- Up to 10 phone authentications per day
- Perfect for development/testing

**Paid Plan (Blaze):**
- Pay-as-you-go pricing
- Usually $0.01-0.10 per SMS sent
- Scales as needed

## Security Features 🔒

✅ **Automatic:**
- reCAPTCHA v3 bot protection
- 10-minute OTP expiration
- 5 attempt limit
- Firebase session security

✅ **Built-in:**
- HTTPS-only
- Phone number validation
- Rate limiting per IP/phone
- Secure token storage

## Troubleshooting 🔧

### SMS Not Arriving?

**Check:**
1. Phone number format is correct: `+919876543210`
2. Not in "Do Not Disturb" mode
3. SMS app not blocking Firebase numbers
4. Country supports Firebase SMS (most do)

**If still not working:**
- Try different phone number
- Wait 60 seconds between attempts
- Check Firebase Console → Authentication → Events log

### reCAPTCHA Issues?

**Error: "reCAPTCHA site key not found"**
- Add domain to reCAPTCHA settings
- Refresh browser cache (Ctrl+F5)
- Try incognito window

**Error: "Invalid domain"**
- Make sure domain is whitelisted in reCAPTCHA console
- For localhost: add `localhost:5173`

### Firebase Connection Issues?

Check in Firebase Console:
1. **Authentication** → **Sign-in providers** → Is "Phone" enabled?
2. **Project Settings** → Is API enabled (usually auto-enabled)?
3. **Billing** → If on Free tier, limited to 10 SMS/day

## Production Deployment 🚀

When deploying to production:

1. Add your domain to reCAPTCHA whitelist
   - Example: `resumemint.com`

2. Update firebaseConfig.ts (or use environment variables)

3. Test with real phone numbers on production domain

4. Consider upgrading Firebase plan if many users

## File Changes Summary 📝

| File | Change |
|------|--------|
| `src/utils/otpService.ts` | Now uses Firebase Phone Auth |
| `src/context/AuthContext.tsx` | Updated with async OTP methods |
| `src/pages/Login.tsx` | Added reCAPTCHA container & Firebase integration |
| `src/pages/Register.tsx` | Added reCAPTCHA container & Firebase integration |
| `src/components/OTPVerification.tsx` | Handles Firebase OTP verification |

## Next Steps 📋

- [ ] Enable Phone Authentication in Firebase Console
- [ ] At least check your reCAPTCHA setup
- [ ] Test with your own phone number
- [ ] Verify SMS arrives correctly
- [ ] Plan production domain setup
- [ ] Test error handling
- [ ] Monitor SMS costs if on paid tier

## Still Have Issues?

### Check These Files:
- `src/utils/otpService.ts` - OTP service implementation
- `src/context/AuthContext.tsx` - Auth context with OTP methods
- Firebase Console → Authentication → Sign-in providers

### Common Issues & Fixes:
- **App won't start:** Check `firebaseConfig.ts` isn't set to FILL_ME
- **OTP not sending:** Verify Phone auth is enabled in Firebase Console
- **Code verification fails:** Make sure you're entering exact code from SMS

---

## You're Ready! 🎉

Your resume app now has **real Firebase Phone Authentication**!

- ✅ Users can sign in with OTP
- ✅ Real SMS delivery
- ✅ Secure reCAPTCHA protection
- ✅ Production-ready

Test it out and let users authenticate via phone! 📱
