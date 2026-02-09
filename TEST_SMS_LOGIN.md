# Testing SMS Login Functionality

## Pre-requisites
1. Firebase project with Phone Authentication enabled
2. Valid phone number in E.164 format (+919876543210)
3. Internet connection

## Steps to Test SMS Login

### 1. Prepare Firebase Console
- [ ] Ensure Phone Authentication is enabled in Firebase Console
- [ ] Verify your domain is in the authorized domains list (for development: `localhost`)

### 2. Run the Application
```bash
npm run dev
```

### 3. Test Login Flow
1. Open browser to `http://localhost:5173`
2. Click on "Login" in the header
3. Switch to "OTP Login" tab
4. Enter your phone number in E.164 format (e.g., `+919876543210`)
5. Click "Send SMS"
6. Check your phone for the SMS code
7. Enter the 6-digit code in the app
8. Verify successful login

### 4. Test Registration Flow
1. Open browser to `http://localhost:5173`
2. Click on "Register" in the header
3. Fill in the registration form with:
   - Full name
   - Email
   - Phone number in E.164 format (e.g., `+919876543210`)
   - Password (at least 8 characters)
   - Confirm password
4. Click "Create account"
5. Complete the OTP verification flow that follows

## Common Issues and Solutions

### Issue: reCAPTCHA not loading
- Solution: Check that the reCAPTCHA container div exists in the DOM
- Check browser console for errors

### Issue: SMS not received
- Verify phone number format is correct: `+[country code][number]`
- Ensure Firebase Phone Auth is enabled in Firebase Console
- Check if you've exceeded daily SMS limit (10 per day on free tier)

### Issue: "Firebase not configured" error
- Verify all fields in `src/firebaseConfig.ts` are filled correctly
- Ensure the project ID matches your Firebase project

### Issue: "Invalid phone number" error
- Ensure phone number follows E.164 format
- Example: India: `+919876543210`, USA: `+14155552671`

## Debugging Tips

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Perform the SMS login flow
4. Check for any error messages
5. Look for Firebase-related errors specifically

## Expected Behavior

- When clicking "Send SMS", you should see a loading indicator
- After successful request, a success message should appear
- The SMS should arrive on your phone within 5-10 seconds
- Entering the correct code should complete the login process

## Environment Check Script

Run this command to verify your environment:
```bash
node -v
npm -v
npm list firebase
```