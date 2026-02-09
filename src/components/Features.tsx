export default function Features() {
  const features = [
    {
      icon: '📄',
      title: 'Editable in Canva',
      description: 'No software needed – open, edit, download. Free edits after purchase.'
    },
    {
      icon: '✓',
      title: 'ATS-Friendly',
      description: 'Clean formats that pass Applicant Tracking Systems used by recruiters.'
    },
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'Get your templates within minutes of payment. No waiting periods.'
    },
    {
      icon: '📱',
      title: 'Works on Mobile',
      description: 'Edit directly from your phone using the Canva app!'
    }
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">
          What You Get
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 p-8 rounded-lg hover:border-yellow-400 transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
