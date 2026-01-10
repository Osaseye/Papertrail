import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Send, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SupportPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        subject: '',
        category: 'general',
        message: '',
        priority: 'normal'
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        console.log('Support ticket submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ subject: '', category: 'general', message: '', priority: 'normal' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex h-screen bg-background-light dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
            <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-8">
                        
                        {/* Header */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support & Help</h1>
                            <p className="text-slate-500 dark:text-slate-400">Have an issue? We're here to help. Send us a message below.</p>
                        </div>

                        {/* Support Form */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                            {isSubmitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12 space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
                                    <p className="text-slate-500">We've received your request and will get back to you shortly.</p>
                                    <button 
                                        onClick={() => setIsSubmitted(false)}
                                        className="mt-4 text-primary font-medium hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
                                            <input 
                                                type="text" 
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="Brief summary of the issue"
                                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                                            <select 
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            >
                                                <option value="general">General Inquiry</option>
                                                <option value="technical">Technical Issue</option>
                                                <option value="billing">Billing & Subscription</option>
                                                <option value="feedback">Feature Request / Feedback</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Priority</label>
                                        <div className="flex gap-4">
                                            {['low', 'normal', 'high', 'urgent'].map((p) => (
                                                <label key={p} className="flex items-center gap-2 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="priority"
                                                        value={p}
                                                        checked={formData.priority === p}
                                                        onChange={handleChange}
                                                        className="accent-primary"
                                                    />
                                                    <span className="capitalize text-sm text-slate-600 dark:text-slate-400">{p}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="6"
                                            placeholder="Please describe your issue in detail..."
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button 
                                            type="submit"
                                            className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/40"
                                        >
                                            <Send size={18} />
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* FAQ Quick Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors cursor-pointer group">
                                <MessageSquare className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Community Forum</h3>
                                <p className="text-xs text-slate-500">Connect with other users and find answers.</p>
                            </div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors cursor-pointer group">
                                <AlertCircle className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Report a Bug</h3>
                                <p className="text-xs text-slate-500">Found something broken? Let us know.</p>
                            </div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors cursor-pointer group">
                                <Send className="text-green-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email Support</h3>
                                <p className="text-xs text-slate-500">Directly email our support team.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <MobileBottomNav />
            </main>
        </div>
    );
};

export default SupportPage;
