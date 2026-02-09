import { useState } from 'react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is Canva?',
      answer: 'Canva is a free design platform where you can edit templates easily. No design skills needed – just drag, drop, and customize!'
    },
    {
      question: 'How will I receive the templates?',
      answer: 'You\'ll receive instant download links after payment. All templates are ready to customize in Canva.'
    },
    {
      question: 'Can I edit on my phone?',
      answer: 'Yes! Download the Canva app on your phone and edit your resume anytime, anywhere.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer 7 days money-back guarantee if you\'re not satisfied with the templates.'
    },
    {
      question: 'Can these resumes get me shortlisted?',
      answer: 'Our templates are ATS-friendly and professionally designed to help you stand out to recruiters.'
    },
    {
      question: 'I have no experience. Will these work for me?',
      answer: 'Absolutely! Our templates are perfect for freshers. They help you present your skills, projects, and achievements in the best way.'
    }
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-4">
          Frequently Asked <span className="text-yellow-400">Questions</span>
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 text-left font-semibold flex items-center justify-between hover:bg-gray-900/50 transition"
              >
                {faq.question}
                <span className={`text-yellow-400 transition ${openIdx === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {openIdx === idx && (
                <div className="px-6 pb-6 text-gray-400 border-t border-gray-800">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
