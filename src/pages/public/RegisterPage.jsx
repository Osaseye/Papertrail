import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const { signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    
    // Default to 'user' role for login check, but the context handles redirection logic
    const result = await loginWithGoogle(role === 'Content Creator' ? 'creator' : 'user');
    setLoading(false);

    if (result.success) {
      if (result.isNewUser) {
         // Redirect to onboarding if we couldn't find a role profile
         navigate(role === 'User' ? '/onboarding' : '/creator-onboarding');
      } else if (result.role === 'user') {
        navigate('/user/dashboard');
      } else if (result.role === 'creator') {
        navigate('/creator/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    setError('');
    setLoading(true);

    const result = await signUp(formData.email, formData.password, role, formData.name);

    setLoading(false);
    
    if (result.success) {
      // For now, redirect to dashboard similar to login
      if (role === 'User') {
        navigate('/onboarding');
      } else {
        navigate('/creator-onboarding');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen w-full flex-col lg:flex-row font-display bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-50 transition-colors duration-200 overflow-hidden"
    >
      {/* Left Branding Section (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-12 bg-primary relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-24 right-24 w-56 h-56 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="h-12 w-auto">
              <img src="/logo.png" alt="Papertrail" className="h-full w-auto object-contain brightness-0 invert" />
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-white text-3xl lg:text-4xl font-black leading-tight tracking-tight">
            Start your story,<br />today.
          </h2>
          <p className="text-white/80 text-base max-w-sm font-medium">
            Create an account to access thousands of newsletters or start publishing your own.
          </p>
          <div className="pt-6">
            <div 
              className="aspect-video w-full max-w-sm rounded-lg bg-cover bg-center shadow-xl border border-white/20" 
              data-alt="Modern abstract geometric pattern with blue and white tones" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkNsM82rUbk1EAbWPc6IfKHr36JRcEiUbzOx2S3ZEuLqpB2CXEr420E8dcVtv6DZpsoNmlFo2NcRX_uh8R0_9r5o2soNauvvvvrMuyvNN6EdWnYQgKBfmBwPazmI14XNxI419ggHPq0okKdsA8GHYllOSU92COV4wuvdljcRgk7bz7HA1D8s6tdGEs_9Yt5RhdxXM3lDK3ctYIPYKbEJ1JJvMARCTSJ8IkloHT7GOjg2K44CbKbn2YdICvcdBA-SDOkytY70J0JLgi')" }}
            >
            </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-4 text-white/60 text-xs">
          <span>© 2026 Papertrail Inc.</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col items-center p-6 bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-[340px] flex flex-col my-auto">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6 text-primary">
            <div className="h-10 w-auto">
              <img src="/logo.png" alt="Papertrail" className="h-full w-auto object-contain" />
            </div>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold leading-tight">Create Account</h2>
            <p className="text-[#4c739a] dark:text-slate-400 mt-1 text-sm">Join Papertrail to continue.</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
          <p className="text-[#0d141b] dark:text-slate-50 text-xs font-medium leading-normal mb-2">I want to:</p>
            <div className="flex h-10 w-full bg-[#e7edf3] dark:bg-slate-800 rounded-lg px-2 py-1 relative isolate overflow-hidden">
             <div className="grid grid-cols-2 w-full h-full relative z-20">
                <button
                  type="button"
                  onClick={() => setRole('User')}
                  className={`text-xs font-semibold transition-colors duration-200 whitespace-nowrap ${role === 'User' ? 'text-[#0d141b] dark:text-white' : 'text-[#4c739a] dark:text-slate-400'}`}
                >
                  Read Content
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Content Creator')}
                  className={`text-xs font-semibold transition-colors duration-200 whitespace-nowrap ${role === 'Content Creator' ? 'text-[#0d141b] dark:text-white' : 'text-[#4c739a] dark:text-slate-400'}`}
                >
                  Create Content
                </button>
             </div>
            <motion.div
              className="absolute top-1 bottom-1 bg-white dark:bg-slate-700 rounded-md shadow-sm z-10 will-change-transform"
              initial={false}
              animate={{
                x: role === 'User' ? '0%' : '100%'
              }}
                    style={{ width: '48%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
         </div>

          {/* Form Fields */}
          <AnimatePresence mode="wait">
            <motion.form 
                key={role}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3" 
                onSubmit={handleRegister}
            >
            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium rounded-lg">
                    {error}
                </div>
            )}
            <div className="flex flex-col">
              <label className="text-[#0d141b] dark:text-slate-50 text-xs font-medium leading-normal pb-1.5">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c739a] select-none text-[20px]">person</span>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe" 
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-10 pl-10 placeholder:text-[#4c739a] text-sm font-normal shadow-none outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[#0d141b] dark:text-slate-50 text-xs font-medium leading-normal pb-1.5">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c739a] select-none text-[20px]">mail</span>
                <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com" 
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-10 pl-10 placeholder:text-[#4c739a] text-sm font-normal shadow-none outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[#0d141b] dark:text-slate-50 text-xs font-medium leading-normal pb-1.5">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c739a] select-none text-[20px]">lock</span>
                <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-10 pl-10 pr-10 placeholder:text-[#4c739a] text-sm font-normal shadow-none outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4c739a] hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[#0d141b] dark:text-slate-50 text-xs font-medium leading-normal pb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c739a] select-none text-[20px]">lock_reset</span>
                <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••" 
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-10 pl-10 pr-10 placeholder:text-[#4c739a] text-sm font-normal shadow-none outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4c739a] hover:text-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
            >
              {loading ? (
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    <span>Creating Account...</span>
                 </div>
              ) : (
                'Create Account'
              )}
            </button>
          </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#cfdbe7] dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background-light dark:bg-background-dark px-2 text-[#4c739a] font-medium">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button 
                type="button" 
                onClick={handleGoogleRegister}
                disabled={loading}
                className="flex items-center justify-center gap-2 h-10 px-4 border border-[#cfdbe7] dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-[#0d141b] dark:text-slate-50 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.28.81-.56z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-10 px-4 border border-[#cfdbe7] dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-[#0d141b] dark:text-slate-50 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:border-slate-400">
             <svg className="w-4 h-4 text-[#0d141b] dark:text-white" viewBox="0 0 24 24" fill="currentColor">
               <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 3.94-1.38 1.62.24 2.84 1.18 3.57 2.48-3.56 1.88-2.94 6.72.63 8.16-.69 1.48-1.57 2.46-3.22 2.97zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
             </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#4c739a] dark:text-slate-400 text-xs">
                Already have an account? 
                <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
