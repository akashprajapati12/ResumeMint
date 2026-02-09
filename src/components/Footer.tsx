export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">ResumeMint</h3>
            <p className="text-gray-400">Professional resume templates for students and freshers.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition">Templates</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Features</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ResumeMint. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
