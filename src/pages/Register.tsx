import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createRecaptchaVerifier, sendPhoneOTP } from '../firebase'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [stage, setStage] = useState<'form' | 'otp' | 'done'>('form')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any | null>(null)
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { registerWithEmail, signInWithGoogle, signInWithApple, signInWithMicrosoft } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    try {
      await registerWithEmail(email, password, name)
      // proceed to phone verification
      setStage('otp')
    } catch (err: any) {
      alert(err.message || 'Registration failed')
    }
  }

  const handleSendOTP = async () => {
    try {
      const verifier = createRecaptchaVerifier('recaptcha-container')
      const res = await sendPhoneOTP(phone, verifier)
      setConfirmationResult(res)
      setStage('otp')
    } catch (err: any) {
      alert(err.message || 'Failed to send OTP. Ensure Firebase is configured and phone auth is enabled.')
    }
  }

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      alert('No OTP request. Please request OTP first.')
      return
    }
    try {
      await confirmationResult.confirm(otp)
      setStage('done')
      navigate('/account')
    } catch (err: any) {
      alert(err.message || 'Invalid OTP')
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header onBuyClick={() => {}} />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-black mb-6 text-yellow-400 text-center">Create your account</h2>

          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              <button onClick={signInWithGoogle} className="px-4 py-2 bg-white text-black rounded">Sign in with Google</button>
              <button onClick={signInWithApple} className="px-4 py-2 bg-white text-black rounded">Sign in with Apple</button>
              <button onClick={signInWithMicrosoft} className="px-4 py-2 bg-white text-black rounded">Sign in with Microsoft</button>
            </div>

            {stage === 'form' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone (E.164 format, e.g. +919876543210)</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none" required />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none" required />
                </div>

                <button type="submit" className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300">Create account</button>

                <p className="text-center text-gray-400 text-sm">After creating account you'll be asked to verify your phone via OTP.</p>
              </form>
            )}

            {stage === 'otp' && (
              <div className="space-y-3">
                <div id="recaptcha-container" ref={el => { recaptchaContainerRef.current = el }}></div>
                <button onClick={handleSendOTP} className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg">Send OTP to phone</button>

                <div>
                  <label className="block text-sm font-semibold mb-2">OTP</label>
                  <input value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none" />
                </div>

                <button onClick={handleVerifyOTP} className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg">Verify OTP</button>
              </div>
            )}

            {stage === 'done' && (
              <div className="text-center">
                <h3 className="text-xl font-bold">Account created and verified</h3>
                <button onClick={() => navigate('/account')} className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded">Go to account</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
