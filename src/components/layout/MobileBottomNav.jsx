import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Compass, 
  Mail, 
  Settings, 
  HelpCircle, 
  User, 
  Clock, 
  CreditCard, 
  Shield, 
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const [menuWidth, setMenuWidth] = useState(0);
    const [originX, setOriginX] = useState(null);

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

    // Measure menu width and trigger button position to compute a responsive radius
    useEffect(() => {
        const el = menuRef.current;
        if (!el) return;
        const measure = () => {
            const menuRect = el.getBoundingClientRect();
            setMenuWidth(Math.round(menuRect.width || 0));
            const triggerEl = triggerRef.current;
            if (triggerEl) {
                const tRect = triggerEl.getBoundingClientRect();
                // originX is the center X of the trigger relative to the menu container
                setOriginX(Math.round((tRect.left + tRect.width / 2) - menuRect.left));
            } else {
                setOriginX(Math.round(menuRect.width / 2));
            }
        };

        measure();
        const ro = new ResizeObserver(() => measure());
        ro.observe(el);
        // also observe trigger if present
        if (triggerRef.current) ro.observe(triggerRef.current);
        return () => ro.disconnect();
    }, [menuRef, triggerRef]);

    const navItems = [
        { icon: LayoutDashboard, label: "Home", path: "/user/dashboard" },
        { icon: Compass, label: "Explore", path: "/explore" },
        { icon: Mail, label: "Subs", path: "/user/subscriptions" },
        { icon: Settings, label: "Settings", isTrigger: true },
        { icon: HelpCircle, label: "Support", path: "/user/support" },
    ];

    const settingsSubItems = [
        { icon: Shield, label: "Security", path: "/user/settings/security", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
        { icon: CreditCard, label: "Billing", path: "/user/settings/billing", color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
        { icon: Clock, label: "Delivery", path: "/user/settings/delivery", color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
        { icon: User, label: "Profile", path: "/user/settings/profile", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
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
                className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-48px)] max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-full z-50 flex justify-around items-center px-4 py-2 shadow-lg"
            >
                {navItems.map((item, index) => {
                    const isActive = item.path ? location.pathname === item.path : false;
                    const isSettingsActive = location.pathname.startsWith('/user/settings');

                    return (
                        <div key={item.label} className="relative flex justify-center">
                            
                            {/* Sub Menu Items (Only for Settings) */}
                            {/* submenu is rendered at menu container level */}

                            <button
                                ref={item.isTrigger ? triggerRef : null}
                                onClick={() => handleNavClick(item)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[52px] z-50 ${
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

                {/* Submenu rendered once inside the menu container so coordinates match */}
                <AnimatePresence>
                    {isSettingsOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-full mb-2 left-0 w-full h-[140px] pointer-events-none"
                        >
                            {settingsSubItems.map((subItem, i) => {
                                const n = settingsSubItems.length;
                                const base = menuWidth || 320;
                                const radius = Math.max(36, Math.min(64, Math.round(base * 0.14)));
                                const angleStep = Math.PI / (n - 1);
                                const angle = Math.PI - angleStep * i; // left-to-right semicircle
                                const x = Math.round(radius * Math.cos(angle));
                                const y = Math.round(radius * Math.sin(angle));
                                const origin = typeof originX === 'number' ? originX : Math.round((menuWidth || 320) / 2);
                                return (
                                    <motion.button
                                        key={subItem.label}
                                        initial={{ opacity: 0, scale: 0.72, y: 8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.72, y: 8 }}
                                        transition={{ type: 'spring', stiffness: 360, damping: 28, delay: i * 0.04 }}
                                        onClick={() => handleSubItemClick(subItem)}
                                        style={{ position: 'absolute', left: `${origin + x}px`, bottom: `${y}px`, transform: 'translateX(-50%)' }}
                                        className="pointer-events-auto absolute w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform"
                                        aria-label={subItem.label}
                                    >
                                        <div className={`p-1.5 rounded-full ${subItem.color}`}>
                                            <subItem.icon size={18} />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default MobileBottomNav;
