export default function Benefits() {
  const benefits = [
    {
      icon: '🎓',
      title: 'Made for Students',
      description: 'Specifically designed for Indian college students & freshers'
    },
    {
      icon: '💰',
      title: 'Affordable',
      description: 'Just ₹49 – less than your coffee this month'
    },
    {
      icon: '⚡',
      title: 'Instant Support',
      description: 'Get responses to your queries within 24 hours'
    },
    {
      icon: '🤝',
      title: 'Trusted by Students',
      description: 'Interviews with 100s of students using our templates'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">
          Why <span className="text-yellow-400">ResumeMint</span>?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="text-4xl flex-shrink-0">{benefit.icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
