import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { otpService } from '../utils/otpService'
import OTPVerification from '../components/OTPVerification'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [stage, setStage] = useState<'form' | 'phone-verification' | 'done'>('form')
  const [sessionId, setSessionId] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { registerWithEmail, signInWithGoogle, signInWithApple, signInWithMicrosoft, requestOTP, verifyOTP } = useAuth()

  // Initialize reCAPTCHA when moving to phone verification stage
  useEffect(() => {
    if (stage === 'phone-verification' && !sessionId && recaptchaContainerRef.current) {
      try {
        otpService.initializeRecaptcha('recaptcha-container-register');
      } catch (error) {
        console.error('Failed to initialize reCAPTCHA:', error);
      }
    }
  }, [stage, sessionId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setMessage('')
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (!phone) {
      setMessage('Phone number is required')
      return
    }

    setIsLoading(true)
    try {
      await registerWithEmail(email, password, name)
      // Proceed to phone verification
      const result = await requestOTP(phone)
      if (result.success) {
        setSessionId(result.sessionId)
        setStage('phone-verification')
        setMessage('')
      } else {
        setMessage(result.message)
      }
    } catch (err: any) {
      setMessage(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyPhoneOTP = async (otp: string) => {
    try {
      const result = await verifyOTP(sessionId, otp)
      if (result.success) {
        setStage('done')
        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Verification failed' }
    }
  }

  const handleCancelOTP = () => {
    setStage('form')
    setSessionId('')
    setMessage('')
    otpService.clearRecaptcha();
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header onBuyClick={() => {}} />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-black mb-6 text-yellow-400 text-center">Create your account</h2>

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.toLowerCase().includes('sent') || message.toLowerCase().includes('verification')
                ? 'bg-green-900 border border-green-700 text-green-200'
                : 'bg-red-900 border border-red-700 text-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              <button onClick={signInWithGoogle} className="flex-1 px-3 py-2 bg-white text-black rounded text-sm hover:bg-gray-200 transition">Google</button>
              <button onClick={signInWithApple} className="flex-1 px-3 py-2 bg-white text-black rounded text-sm hover:bg-gray-200 transition">Apple</button>
              <button onClick={signInWithMicrosoft} className="flex-1 px-3 py-2 bg-white text-black rounded text-sm hover:bg-gray-200 transition">Microsoft</button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            {stage === 'form' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Format: +[country code][number]</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>

                <p className="text-center text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-yellow-400 hover:underline"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}

            {stage === 'phone-verification' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Verify your phone number</h3>
                
                {/* reCAPTCHA Container (Required for Firebase Phone Auth) */}
                <div id="recaptcha-container-register" ref={recaptchaContainerRef} className="mb-4"></div>
                
                <OTPVerification
                  phone={phone}
                  sessionId={sessionId}
                  onVerification={handleVerifyPhoneOTP}
                  onCancel={handleCancelOTP}
                  isLoading={isLoading}
                />
              </div>
            )}

            {stage === 'done' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">✓</div>
                <h3 className="text-xl font-bold">Account created successfully!</h3>
                <p className="text-gray-400">Your phone number has been verified.</p>
                <button
                  onClick={() => navigate('/account')}
                  className="w-full px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:bg-yellow-300 transition"
                >
                  Go to Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
