import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Clock, X } from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose, notifications, markRead, markAllRead }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[500px]"
                    >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={markAllRead} 
                                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Mark all read
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-300 dark:text-slate-600">
                                        <Bell size={20} />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">All caught up!</p>
                                    <p className="text-xs text-slate-500 mt-1">Check back later for new updates.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group ${notif.read ? 'opacity-60' : 'bg-blue-50/30 dark:bg-blue-900/10'}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="shrink-0 mt-1">
                                                     <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                        {notif.icon || <Bell size={14} />}
                                                     </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-900 dark:text-white leading-snug mb-1">
                                                        <span className="font-bold">{notif.title}</span> {notif.message}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <Clock size={10} /> {notif.time}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <div className="shrink-0 self-center">
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
