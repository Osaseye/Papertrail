import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-screen w-full flex-col lg:flex-row font-display bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-50 transition-colors duration-200 overflow-hidden"
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
            Reset &<br />Recover.
          </h2>
          <p className="text-white/80 text-base max-w-sm font-medium">
            Don't worry, it happens to the best of us. We'll help you get back to reading and writing in no time.
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
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-background-light dark:bg-background-dark overflow-y-auto">
        <div className="w-full max-w-[340px] flex flex-col">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-6 text-primary">
            <div className="h-10 w-auto">
              <img src="/logo.png" alt="Papertrail" className="h-full w-auto object-contain" />
            </div>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-[#0d141b] dark:text-white text-2xl font-bold leading-tight">Forgot Password?</h2>
            <p className="text-[#4c739a] dark:text-slate-400 mt-1 text-sm">Enter your email to reset your password.</p>
          </div>

          {!submitted ? (
            <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4" 
                onSubmit={handleSubmit}
            >
            <div className="flex flex-col">
              <label className="text-[#0d141b] dark:text-slate-50 text-xs font-medium leading-normal pb-1.5">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c739a] select-none text-[20px]">mail</span>
                <input 
                    type="email" 
                    placeholder="name@example.com" 
                    required
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 h-10 pl-10 placeholder:text-[#4c739a] text-sm font-normal shadow-none outline-none transition-all"
                />
              </div>
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    <span>Sending Link...</span>
                 </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </motion.form>
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
            >
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check</span>
                </div>
                <h3 className="text-green-800 dark:text-green-300 font-bold mb-2">Check your inbox</h3>
                <p className="text-green-700 dark:text-green-400 text-sm">
                    We've sent a password reset link to your email address. Please follow the instructions to reset your password.
                </p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-green-700 dark:text-green-400 text-xs font-semibold hover:underline"
                >
                    Try another email
                </button>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="flex items-center justify-center gap-2 text-[#4c739a] dark:text-slate-400 text-xs hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
