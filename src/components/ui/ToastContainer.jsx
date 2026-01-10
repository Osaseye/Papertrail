import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-24 right-6 z-[100] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} removeToast={removeToast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
