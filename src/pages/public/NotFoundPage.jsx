import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-900 dark:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform scale-150"></div>
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <FileQuestion size={64} className="text-primary" />
          </motion.div>
        </div>
        
        <h1 className="text-8xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Oops! The page you are looking for seems to have wandered off into the digital void.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-bold shadow-lg shadow-primary/25"
          >
            <Home size={18} />
            Home Page
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
