import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="flex flex-col items-center">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="relative size-20"
        >
            <img src="/logo.png" alt="Loading" className="size-full object-contain animate-pulse" /> 
        </motion.div>
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex gap-2"
        >
            <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="size-2 bg-primary rounded-full animate-bounce"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;