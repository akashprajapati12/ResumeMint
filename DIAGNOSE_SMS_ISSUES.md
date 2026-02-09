# Diagnosing SMS Login Issues

## Issue: SMS Login Not Working

### 1. Check Firebase Console Configuration
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select your project (`resumemint-43bef`)
- [ ] Navigate to **Authentication** → **Sign-in method**
- [ ] Verify that **Phone** is enabled (toggle switched ON)
- [ ] If not enabled, click the toggle and save

### 2. Verify Domain Whitelisting
- [ ] In Firebase Console → Authentication → Settings
- [ ] Check "Authorized domains" includes `localhost` (for development)
- [ ] If not present, add `localhost` to authorized domains

### 3. Check Phone Number Format
- [ ] Ensure phone number is in E.164 format: `+919876543210`
- [ ] For India: `+91` followed by 10-digit number
- [ ] For USA: `+1` followed by 10-digit number
- [ ] Example valid format: `+919876543210`

### 4. Check Firebase Free Tier Limits
- [ ] Free Spark plan allows 10 phone authentications per day
- [ ] If you've exceeded the limit, wait until tomorrow or upgrade to Blaze plan

### 5. Verify Firebase Configuration
The configuration in `src/firebaseConfig.ts` looks correct with actual values:
```
apiKey: "AIzaSyCrYeZqBT7Ms170PnqsYNdYxsEguiWIsPs",
authDomain: "resumemint-43bef.firebaseapp.com",
projectId: "resumemint-43bef",
storageBucket: "resumemint-43bef.firebasestorage.app",
messagingSenderId: "576673326425",
appId: "1:576673326425:web:70e35d585614052285d848",
measurementId: "G-QW6TPVQD06"
```

### 6. Debug Steps
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try the SMS login flow
4. Check for any error messages in the console
5. The errors will provide specific information about what's failing

### 7. Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| "Firebase not configured" | Check if Firebase config keys are correct |
| "auth/invalid-phone-number" | Verify phone number format is E.164 |
| "auth/missing-phone-number" | Ensure phone number is provided |
| "auth/too-many-requests" | Wait before trying again, rate limited |
| "reCAPTCHA not initialized" | Check if recaptcha container exists |

### 8. Testing Process
1. Run the app: `npm run dev`
2. Navigate to login page
3. Click "OTP Login" tab
4. Enter phone number in format: `+919876543210`
5. Click "Send SMS"
6. Check phone for SMS code
7. Enter 6-digit code in the app
8. Verify login works

### 9. Additional Checks
- [ ] Ensure your phone carrier allows receiving SMS from unknown numbers
- [ ] Check if SMS is blocked by phone settings
- [ ] Try with different phone number if possible
- [ ] Verify internet connection is stable