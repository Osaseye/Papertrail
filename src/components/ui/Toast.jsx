import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }
};

const Toast = ({ id, message, type, duration, removeToast }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, removeToast]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" size={20} />;
            case 'error': return <XCircle className="text-red-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    const getBgColor = () => {
         // Using white background with colored border/accents for cleaner look
         return "bg-white dark:bg-slate-900 border-l-4";
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return "border-green-500";
            case 'error': return "border-red-500";
            case 'warning': return "border-orange-500";
            default: return "border-blue-500";
        }
    };

    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${getBgColor()} ${getBorderColor()} shadow-lg rounded-lg p-4 mb-3 flex items-start gap-3 min-w-[300px] max-w-md pointer-events-auto border border-slate-100 dark:border-slate-800`}
        >
            <div className="shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">{message}</p>
            </div>
            <button 
                onClick={() => removeToast(id)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
