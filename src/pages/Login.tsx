import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { otpService } from '../utils/otpService';
import OTPVerification from '../components/OTPVerification';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, loginWithEmail, requestOTP, verifyOTP } = useAuth();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  // Email/Password login state
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  
  // OTP login state
  const [phone, setPhone] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email')

  // Initialize reCAPTCHA when component mounts or OTP method is selected
  useEffect(() => {
    if (loginMethod === 'otp' && recaptchaContainerRef.current && !otpSent) {
      try {
        otpService.initializeRecaptcha('recaptcha-container');
      } catch (error) {
        console.error('Failed to initialize reCAPTCHA:', error);
      }
    }
  }, [loginMethod, otpSent]);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password) {
      setMessage('Please enter identifier and password')
      return
    }

    setIsLoading(true)
    try {
      // If identifier looks like email, use email/password flow
      if (identifier.includes('@')) {
        await loginWithEmail(identifier, password)
        navigate('/account')
      } else {
        // Otherwise treat as phone — check localStorage for registered user (dev-mode fallback)
        const saved = localStorage.getItem('user')
        if (saved) {
          const u = JSON.parse(saved)
          if (u.phone === identifier) {
            // Successful login (dev-mode) — no password verification available
            navigate('/account')
            return
          }
        }
        setMessage('User not found. Please register.')
        navigate('/register')
      }
    } catch (err: any) {
      setMessage(err.message || 'Login failed. Please register.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone) {
      setMessage('Please enter your phone number')
      return
    }

    setIsLoading(true)
    setMessage('')
    
    try {
      const result = await requestOTP(phone)
      if (result.success) {
        setSessionId(result.sessionId)
        setOtpSent(true)
        setMessage(`SMS sent to ${phone}`)
      } else {
        setMessage(result.message)
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (otp: string) => {
    try {
      const result = await verifyOTP(sessionId, otp)
      if (result.success) {
        setMessage('Login successful!')
        setTimeout(() => navigate('/account'), 1000)
        return result
      } else {
        setMessage(result.message)
        return { success: false, message: result.message }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Verification failed'
      setMessage(errorMsg)
      return { success: false, message: errorMsg }
    }
  }

  const handleCancelOTP = () => {
    setOtpSent(false)
    setSessionId('')
    setPhone('')
    setMessage('')
    otpService.clearRecaptcha();
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header onBuyClick={() => {}} />
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-black mb-8 text-center text-yellow-400">ResumeMint</h2>

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.includes('sent') || message.includes('successful')
                ? 'bg-green-900 border border-green-700 text-green-200'
                : 'bg-red-900 border border-red-700 text-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Login Method Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 rounded text-sm font-semibold transition ${
                loginMethod === 'email'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-yellow-400'
              }`}
            >
              Email Login
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 rounded text-sm font-semibold transition ${
                loginMethod === 'otp'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-yellow-400'
              }`}
            >
              OTP Login
            </button>
          </div>

          {/* Email/Password Login */}
          {loginMethod === 'email' && (
            <form onSubmit={handleCredentialLogin} className="space-y-4">
              <h3 className="text-xl font-bold mb-6">Login with Email</h3>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black disabled:opacity-50 transition font-bold"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="flex-1 px-3 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="flex-1 border border-yellow-400 text-yellow-400 px-3 py-2 rounded hover:bg-yellow-400 hover:text-black transition"
                >
                  Register
                </button>
              </div>
            </form>
          )}

          {/* OTP Login */}
          {loginMethod === 'otp' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-6">Login with OTP</h3>

              {/* reCAPTCHA Container (Required for Firebase Phone Auth) */}
              <div id="recaptcha-container" ref={recaptchaContainerRef} className="mb-4"></div>

              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+919876543210"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Format: +[country code][number] (e.g., +919876543210)</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition font-bold"
                  >
                    {isLoading ? 'Sending SMS...' : 'Send SMS'}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full border border-yellow-400 text-yellow-400 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition font-bold"
                  >
                    Register
                  </button>
                </form>
              ) : (
                <OTPVerification
                  phone={phone}
                  sessionId={sessionId}
                  onVerification={handleVerifyOTP}
                  onCancel={handleCancelOTP}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
