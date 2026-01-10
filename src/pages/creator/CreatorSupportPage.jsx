import React, { useState } from 'react';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import { Mail, MessageCircle, FileQuestion } from 'lucide-react';

const CreatorSupportPage = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
            <CreatorSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-32 md:pb-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <FileQuestion size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">FAQs</h3>
                                    <p className="text-sm text-slate-500">Find answers to common questions</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                    <MessageCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Live Chat</h3>
                                    <p className="text-sm text-slate-500">Chat with our support team</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                    <p className="text-sm text-slate-500">Get help via email</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                            <h2 className="text-lg font-bold mb-6">Send us a message</h2>
                            <form className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Subject</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Message</label>
                                    <textarea 
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50 h-32"
                                        placeholder="Describe your issue..."
                                    ></textarea>
                                </div>
                                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
                <CreatorMobileBottomNav />
            </div>
        </div>
    );
};

export default CreatorSupportPage;
