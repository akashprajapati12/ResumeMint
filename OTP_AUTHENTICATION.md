# OTP Authentication Implementation

This resume app now includes a complete OTP (One-Time Password) authentication system for phone-based login and registration.

## Features

✅ **Random OTP Generation** - Generates secure 6-digit OTP codes  
✅ **Automatic Expiration** - OTPs expire after 10 minutes  
✅ **Attempt Limiting** - Maximum 5 verification attempts per OTP  
✅ **Phone Number Validation** - Validates E.164 format (+[country code][number])  
✅ **Demo Mode** - Shows OTP in browser console for testing  
✅ **Reusable Component** - OTPVerification component for login and registration  
✅ **Real-time Countdown** - Displays remaining time for OTP validity  

## How It Works

### 1. **Request OTP**
User enters their phone number in the correct format:
- Format: `+919876543210` (E.164 format)
- A unique session ID is generated
- OTP is created and stored in memory

### 2. **Verify OTP**
User enters the 6-digit OTP within 10 minutes:
- OTP is validated against the stored code
- Expiration is checked
- Attempt counter is incremented
- On success, user is logged in/registered

### 3. **Integration Points**

The system is integrated in:
- **[Login.tsx](src/pages/Login.tsx)** - OTP login method
- **[Register.tsx](src/pages/Register.tsx)** - Phone verification during registration
- **[AuthContext.tsx](src/context/AuthContext.tsx)** - Core authentication logic
- **[OTPVerification.tsx](src/components/OTPVerification.tsx)** - Reusable OTP input component

## Demo Mode

For testing/development, the OTP is printed to the browser console:

```
[DEMO MODE] OTP for +919876543210: 123456
```

Simply copy the OTP and enter it in the verification screen.

## Production Integration

To use with real SMS services, replace the OTP sending logic in `src/utils/otpService.ts`:

### Option 1: Firebase Phone Authentication
```typescript
// In requestOTP method, replace the TODO with:
const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible'
});

const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
// Store confirmationResult and use it for verification
```

### Option 2: Twilio SMS Service
```typescript
// In requestOTP method:
const twilioResponse = await fetch('/api/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: phoneNumber, otp })
});
```

Backend (Node.js example):
```javascript
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

app.post('/api/send-otp', async (req, res) => {
  const { phone, otp } = req.body;
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: '+1234567890',
    to: phone
  });
  res.json({ success: true });
});
```

### Option 3: AWS SNS / Other Services
Similar approach - call your backend API that handles SMS sending.

## File Structure

```
src/
├── utils/
│   └── otpService.ts          # Core OTP logic
├── components/
│   └── OTPVerification.tsx     # Reusable OTP verification UI
├── context/
│   └── AuthContext.tsx         # Updated with OTP methods
└── pages/
    ├── Login.tsx               # Updated with OTP login
    └── Register.tsx            # Updated with OTP verification
```

## Usage Examples

### For Users

**Login with OTP:**
1. Navigate to `/login`
2. Click "OTP Login" tab
3. Enter phone number (+919876543210)
4. Click "Send OTP"
5. Check browser console for demo OTP
6. Enter the OTP in verification screen
7. Successfully logged in!

**Register with OTP:**
1. Navigate to `/register`
2. Fill in name, email, phone, and password
3. Click "Create account"
4. Verify your phone with the OTP
5. Account created!

### For Developers

```typescript
// In your component
const { requestOTP, verifyOTP } = useAuth();

// Request OTP
const result = await requestOTP('+919876543210');
if (result.success) {
  console.log('OTP sent, session:', result.sessionId);
}

// Verify OTP
const verified = await verifyOTP(sessionId, '123456');
if (verified.success) {
  // User is now authenticated
}
```

## Configuration

### OTP Settings (in `src/utils/otpService.ts`)

```typescript
private readonly OTP_LENGTH = 6;           // OTP digit length
private readonly EXPIRY_TIME = 10 * 60 * 1000; // Expiry in 10 minutes
private readonly MAX_ATTEMPTS = 5;         // Max verification attempts
```

Modify these constants to customize OTP behavior.

## Security Considerations

⚠️ **Current Implementation:**
- OTPs are stored in-memory (cleared on app reload)
- Valid for testing/staging only
- Demo OTPs are logged to console

✅ **For Production:**
1. Integrate with professional SMS service (Twilio, Firebase, AWS SNS)
2. Store OTPs in secure backend with encryption
3. Implement rate limiting per phone number
4. Log authentication attempts for audit
5. Use HTTPS only
6. Implement CAPTCHA to prevent brute force
7. Set shorter expiration times (5-10 minutes recommended)
8. Implement account lockout after max attempts

## Troubleshooting

**Issue: OTP not appearing in console**
- Check that browser console is open (F12)
- Ensure you're in demo mode (Firebase not configured)

**Issue: OTP verification fails**
- Verify phone format is correct: +[country][number]
- Check that OTP hasn't expired (10 minutes)
- Check that you haven't exceeded 5 attempts

**Issue: Phone number validation error**
- Use E.164 format: `+919876543210`
- Include country code (e.g., +91 for India, +1 for USA)

## Next Steps

1. **Integrate SMS Service:**
   - Choose Twilio, Firebase Phone Auth, or AWS SNS
   - Update `src/utils/otpService.ts`

2. **Add Backend:**
   - Create `/api/send-otp` endpoint
   - Implement OTP storage and retrieval
   - Add rate limiting

3. **Enhanced Features:**
   - SMS templates
   - Resend OTP button with cooldown
   - OTP delivery status tracking
   - Multi-language support

## Security Checklist

- [ ] Integrated with real SMS service
- [ ] OTPs encrypted in storage
- [ ] Rate limiting implemented
- [ ] CAPTCHA on OTP request
- [ ] Backend validation on all requests
- [ ] HTTPS enabled
- [ ] Audit logging implemented
- [ ] 2FA optional for sensitive operations
