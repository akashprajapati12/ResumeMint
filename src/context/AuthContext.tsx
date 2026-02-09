import React, { createContext, useContext, useEffect, useState } from 'react';
import { initFirebase, onAuthChange, signInWithGoogle, signInWithApple, signInWithMicrosoft, createUserEmail, signInEmail, signOut as firebaseSignOut, isConfigured } from '../firebase'

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
  login: (email: string, phone: string) => void;
  verifyOTP: (otp: string) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  otpSent: boolean;
  setOtpSent: (sent: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [otpSent, setOtpSent] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any | null>(null);

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

  const login = (email: string, phone: string) => {
    // Initiates phone OTP flow; actual sending happens via Firebase in the page using Recaptcha
    setTempEmail(email)
    setTempPhone(phone)
    setOtpSent(true)
  }

  const verifyOTP = async (otp: string) => {
    if (!confirmationResult) {
      alert('No OTP request in progress.');
      return
    }
    try {
      const cred = await confirmationResult.confirm(otp)
      const fbUser = cred.user
      const newUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || tempEmail.split('@')[0],
        email: fbUser.email || tempEmail,
        phone: fbUser.phoneNumber || tempPhone,
        paymentMethods: [],
      }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      setOtpSent(false)
      setConfirmationResult(null)
    } catch (err) {
      alert('Invalid OTP')
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
        login,
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
        otpSent,
        setOtpSent,
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
