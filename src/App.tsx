import { useState } from 'react'
import { useCart } from './context/CartContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import PricingWithCart from './components/PricingWithCart'
import Benefits from './components/Benefits'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import PaymentModal from './components/PaymentModal'
import Login from './pages/Login'
import Account from './pages/Account'
import Cart from './pages/Cart'
import Register from './pages/Register'

function HomePage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const { getTotalPrice, cart } = useCart()

  const handleBuyClick = () => {
    setIsPaymentOpen(true)
  }

  const currentPrice = cart.length > 0 ? getTotalPrice() : '₹49'

  return (
    <>
      <Header onBuyClick={() => handleBuyClick()} />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingWithCart />
      <Benefits />
      <FAQ />
      <Footer />
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)}
        price={currentPrice}
      />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename="/ResumeMint">
      <AuthProvider>
        <CartProvider>
          <div className="bg-black text-white overflow-x-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
