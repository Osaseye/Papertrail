import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, PenTool } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'creator' ? 'creator' : 'user';
  const [role, setRole] = useState(initialRole);
  
  const { loginAsUser, loginAsCreator } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (role === 'creator') {
        loginAsCreator();
        navigate('/creator/dashboard');
    } else {
        loginAsUser();
        navigate('/user/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Role Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button
                    onClick={() => setRole('user')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center transition-all ${
                        role === 'user' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                   <User size={16} className="mr-2"/> Join as Reader
                </button>
                <button
                    onClick={() => setRole('creator')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center transition-all ${
                        role === 'creator' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <PenTool size={16} className="mr-2"/> Join as Creator
                </button>
            </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {role === 'creator' && (
                <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Publication Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PenTool className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    id="brand"
                    name="brand"
                    type="text"
                    required
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                    placeholder="My Awesome Newsletter"
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">You can change this later.</p>
                </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Account (Dev Mode: Auto Login)
              </button>
            </div>
          </form>
           <p className="mt-6 text-xs text-center text-gray-500">
               By continuing, you agree to Papertrail's Terms of Service and Privacy Policy.
           </p>
        </div>
      </div>
    </div>
  );
}
