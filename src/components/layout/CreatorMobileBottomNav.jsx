import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Edit3, 
  HelpCircle, 
  User, 
  CreditCard, 
  Shield, 
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreatorMobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Safe destructure
    const auth = useAuth();
    const logout = auth?.logout || (() => console.log("Logout clicked"));

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: "Home", path: "/creator/dashboard" },
        { icon: FileText, label: "Newsletters", path: "/creator/newsletters" },
        { icon: Edit3, label: "Editor", path: "/creator/editor" },
        { icon: Settings, label: "Menu", isTrigger: true },
        { icon: Users, label: "People", path: "/creator/subscribers" }, 
    ];

    const settingsSubItems = [
        { icon: User, label: "Profile", path: "/creator/settings?tab=profile", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
        { icon: CreditCard, label: "Subscription", path: "/creator/settings?tab=subscription", color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
        { icon: Shield, label: "Security", path: "/creator/settings?tab=security", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
        { icon: HelpCircle, label: "Support", path: "/creator/support", color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
        { icon: LogOut, label: "Logout", action: "logout", color: "text-red-500 bg-red-50 dark:bg-red-900/10" },
    ];

    const handleNavClick = (item) => {
        if (item.isTrigger) {
            setIsSettingsOpen(!isSettingsOpen);
        } else {
            setIsSettingsOpen(false);
            navigate(item.path);
        }
    };

    const handleSubItemClick = (item) => {
        setIsSettingsOpen(false);
        if (item.action === 'logout') {
            logout();
            navigate('/login');
        } else {
            navigate(item.path);
        }
    };

    return (
        <>
            {/* Overlay to dim background when menu is open */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSettingsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <div 
                ref={menuRef}
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50 flex justify-around items-center px-2 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
            >
                {navItems.map((item, index) => {
                    const isActive = item.path ? location.pathname === item.path : false;
                    const isSettingsActive = 
                        location.pathname.startsWith('/creator/settings') || 
                        location.pathname.startsWith('/creator/support');

                    return (
                        <div key={item.label} className="relative flex justify-center">
                            
                            {/* Sub Menu Items (Only for Settings) */}
                            {item.isTrigger && (
                                <AnimatePresence>
                                    {isSettingsOpen && (
                                        <div className="absolute bottom-full mb-4 flex flex-col items-center gap-3 w-max right-0 transform translate-x-1/4"> 
                                            {/* Adjusted positioning to keep it on screen if it's the last item */}
                                            {settingsSubItems.map((subItem, i) => (
                                                <motion.button
                                                    key={subItem.label}
                                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    onClick={() => handleSubItemClick(subItem)}
                                                    className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform"
                                                >
                                                    <span className={`text-xs font-bold whitespace-nowrap ${subItem.action === 'logout' ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                                        {subItem.label}
                                                    </span>
                                                    <div className={`p-1.5 rounded-full ${subItem.color}`}>
                                                        <subItem.icon size={16} />
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            )}

                            <button
                                onClick={() => handleNavClick(item)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[64px] z-50 ${
                                    (isActive || (item.isTrigger && isSettingsActive))
                                    ? 'text-primary' 
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            >
                                <div className="relative">
                                    {item.isTrigger && isSettingsOpen ? (
                                        <motion.div
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                           <X size={22} className="text-slate-900 dark:text-white" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            className="relative"
                                        >
                                            <item.icon size={22} className={(isActive || (item.isTrigger && isSettingsActive)) ? 'fill-primary/20' : ''} />
                                            {item.isTrigger && isSettingsActive && !isSettingsOpen && (
                                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900" />
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.isTrigger && isSettingsOpen ? 'Close' : item.label}</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default CreatorMobileBottomNav;
