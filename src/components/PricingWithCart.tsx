import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PricingWithCart() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState<string[]>([]);

  const plans = [
    {
      id: 'resume-49',
      name: 'Resume Pack',
      price: '₹49',
      description: 'Resume Pack',
      features: [
        '5 professional templates',
        'Edit in Canva',
        'Instant delivery',
        'Lifetime access'
      ],
      cta: 'Add to Cart - ₹49'
    },
    {
      id: 'cover-79',
      name: 'Cover Letter Pack',
      price: '₹79',
      description: 'RECOMMENDED',
      popular: true,
      features: [
        '5 cover letter templates',
        'Matching resume templates',
        'Professional formatting',
        'Instant delivery'
      ],
      cta: 'Add to Cart - ₹79'
    },
    {
      id: 'bundle-99',
      name: 'Premium Bundle',
      price: '₹99',
      description: 'Premium Bundle',
      features: [
        '10 template combinations',
        'Cover letters included',
        'Portfolio template',
        'Lifetime access'
      ],
      cta: 'Add to Cart - ₹99'
    }
  ];

  const handleAddToCart = (plan: typeof plans[0]) => {
    addToCart({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      quantity: 1,
    });
    
    setAddedItems([...addedItems, plan.id]);
    setTimeout(() => {
      setAddedItems(addedItems.filter(id => id !== plan.id));
    }, 2000);
  };

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-4">
          Pick Your <span className="text-yellow-400">Perfect Pack</span>
        </h2>
        <p className="text-center text-gray-400 mb-16">
          Premium templates at unbeatable prices. One-time payment, lifelong access.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative p-8 rounded-lg border transition ${
                plan.popular 
                  ? 'border-yellow-400 bg-yellow-400/10 transform scale-105' 
                  : 'border-gray-800 bg-gray-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    {plan.description}
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-black text-yellow-400 mb-6">
                {isAuthenticated ? plan.price : 'Register to view'}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="text-yellow-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login')
                    return
                  }
                  handleAddToCart(plan)
                }}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  addedItems.includes(plan.id)
                    ? 'bg-green-600 text-white'
                    : plan.popular
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isAuthenticated ? (addedItems.includes(plan.id) ? '✓ Added to Cart' : plan.cta) : 'Register to Add'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
