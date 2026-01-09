import { Link } from 'react-router-dom';
import { Mail, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-primary p-1.5 rounded-lg text-white mr-2">
                <Mail size={16} />
              </div>
              <span className="text-lg font-bold text-gray-900">Papertrail</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Follow the trail. Read what matters. Connect directly with your favorite creators.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/explore" className="text-gray-500 hover:text-primary text-sm">Explore</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-primary text-sm">Pricing</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-primary text-sm">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-500 hover:text-primary text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-primary text-sm">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-primary text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Papertrail Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
