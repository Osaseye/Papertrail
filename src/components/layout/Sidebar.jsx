import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Compass, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
  Clock,
  CreditCard,
  Shield,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [displayAvatar, setDisplayAvatar] = useState(user?.photoURL || '');

  useEffect(() => {
      const fetchProfile = async () => {
          if (!user) return;
          // Default to Auth info
          setDisplayName(user.displayName || 'User');
          setDisplayAvatar(user.photoURL || '');

          try {
              // Priority: User Profile (Readers) -> Creator Profile (Creators)
              const userDocRef = doc(db, 'users', user.uid);
              const userSnap = await getDoc(userDocRef);
              
              if (userSnap.exists()) {
                  const data = userSnap.data();
                  if (data.fullName || data.firstName) {
                      setDisplayName(data.fullName || `${data.firstName} ${data.lastName}`);
                  }
                  if (data.avatar || data.photoURL) {
                      setDisplayAvatar(data.avatar || data.photoURL); 
                  }
                  return;
              }

              // Fallback to Creator Profile if no User profile
              const creatorDocRef = doc(db, 'creators', user.uid);
              const creatorSnap = await getDoc(creatorDocRef);
              if (creatorSnap.exists()) {
                  const data = creatorSnap.data();
                  if (data.fullName) setDisplayName(data.fullName);
                  if (data.personalPhoto) setDisplayAvatar(data.personalPhoto);
              }

          } catch (error) {
              console.error("Sidebar profile fetch error", error);
          }
      };

      fetchProfile();
  }, [user]);

  // State to track if the settings menu is expanded
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Auto-expand settings if we are on a settings page
  useEffect(() => {
    if (location.pathname.startsWith('/user/settings')) {
      setIsSettingsExpanded(true);
    }
  }, [location.pathname]);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Mail, label: "Subscriptions", path: "/user/subscriptions" },
  ];

  const settingsSubItems = [
    { icon: User, label: "Profile", path: "/user/settings/profile" },
    { icon: Clock, label: "Delivery", path: "/user/settings/delivery" },
    { icon: CreditCard, label: "Billing", path: "/user/settings/billing" },
    { icon: Shield, label: "Security", path: "/user/settings/security" },
  ];

  const handleSettingsClick = () => {
    if (isCollapsed) {
        toggleSidebar();
        setIsSettingsExpanded(true);
    } else {
        setIsSettingsExpanded(!isSettingsExpanded);
    }
  };

  const isSettingsActive = location.pathname.startsWith('/user/settings');

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex h-screen bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex-col relative z-20 shrink-0 select-none"
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-500 hover:text-primary transition-colors shadow-sm z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div className={`p-6 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} h-20`}>
        {isCollapsed ? (
             <img src="/icon.png" alt="Papertrail" className="w-10 h-10 object-contain" />
        ) : (
             <img src="/logo.png" alt="Papertrail" className="h-8 object-contain" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full group ${
                    isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
                title={isCollapsed ? item.label : ''}
            >
              <item.icon size={20} className={`shrink-0 ${isActive ? 'fill-primary/20' : ''}`} />
              
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-semibold whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}

        {/* Settings Item with Submenu */}
        <div className="flex flex-col gap-1">
            <button
                onClick={handleSettingsClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full group justify-between ${
                    isSettingsActive 
                    ? 'text-primary'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
                }`}
                title={isCollapsed ? "Settings" : ''}
            >
                <div className="flex items-center gap-3">
                    <Settings size={20} className={`shrink-0 ${isSettingsActive ? '' : ''}`} />
                    {!isCollapsed && (
                        <span className="text-sm font-semibold whitespace-nowrap">Settings</span>
                    )}
                </div>
                {!isCollapsed && (
                     <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${isSettingsExpanded ? 'rotate-180' : ''}`}
                     />
                )}
            </button>

            {/* Sub Items */}
            <AnimatePresence>
                {isSettingsExpanded && !isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col gap-1 ml-4 border-l border-slate-200 dark:border-slate-800 pl-2"
                    >
                        {settingsSubItems.map((subItem) => {
                             const isSubActive = location.pathname === subItem.path;
                             return (
                                <button
                                    key={subItem.label}
                                    onClick={() => navigate(subItem.path)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all w-full group ${
                                        isSubActive 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
                                    }`}
                                >
                                    <subItem.icon size={16} className="shrink-0" />
                                    <span className="text-xs font-medium whitespace-nowrap">{subItem.label}</span>
                                </button>
                             );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

         <button
            onClick={() => navigate('/user/support')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full group ${
                location.pathname === '/user/support'
                ? 'bg-primary/10 text-primary' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
            }`}
        >
              <HelpCircle size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-semibold whitespace-nowrap">Support</span>
              )}
        </button>

      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer mb-2 ${isCollapsed ? 'justify-center' : ''}`}>
          {displayAvatar ? (
            <div 
             className="bg-center bg-no-repeat bg-cover rounded-full h-9 w-9 shrink-0 ring-2 ring-slate-100 dark:ring-slate-700" 
             style={{ backgroundImage: `url("${displayAvatar}")` }}
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-slate-100 dark:ring-slate-700 text-primary font-bold text-xs">
                 {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <p className="text-slate-900 dark:text-white text-xs font-bold truncate">{displayName}</p>
              <p className="text-slate-500 text-[10px] truncate">{user?.email}</p>
            </div>
          )}
        </div>
        
        <button 
           onClick={() => {
             logout();
             navigate('/login');
           }}
           className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 ${isCollapsed ? 'justify-center' : ''}`}
           title="Logout"
        >
           <LogOut size={18} className="shrink-0" />
           {!isCollapsed && <span className="text-xs font-bold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
