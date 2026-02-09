import { FIREBASE_CONFIG } from './firebaseConfig'
import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User } from 'firebase/auth'

let authInitialized = false
let auth: ReturnType<typeof getAuth> | null = null
let googleProvider: GoogleAuthProvider | null = null
let appleProvider: OAuthProvider | null = null
let microsoftProvider: OAuthProvider | null = null

export function initFirebase() {
  if (authInitialized) return
  if (FIREBASE_CONFIG.apiKey === 'FILL_ME') {
    // Not configured yet — leave in dev/mock mode
    return
  }
  if (!getApps().length) {
    initializeApp(FIREBASE_CONFIG as any)
  }
  auth = getAuth()
  googleProvider = new GoogleAuthProvider()
  appleProvider = new OAuthProvider('apple.com')
  microsoftProvider = new OAuthProvider('microsoft.com')
  authInitialized = true
}

export function isFirebaseReady() {
  return authInitialized && auth !== null
}

export function isConfigured() {
  return FIREBASE_CONFIG.apiKey !== 'FILL_ME'
}

export function getAuthInstance() {
  if (!authInitialized) initFirebase()
  return auth
}

export function onAuthChange(cb: (user: User | null) => void) {
  const a = getAuthInstance()
  if (!a) return () => {}
  return onAuthStateChanged(a, cb)
}

export async function signInWithGoogle() {
  if (!isConfigured()) {
    // Dev mock: return a fake credential-like object
    return Promise.resolve({ user: { uid: `dev-google-${Date.now()}`, displayName: 'Dev Google User', email: 'dev@local' } })
  }
  const a = getAuthInstance()
  if (!a || !googleProvider) throw new Error('Firebase not configured')
  return signInWithPopup(a, googleProvider)
}

export async function signInWithApple() {
  if (!isConfigured()) {
    return Promise.resolve({ user: { uid: `dev-apple-${Date.now()}`, displayName: 'Dev Apple User', email: 'dev@local' } })
  }
  const a = getAuthInstance()
  if (!a || !appleProvider) throw new Error('Firebase not configured')
  return signInWithPopup(a, appleProvider)
}

export async function signInWithMicrosoft() {
  if (!isConfigured()) {
    return Promise.resolve({ user: { uid: `dev-microsoft-${Date.now()}`, displayName: 'Dev Microsoft User', email: 'dev@local' } })
  }
  const a = getAuthInstance()
  if (!a || !microsoftProvider) throw new Error('Firebase not configured')
  return signInWithPopup(a, microsoftProvider)
}

export function createRecaptchaVerifier(containerId: string, size: 'invisible' | 'normal' = 'invisible') {
  if (!isConfigured()) {
    // Dev-mode dummy verifier
    return {
      clear: () => {},
      verify: () => Promise.resolve(true),
    } as any as RecaptchaVerifier
  }
  const a = getAuthInstance()
  if (!a) throw new Error('Firebase not configured')
  return new RecaptchaVerifier(a, containerId, { size })
}

export async function sendPhoneOTP(phone: string, verifier: RecaptchaVerifier) {
  if (!isConfigured()) {
    // Dev mock: auto-confirm behavior — return object with confirm method
    return Promise.resolve({
      confirm: async (_otp: string) => ({ user: { uid: `dev-phone-${Date.now()}`, phoneNumber: phone } }),
    } as any)
  }
  const a = getAuthInstance()
  if (!a) throw new Error('Firebase not configured')
  return signInWithPhoneNumber(a, phone, verifier)
}

export async function createUserEmail(email: string, password: string) {
  if (!isConfigured()) {
    // Dev mock: return a fake user credential
    return Promise.resolve({ user: { uid: `dev-email-${Date.now()}`, email } } as any)
  }
  const a = getAuthInstance()
  if (!a) throw new Error('Firebase not configured')
  return createUserWithEmailAndPassword(a, email, password)
}

export async function signInEmail(email: string, password: string) {
  if (!isConfigured()) {
    return Promise.resolve({ user: { uid: `dev-email-${Date.now()}`, email } } as any)
  }
  const a = getAuthInstance()
  if (!a) throw new Error('Firebase not configured')
  return signInWithEmailAndPassword(a, email, password)
}

export async function signOut() {
  const a = getAuthInstance()
  if (!a) return
  return firebaseSignOut(a)
}
