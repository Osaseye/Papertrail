import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  User,
  CreditCard,
  Shield,
  Edit3,
  Moon,
  Sun
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CreatorSidebar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const logout = auth?.logout || (() => console.log("Logout clicked"));
  const user = auth?.user || { name: "Creator", email: "creator@papertrail.com" };
  const { theme, toggleTheme } = useTheme();

  const [brandData, setBrandData] = useState({ name: user.name, avatar: user.photoURL || user.avatar });

  // Fetch Brand Info instead of personal
  useEffect(() => {
    const fetchBrand = async () => {
        if (!user?.id) return;
        try {
            const brandDoc = await getDoc(doc(db, 'creator-brands', user.id));
            if (brandDoc.exists()) {
                const data = brandDoc.data();
                setBrandData({
                    name: data.brandName || data.name || user.displayName,
                    avatar: data.avatar || user.photoURL
                });
            }
        } catch (error) {
            console.error("Error fetching creator brand:", error);
        }
    };
    fetchBrand();
  }, [user]);

  // State to track if the settings menu is expanded
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Auto-expand settings if we are on a settings page
  useEffect(() => {
    if (location.pathname.startsWith('/creator/settings')) {
      setIsSettingsExpanded(true);
    }
  }, [location.pathname]);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/creator/dashboard" },
    { icon: FileText, label: "Newsletters", path: "/creator/newsletters" },
    { icon: Edit3, label: "Editor", path: "/creator/editor" },
    { icon: Users, label: "Subscribers", path: "/creator/subscribers" },
  ];

  const getSubItemPath = (tab) => `/creator/settings?tab=${tab}`;
  
  const settingsSubItems = [
    { icon: User, label: "Profile", tab: "profile" },
    { icon: CreditCard, label: "Subscription", tab: "subscription" },
    { icon: Shield, label: "Security", tab: "security" },
  ];

  const handleSettingsClick = () => {
    if (isCollapsed) {
        toggleSidebar();
        setIsSettingsExpanded(true);
    } else {
        setIsSettingsExpanded(!isSettingsExpanded);
    }
  };

  const isSettingsActive = location.pathname.startsWith('/creator/settings');
  const currentTab = new URLSearchParams(location.search).get('tab') || 'profile';

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col relative z-50 shrink-0 select-none sticky top-0"
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
             <img src="/icon.png" alt="P" className="w-10 h-10 object-contain" />
        ) : (
             <img 
               src="/logo.png" 
               alt="Papertrail" 
               className="h-8 object-contain dark:[filter:brightness(0)_saturate(100%)_invert(31%)_sepia(85%)_saturate(3033%)_hue-rotate(212deg)_brightness(96%)_contrast(92%)]" 
             />
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
                             const isSubActive = isSettingsActive && currentTab === subItem.tab;
                             return (
                                <button
                                    key={subItem.label}
                                    onClick={() => navigate(getSubItemPath(subItem.tab))} 
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

        {/* Support Item */}
         <button
            onClick={() => navigate('/creator/support')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full group ${
                location.pathname === '/creator/support'
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
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer mb-2 ${isCollapsed ? 'justify-center' : ''}`}>
           {brandData.avatar ? (
            <div 
             className="bg-center bg-no-repeat bg-cover rounded-full h-9 w-9 shrink-0 ring-2 ring-slate-100 dark:ring-slate-700" 
             style={{ backgroundImage: `url("${brandData.avatar}")` }}
            />
          ) : (
           <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
            {brandData.name ? brandData.name.charAt(0) : 'C'}
          </div>
          )}
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden text-left">
              <p className="text-slate-900 dark:text-white text-xs font-bold truncate">{brandData.name}</p>
              <p className="text-slate-500 text-[10px] truncate">Creator Account</p>
            </div>
          )}
        </div>
        
        <button 
           onClick={logout}
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

export default CreatorSidebar;
