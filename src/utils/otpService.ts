/**
 * OTP Service - Handles OTP generation and verification with Firebase Phone Auth
 * Uses Firebase Phone Authentication for real SMS delivery
 */

import { 
  getAuth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  type ConfirmationResult
} from 'firebase/auth';
import { FIREBASE_CONFIG } from '../firebaseConfig';

interface OTPSession {
  phone: string;
  confirmationResult: ConfirmationResult | null;
  createdAt: number;
  attempts: number;
  maxAttempts: number;
}

class OTPService {
  private otpSessions: Map<string, OTPSession> = new Map();
  private readonly EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 5;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  /**
   * Initialize RecaptchaVerifier for Firebase Phone Auth
   * Must be called before requesting OTP
   */
  initializeRecaptcha(containerId: string): RecaptchaVerifier | null {
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'FILL_ME') {
      console.warn('Firebase not configured. Phone auth will not work.');
      return null;
    }

    try {
      const auth = getAuth();
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (_token: string) => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.clearRecaptcha();
        },
        'error-callback': () => {
          console.error('reCAPTCHA error');
          this.clearRecaptcha();
        }
      });
      return this.recaptchaVerifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      return null;
    }
  }

  /**
   * Clear reCAPTCHA instance
   */
  clearRecaptcha(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  /**
   * Request OTP for a phone number using Firebase Phone Auth
   * Firebase will send real SMS to the provided phone number
   */
  async requestOTP(phoneNumber: string): Promise<{ 
    success: boolean; 
    message: string; 
    sessionId: string;
  }> {
    // Validate phone number format
    if (!this.isValidPhoneNumber(phoneNumber)) {
      return {
        success: false,
        message: 'Invalid phone number format. Use format: +919876543210',
        sessionId: '',
      };
    }

    // Check if Firebase is configured
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'FILL_ME') {
      return {
        success: false,
        message: 'Firebase is not configured. Please configure Firebase in firebaseConfig.ts',
        sessionId: '',
      };
    }

    try {
      const auth = getAuth();
      
      // Ensure reCAPTCHA is initialized
      if (!this.recaptchaVerifier) {
        const recaptcha = this.initializeRecaptcha('recaptcha-container');
        if (!recaptcha) {
          return {
            success: false,
            message: 'reCAPTCHA not initialized. Ensure reCAPTCHA container exists.',
            sessionId: '',
          };
        }
      }

      // Send SMS via Firebase
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier!
      );

      // Store session
      const sessionId = `otp_${phoneNumber}_${Date.now()}`;
      this.otpSessions.set(sessionId, {
        phone: phoneNumber,
        confirmationResult,
        createdAt: Date.now(),
        attempts: 0,
        maxAttempts: this.MAX_ATTEMPTS,
      });

      return {
        success: true,
        message: `SMS sent to ${phoneNumber}. Enter the code you received.`,
        sessionId,
      };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send SMS. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number. Please check the format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.code === 'auth/missing-phone-number') {
        errorMessage = 'Phone number is required.';
      }

      return {
        success: false,
        message: errorMessage,
        sessionId: '',
      };
    }
  }

  /**
   * Verify the OTP entered by the user using Firebase
   */
  async verifyOTP(sessionId: string, enteredOTP: string): Promise<{
    success: boolean;
    message: string;
    phoneNumber?: string;
  }> {
    const session = this.otpSessions.get(sessionId);

    if (!session) {
      return {
        success: false,
        message: 'OTP session not found. Please request a new OTP.',
      };
    }

    // Check if session has expired
    if (Date.now() - session.createdAt > this.EXPIRY_TIME) {
      this.otpSessions.delete(sessionId);
      this.clearRecaptcha();
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      };
    }

    // Check if max attempts exceeded
    if (session.attempts >= session.maxAttempts) {
      this.otpSessions.delete(sessionId);
      this.clearRecaptcha();
      return {
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.',
      };
    }

    // Increment attempt counter
    session.attempts++;

    try {
      // Verify with Firebase
      if (!session.confirmationResult) {
        return {
          success: false,
          message: 'No confirmation result found. Please request a new OTP.',
        };
      }

      await session.confirmationResult.confirm(enteredOTP);
      
      // Success - clean up
      this.otpSessions.delete(sessionId);
      this.clearRecaptcha();

      return {
        success: true,
        message: 'OTP verified successfully',
        phoneNumber: session.phone,
      };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      let errorMessage = 'Invalid OTP. Please try again.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = `Invalid OTP. ${session.maxAttempts - session.attempts} attempts remaining.`;
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please request a new one.';
        this.otpSessions.delete(sessionId);
        this.clearRecaptcha();
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Validate phone number format (E.164 format)
   */
  private isValidPhoneNumber(phone: string): boolean {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  }

  /**
   * Clear all expired OTP sessions
   */
  clearExpiredOTPs(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.otpSessions.entries()) {
      if (now - session.createdAt > this.EXPIRY_TIME) {
        this.otpSessions.delete(sessionId);
      }
    }
  }

  /**
   * Get remaining time for OTP session
   */
  getSessionTimeRemaining(sessionId: string): number {
    const session = this.otpSessions.get(sessionId);
    if (!session) return 0;

    const elapsed = Date.now() - session.createdAt;
    const remaining = this.EXPIRY_TIME - elapsed;
    return Math.max(0, remaining);
  }
}

// Export singleton instance
export const otpService = new OTPService();

// Periodically clean up expired sessions
setInterval(() => {
  otpService.clearExpiredOTPs();
}, 60000); // Every minute
