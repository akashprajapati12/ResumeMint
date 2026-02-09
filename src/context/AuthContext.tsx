import React, { createContext, useContext, useEffect, useState } from 'react';
import { initFirebase, onAuthChange, signInWithGoogle, signInWithApple, signInWithMicrosoft, createUserEmail, signInEmail, signOut as firebaseSignOut, isConfigured } from '../firebase'
import { otpService } from '../utils/otpService';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentMethods: PaymentMethod[];
}

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'whatsapp';
  value: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  // OTP based authentication
  requestOTP: (phone: string) => Promise<{ success: boolean; message: string; sessionId: string }>;
  verifyOTP: (sessionId: string, otp: string) => Promise<{ success: boolean; message: string }>;
  // Email/Password authentication
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check both localStorage and temporary session storage
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Could not parse user from localStorage');
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    initFirebase()
    const unsub = onAuthChange((fbUser) => {
      if (fbUser) {
        const u: User = {
          id: fbUser.uid,
          name: (fbUser.displayName as string) || fbUser.email?.split('@')[0] || '',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '',
          paymentMethods: [],
        }
        setUser(u)
        localStorage.setItem('user', JSON.stringify(u))
      } else {
        setUser(null)
        localStorage.removeItem('user')
      }
    })
    return () => unsub()
  }, [])

  /**
   * Request OTP for phone number
   */
  const requestOTP = async (phone: string): Promise<{ success: boolean; message: string; sessionId: string }> => {
    try {
      const result = await otpService.requestOTP(phone);
      return {
        success: result.success,
        message: result.message,
        sessionId: result.sessionId,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to request OTP',
        sessionId: '',
      };
    }
  }

  /**
   * Verify OTP and login user
   */
  const verifyOTP = async (sessionId: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await otpService.verifyOTP(sessionId, otp);
      
      if (!result.success) {
        return {
          success: false,
          message: result.message,
        };
      }

      // Create or update user with phone number
      const phoneNumber = result.phoneNumber || '';
      const newUser: User = {
        id: `phone_${phoneNumber}_${Date.now()}`,
        name: `User_${phoneNumber.slice(-4)}`,
        email: '',
        phone: phoneNumber,
        paymentMethods: [],
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      return {
        success: true,
        message: 'Login successful',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to verify OTP',
      };
    }
  }

  const signInWithGoogleWrapper = async () => {
    try {
      await signInWithGoogle()
      // onAuthChange will handle state
    } catch (err: any) {
      alert(err.message || 'Google sign-in failed')
    }
  }

  const signInWithAppleWrapper = async () => {
    try {
      await signInWithApple()
    } catch (err: any) {
      alert(err.message || 'Apple sign-in failed')
    }
  }

  const signInWithMicrosoftWrapper = async () => {
    try {
      await signInWithMicrosoft()
    } catch (err: any) {
      alert(err.message || 'Microsoft sign-in failed')
    }
  }

  const registerWithEmail = async (email: string, password: string, name?: string) => {
    try {
      const res = await createUserEmail(email, password)
      // If Firebase is not configured, createUserEmail returns a mock credential — set user locally
      if (!isConfigured()) {
        const newUser: User = {
          id: res.user.uid,
          name: name || email.split('@')[0],
          email,
          phone: '',
          paymentMethods: [],
        }
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
      }
      // onAuthChange will pick up user when configured
    } catch (err: any) {
      throw err
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const res = await signInEmail(email, password)
      if (!isConfigured()) {
        const newUser: User = {
          id: res.user.uid,
          name: email.split('@')[0],
          email,
          phone: '',
          paymentMethods: [],
        }
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
      }
    } catch (err: any) {
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    firebaseSignOut()
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    if (user) {
      const updated = {
        ...user,
        paymentMethods: [
          ...user.paymentMethods.map(m => ({ ...m, isDefault: false })),
          method,
        ],
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const removePaymentMethod = (id: string) => {
    if (user) {
      const updated = {
        ...user,
        paymentMethods: user.paymentMethods.filter(m => m.id !== id),
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        requestOTP,
        verifyOTP,
        signInWithGoogle: signInWithGoogleWrapper,
        signInWithApple: signInWithAppleWrapper,
        signInWithMicrosoft: signInWithMicrosoftWrapper,
        registerWithEmail,
        loginWithEmail,
        logout,
        updateProfile,
        addPaymentMethod,
        removePaymentMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
