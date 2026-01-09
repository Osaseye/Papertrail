import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Papertrail" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">Papertrail</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-gray-600 hover:text-primary transition-colors">
              Explore
            </Link>
            
            {!user ? (
              <>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">
                  Pricing
                </Link>
                <div className="flex items-center space-x-4 ml-4">
                  <Link to="/login" className="text-gray-900 hover:text-primary font-medium">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                {user.role === 'creator' && (
                  <Link to="/creator/dashboard" className="text-gray-600 hover:text-primary">
                    Creator Dashboard
                  </Link>
                )}
                {user.role === 'user' && (
                  <Link to="/user/dashboard" className="text-gray-600 hover:text-primary">
                    My Feed
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!user ? (
              <>
                <Link
                  to="/explore"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Explore
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary font-medium hover:bg-blue-50 rounded-md"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                 <Link
                  to={user.role === 'creator' ? "/creator/dashboard" : "/user/dashboard"}
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
