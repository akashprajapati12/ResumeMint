export default function HowItWorks() {
  const steps = [
    {
      icon: '💳',
      title: 'Pay 1₹1',
      description: 'Make payment securely. Takes less than 60 seconds.'
    },
    {
      icon: '🔗',
      title: 'Get Template Links',
      description: 'Receive premium access to download your templates instantly.'
    },
    {
      icon: '✏️',
      title: 'Edit in Canva',
      description: 'Open, customize, and download your resume in your own style.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">
          How It <span className="text-yellow-400">Works</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
