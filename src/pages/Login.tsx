import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, loginWithEmail } = useAuth();
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password) {
      alert('Please enter identifier and password')
      return
    }

    // If identifier looks like email, use email/password flow
    if (identifier.includes('@')) {
      try {
        await loginWithEmail(identifier, password)
        navigate('/account')
      } catch (err: any) {
        alert('User not found or invalid credentials. Please register.')
        navigate('/register')
      }
      return
    }

    // Otherwise treat as phone — check localStorage for registered user (dev-mode fallback)
    try {
      const saved = localStorage.getItem('user')
      if (saved) {
        const u = JSON.parse(saved)
        if (u.phone === identifier) {
          // Successful login (dev-mode) — no password verification available
          navigate('/account')
          return
        }
      }
      alert('User not found. Please register.')
      navigate('/register')
    } catch (err) {
      alert('Login failed. Please register.')
      navigate('/register')
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header onBuyClick={() => {}} />
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-black mb-8 text-center text-yellow-400">ResumeMint</h2>

          <form onSubmit={handleCredentialLogin} className="space-y-4">
            <h3 className="text-xl font-bold mb-6">Login with Email or Phone</h3>

            <div>
              <label className="block text-sm font-semibold mb-2">Email or Phone</label>
              <input value={identifier} onChange={e=>setIdentifier(e.target.value)} placeholder="you@email.com or +919876543210" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-yellow-400 outline-none text-white" />
            </div>

            <button type="submit" className="w-full py-3 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition font-bold">Login</button>

            <div className="flex gap-2">
              <button type="button" onClick={()=>signInWithGoogle()} className="flex-1 px-3 py-2 bg-white text-black rounded">Google</button>
              <button type="button" onClick={()=>navigate('/register')} className="flex-1 border border-yellow-400 text-yellow-400 px-3 py-2 rounded hover:bg-yellow-400 hover:text-black">Register</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
