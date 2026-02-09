import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Redirect unauthenticated users to login before showing cart
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (cart.length === 0) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col">
        <Header onBuyClick={() => {}} />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-6 text-yellow-400">Your Cart</h1>
            <p className="text-xl text-gray-400 mb-8">Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsPaymentOpen(true);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header onBuyClick={() => {}} />
      <div className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-8 text-yellow-400">Shopping Cart</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                    <p className="text-yellow-400 text-lg font-bold">{item.price}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-fit sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (0%):</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Total</h3>
                <p className="text-3xl font-black text-yellow-400">{getTotalPrice()}</p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => {
                  clearCart();
                  navigate('/');
                }}
                className="w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
              >
                Continue Shopping
              </button>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  {cart.length} item{cart.length > 1 ? 's' : ''} in cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        price={getTotalPrice()}
      />
    </div>
  );
}
