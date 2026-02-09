import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: string;
}

const UPI_ID = 'akashairmen-1@okicici';
const UPI_NAME = 'ResumeMint';

const upiApps = [
  { name: 'Google Pay', icon: '💚', package: 'com.google.android.apps.nbu.paisa.user', scheme: 'gpay' },
  { name: 'PhonePe', icon: '💜', package: 'com.phonepe.app', scheme: 'phonepe' },
  { name: 'Paytm', icon: '💙', package: 'net.one97.paytm', scheme: 'paytmmp' },
  { name: 'BHIM', icon: '🇮🇳', package: 'in.org.npci.upiapp', scheme: 'upi' },
  { name: 'Amazon Pay', icon: '🧡', package: 'in.amazon.mShop.android.shopping', scheme: 'amazonpay' },
  { name: 'Other UPI App', icon: '📱', package: '', scheme: 'upi' },
];

export default function PaymentModal({ isOpen, onClose, price }: PaymentModalProps) {
  const [view, setView] = useState<'main' | 'upi'>('main');

  if (!isOpen) return null;

  const amount = price.replace('₹', '').trim();

  const handleWhatsApp = () => {
    const message = `Hi! I want to buy the resume template for ${price}. Please provide payment details.`;
    const whatsappLink = `https://wa.me/919334306124?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const handleRazorpay = () => {
    const amountInPaise = parseInt(amount) * 100;
    const options = {
      key: 'rzp_live_SE0NCqZHmW9Mz',
      amount: amountInPaise,
      currency: 'INR',
      name: 'ResumeMint',
      description: 'Resume Templates Purchase',
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        onClose();
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#FACC15',
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert('Failed to load Razorpay. Please try again or use another payment method.');
    }
  };

  const tryDeepLink = (url: string) => {
    // Use a hidden iframe to attempt the deep link without navigating away
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 3000);

    // Also try anchor click as a backup for mobile
    const a = document.createElement('a');
    a.href = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 3000);
  };

  const handleUPIApp = (app: typeof upiApps[number]) => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount}&cu=INR&tn=Resume%20Templates`;

    if (app.package) {
      // Android intent for specific app
      const intentUrl = `intent://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount}&cu=INR&tn=Resume%20Templates#Intent;scheme=upi;package=${app.package};S.browser_fallback_url=${encodeURIComponent('https://play.google.com/store/apps/details?id=' + app.package)};end`;
      tryDeepLink(intentUrl);

      // Fallback: try generic UPI URL after a short delay
      setTimeout(() => {
        tryDeepLink(upiUrl);
      }, 1500);
    } else {
      // Generic UPI — opens system UPI picker
      tryDeepLink(upiUrl);
    }
  };

  const handleClose = () => {
    setView('main');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-gray-800">

        {view === 'main' && (
          <>
            <h2 className="text-2xl font-black mb-2">Choose Payment Method</h2>
            <p className="text-gray-400 mb-6">Price: <span className="text-yellow-400 font-bold">{price}</span></p>

            <div className="space-y-3 mb-6">
              {/* UPI Option */}
              <button
                onClick={() => setView('upi')}
                className="w-full p-4 border border-yellow-400 rounded-lg hover:bg-yellow-400/10 transition flex items-center gap-3 text-left group"
              >
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-bold group-hover:text-yellow-400 transition">UPI Payment</h3>
                  <p className="text-sm text-gray-400">Google Pay, PhonePe, Paytm & more</p>
                </div>
              </button>

              {/* Razorpay Option */}
              <button
                onClick={handleRazorpay}
                className="w-full p-4 border border-yellow-400 rounded-lg hover:bg-yellow-400/10 transition flex items-center gap-3 text-left group"
              >
                <span className="text-2xl">💳</span>
                <div>
                  <h3 className="font-bold group-hover:text-yellow-400 transition">Credit/Debit Card</h3>
                  <p className="text-sm text-gray-400">Razorpay (Secure)</p>
                </div>
              </button>

              {/* WhatsApp Option */}
              <button
                onClick={handleWhatsApp}
                className="w-full p-4 border border-yellow-400 rounded-lg hover:bg-yellow-400/10 transition flex items-center gap-3 text-left group"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-bold group-hover:text-yellow-400 transition">Chat on WhatsApp</h3>
                  <p className="text-sm text-gray-400">Get instant support & payment details</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
          </>
        )}

        {view === 'upi' && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setView('main')} className="text-gray-400 hover:text-white transition text-xl">&larr;</button>
              <h2 className="text-2xl font-black">Choose UPI App</h2>
            </div>
            <p className="text-gray-400 mb-6">Pay <span className="text-yellow-400 font-bold">{price}</span> using your preferred UPI app</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {upiApps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleUPIApp(app)}
                  className="p-4 border border-gray-700 rounded-lg hover:border-yellow-400 hover:bg-yellow-400/10 transition flex flex-col items-center gap-2 group"
                >
                  <span className="text-3xl">{app.icon}</span>
                  <span className="text-sm font-semibold group-hover:text-yellow-400 transition">{app.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-400 text-center">UPI ID: <span className="text-yellow-400 font-mono select-all">{UPI_ID}</span></p>
              <p className="text-xs text-gray-500 text-center mt-1">Copy & pay manually if the app doesn't open</p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
          </>
        )}

      </div>
    </div>
  );
}
