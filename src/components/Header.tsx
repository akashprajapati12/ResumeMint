import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Header({ onBuyClick }: { onBuyClick: () => void }) {
  const { cart, getTotalPrice } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="border-b border-gray-800">
      {/* Desktop Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top row: Brand name (always visible) */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300">ResumeMint</Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <a href="#templates" className="hover:text-yellow-400 transition">Templates</a>
            <a href="#features" className="hover:text-yellow-400 transition">Features</a>
            <a href="#pricing" className="hover:text-yellow-400 transition">Pricing</a>
            <a href="#faq" className="hover:text-yellow-400 transition">FAQ</a>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative text-white hover:text-yellow-400 transition"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
              >
                {user?.name || 'Account'}
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition text-sm"
                >
                  Register
                </Link>
              </>
            )}
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login')
                  return
                }
                onBuyClick()
              }}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
            >
              {cart.length > 0 ? `Buy Now - ${getTotalPrice()}` : 'Buy Now'}
            </button>
          </div>
        </div>

        {/* Mobile second row: Hamburger (left), Cart + User (right) */}
        <div className="flex md:hidden items-center justify-between mt-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-yellow-400 transition p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative text-white hover:text-yellow-400 transition text-sm"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-yellow-400 text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="text-white text-sm hover:text-yellow-400 transition"
              >
                {user?.name || 'Account'}
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="border border-yellow-400 text-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-400 hover:text-black transition text-xs"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-3 border-t border-gray-800 pt-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition py-1">Home</Link>
            <a href="#templates" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition py-1">Templates</a>
            <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition py-1">Features</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition py-1">Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition py-1">FAQ</a>
            {!isAuthenticated && (
              <Link 
                to="/register" 
                onClick={() => setMenuOpen(false)} 
                className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition text-sm text-center"
              >
                Register
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
