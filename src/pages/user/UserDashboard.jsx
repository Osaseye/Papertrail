import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import NotificationDropdown from '../../components/ui/NotificationDropdown';
import { 
  Search, 
  Bell, 
  Rss, 
  Clock, 
  Mail, 
  ChevronRight, 
  Filter, 
  MoreVertical,
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Bookmark,
  X,
  Check,
  FileText, // Added
  CheckCircle, // Added
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Notifications
const DUMMY_NOTIFICATIONS = [
  { id: 1, title: "New Issue", message: "TechCrunch saved a new issue.", time: "2m ago", read: false, icon: <FileText size={14} /> },
  { id: 2, title: "Subscription Active", message: "Your plan was renewed.", time: "1h ago", read: false, icon: <CheckCircle size={14} /> },
  { id: 3, title: "Welcome!", message: "Thanks for joining Papertrail.", time: "1d ago", read: true, icon: <Mail size={14} /> },
];

// Mock Data for Feed Items
const FEED_ITEMS = [
  {
    id: 1,
    title: "Marcus Aurelius on Resilience and Mental Strength",
    source: "The Daily Stoic",
    time: "20m ago",
    readTime: "5 min read",
    excerpt: "In today's edition, we explore the Meditations and how to apply ancient wisdom to modern digital stressors. The key is in our perspective...",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpzL9GxLeAAUfR_YFySI8lvT46RPL7o2Oh_jR399Akvmzl4kf76oUvQ_QhY0dBeN9Wu_dJ9fKepB3RFj5khaZzyIO3Ygxc1-Ypy7moY1nsoO-88VjG4eMzRaA04D9Hs8gnyPitO0fAbUMpAaVse77i30Ry6OZy6OlAtZHIs-I8Fn7HXUjG6XyM5CoaIelG-2Nncbl4I_fUfyWIjBPpp0t-2JP5KwnUQDzDH2EUjRKjBv__VtxY5wIT4bFz4wkKU1ctT5_KLtOEStmy",
    category: "Philosophy",
    isNew: true,
    isRead: false,
    content: `
      <p class="mb-4">It is a truth universally acknowledged that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
      <h3 class="text-xl font-bold my-4">The Discipline of Perception</h3>
      <p class="mb-4">"Choose not to be harmed and you won't feel harmed. Don't feel harmed and you haven't been."</p>
      <p class="mb-4">This famous quote from Marcus Aurelius reminds us that our experience of the world is largely interpreted through our own lens. In the modern age, where digital notifications constantly demand our attention, this stoic principle is more relevant than ever.</p>
    `
  },
  {
    id: 2,
    title: "SpaceX's New Launch & Apple's Surprise Announcement",
    source: "TLDR Newsletter",
    time: "4h ago",
    readTime: "3 min read",
    excerpt: "Catch up on the latest in tech, science, and coding. We've curated the top 5 stories you missed while you were sleeping...",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnidYvlsiefQpWZCYU9ub8yZGFItQiSW7lvEz_JD2z_BQnDwiu0RDrFkhhgg9mRq4J-uvr8_kdEad_SYd886EJ20VxmMzOVh3QME4dmL0aB1MkcPRtCxckpoSKt6TGY-r5cMGH2araP4SlJLHbwy-HH7UwM1XNDonO42X1BRDuGYPhW4vFKu2kIkPDNb-Z_ZoD0q9NbO4KAvyJzgXZ7DEmq1r8sAQoCl83R1h0YfCVzXnP9jlrVcvkjncXqJ4iWq74zMxrwZ9Txgmy",
    category: "Tech",
    isRead: true,
    isNew: false,
    content: "Content placeholder..."
  },
  {
    id: 3,
    title: "The problem with 'best'",
    source: "Seth's Blog",
    time: "6h ago",
    readTime: "2 min read",
    excerpt: "When we seek the best, we often ignore the context. What's best for a marathon runner isn't best for someone learning to walk...",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFxYdpUqhITZLo5WoWjXZ5vRaKTeu0DFZ6WkijiO5b7Db7_T3IE5rlErW6rY_gLMi-wIRSNyXM-BaUkF8O42kO1OhonoEHFSx9EFd9AYr1rVNPKATKJ9Hvy2yRdpkNd0gNSQDCSZVKyC_FQwzcNH5kapUkpKAaZXPUFX_2Td0IVQMJSKNnMahjCG2xHN7yAgznkxD2SVDMidesLxsD98dkRLsiTpzHzIR4XIZ0MgJjeqE72hH9aJpbxWLB6pZH6c4HPR92yaspYMhJ",
    category: "Marketing",
    isNew: false,
    isRead: false,
    content: "Content placeholder..."
  }
];

const UserDashboard = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'reading'
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const [readingItem, setReadingItem] = useState(null);
  
  // Interaction States
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unread' | 'source'
  const [filterSource, setFilterSource] = useState(null);
  const [manageMode, setManageMode] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);

  // Notification Handlers
  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const handleRead = (item) => {
    setReadingItem(item);
    setView('reading');
  };

  const handleBackToDash = () => {
    setView('dashboard');
    setReadingItem(null);
  };

  const toggleUnreadFilter = () => {
    if (filterMode === 'unread') {
      setFilterMode('all');
    } else {
      setFilterMode('unread');
      setFilterSource(null);
    }
  };

  const handleSourceClick = (sourceName) => {
    if (manageMode) return; // Don't filter if in manage mode
    setFilterSource(sourceName);
    setFilterMode('source');
  };

  const clearFilters = () => {
    setFilterMode('all');
    setFilterSource(null);
  };

  // Filter Logic
  const filteredItems = FEED_ITEMS.filter(item => {
    if (filterMode === 'unread') return !item.isRead;
    if (filterMode === 'source') return item.source === filterSource;
    return true;
  });

  const unreadCount = FEED_ITEMS.filter(i => !i.isRead).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Sidebar Component */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900 z-10 shrink-0 h-16">
          <div className="flex items-center gap-4">
             {view === 'reading' && (
                <button 
                  onClick={handleBackToDash}
                  className="mr-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
             )}
             {view === 'reading' ? (
                <h2 className="text-base font-bold">Reader View</h2>
             ) : (
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back, Alex</h1>
             )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-64 transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <Search size={16} className="text-slate-400" />
              <input 
                className="w-full bg-transparent border-none outline-none text-xs px-2 placeholder:text-slate-400 text-slate-900 dark:text-white" 
                placeholder="Search..." 
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Bell size={18} className="text-slate-700 dark:text-slate-300" />
                {unreadNotifs > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-800"></span>}
              </button>

              <NotificationDropdown 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                markRead={handleMarkRead}
                markAllRead={handleMarkAllRead}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32 md:pb-8">
            <AnimatePresence mode="wait">
                
                {/* DASHBOARD VIEW */}
                {view === 'dashboard' && (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-5xl mx-auto w-full flex flex-col gap-6"
                    >

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Rss size={64} />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Subscriptions</p>
                                    <Rss size={16} className="text-primary" />
                                </div>
                                <p className="text-2xl font-bold leading-tight relative z-10">24</p>
                                <p className="text-green-600 text-[10px] font-bold relative z-10">+2 this month</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Clock size={64} />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Next</p>
                                    <Clock size={16} className="text-orange-500" />
                                </div>
                                <p className="text-2xl font-bold leading-tight relative z-10">2h 15m</p>
                                <p className="text-slate-500 text-[10px] relative z-10">The Daily Stoic</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Mail size={64} />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Unread</p>
                                    <Mail size={16} className="text-red-500" />
                                </div>
                                <p className="text-2xl font-bold leading-tight relative z-10">{unreadCount} New</p>
                                <button 
                                    onClick={toggleUnreadFilter}
                                    className="text-primary text-[10px] font-bold relative z-10 cursor-pointer hover:underline text-left"
                                >
                                    {filterMode === 'unread' ? 'Show all' : 'View all unread'}
                                </button>
                            </div>
                        </div>

                        {/* Main Grid: Trails & Activity */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            
                            {/* ACTIVE TRAILS */}
                            <div className="xl:col-span-1 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-1">
                                    <h2 className="text-base font-bold">Active Trails</h2>
                                    <button 
                                        onClick={() => setManageMode(!manageMode)}
                                        className="text-primary text-xs font-bold hover:underline"
                                    >
                                        {manageMode ? 'Done' : 'Manage'}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { name: "Morning Brew", freq: "Daily", next: "Tomorrow, 8 AM", bg: "bg-blue-100 text-blue-700", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkfHu8oqzlczJLaKAbuwmJML3AQCyMJpytrta927FqHiPsgVu8FgOpfXDAEA71mjA9n_wDsX1D8KPSE5-xhNb2V4-Ri0XS3dn-yhkcFumkCv1PzDjrdFaa9E7GQHEn3Uqp4DSvQdurjPpU7Zpnm3_qgTK8fFzsIh_61KjpaxINPNbYj782zXUZeg92I9WyI9UpdP1nl8zCUMFPuHV_pzbHm2N42XXgQ2UHzG4q3JM0_Q_m7vUvo2DW3Wydd-91ZyqStUh1ihI7Cn7o" },
                                        { name: "The Pragmatic Engineer", freq: "Weekly", next: "Fri, 1 PM", bg: "bg-purple-100 text-purple-700", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUXpYikRqKonC6uvHvJLNRB0_S0JMz-sCrUf2gbfzMebiQo9UovVtRfRmQmDqtNL_Qdmxwr-4CTZC9OesUbjwM4Te2rwWB3B5kG8CfLkSTLykvrltchh9oceO6Hb5fEldklEIC5vUs0P2wuzAUSMaBwKwAiqFvhWMA98mmGSyrFI5iBk-OCCyoZHe2lYD_1I3WdJCH49fV-gjgaUoBRqvpqzc_8hPvE-Nd3oVjfXS0HmzQ4b1W7YguL1drisRc1OsCfAreryoKU_Ku" },
                                        { name: "The Daily Stoic", freq: "Daily", next: "2h 15m", bg: "bg-slate-100 text-slate-700", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpzL9GxLeAAUfR_YFySI8lvT46RPL7o2Oh_jR399Akvmzl4kf76oUvQ_QhY0dBeN9Wu_dJ9fKepB3RFj5khaZzyIO3Ygxc1-Ypy7moY1nsoO-88VjG4eMzRaA04D9Hs8gnyPitO0fAbUMpAaVse77i30Ry6OZy6OlAtZHIs-I8Fn7HXUjG6XyM5CoaIelG-2Nncbl4I_fUfyWIjBPpp0t-2JP5KwnUQDzDH2EUjRKjBv__VtxY5wIT4bFz4wkKU1ctT5_KLtOEStmy" },
                                        { name: "Creative Mornings", freq: "Monthly", next: "Oct 15th", bg: "bg-orange-100 text-orange-700", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA47BjnhgstS2cjrD4BsL3wS_cqK1Xj0RQFJ3FC2RmWGvWaGSto83Jjh0dEcghSgewudfy0SOYFlPvCnhcBzeNTsWFzERXa6x0lDRQ9xC_FctAu-Ef-Sn40RsFfgEdZ5Fv1Urmy33WKRbnMu8qA8W7hBk4co8_XceEIONqlWSxXP_hzM4tvb6hUKah3KHc-ny7bL01Vbs3epPghgt1tDe4kyQ0AFYXQyA2zn5iKERKaAFj9RZXXjclYT-F7ysyWAxpXjYztUxRu_Bd1" }
                                    ].map((trail, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => handleSourceClick(trail.name)}
                                            className={`bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3 hover:border-primary/50 transition-all cursor-pointer group ${filterSource === trail.name ? 'ring-2 ring-primary border-transparent' : ''}`}
                                        >
                                            <div 
                                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-10 shrink-0 group-hover:scale-105 transition-transform" 
                                                style={{ backgroundImage: `url("${trail.img}")` }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white group-hover:text-primary transition-colors">{trail.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${trail.bg}`}>{trail.freq}</span>
                                                    <p className="text-slate-500 text-[10px]">{trail.next}</p>
                                                </div>
                                            </div>
                                            {manageMode ? (
                                                <button className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                    <X size={14} />
                                                </button>
                                            ) : (
                                                <ChevronRight className="text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors" size={16} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RECENT ACTIVITY (FEED) */}
                            <div className="xl:col-span-2 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base font-bold">Recent Activity</h2>
                                        {(filterMode !== 'all' || filterSource) && (
                                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-100 hover:text-red-600 transition-colors" onClick={clearFilters}>
                                                {filterMode === 'unread' ? 'Unread Only' : filterSource}
                                                <X size={10} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-1 relative">
                                        <button 
                                            onClick={toggleUnreadFilter}
                                            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${filterMode === 'unread' ? 'text-primary bg-primary/5' : 'text-slate-500'}`}
                                            title="Filter Unread"
                                        >
                                            <Filter size={16} />
                                        </button>
                                        <div className="relative">
                                            <button 
                                                onClick={() => setShowActivityMenu(!showActivityMenu)}
                                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {showActivityMenu && (
                                                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg py-1 z-20">
                                                    <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Mark all read</button>
                                                    <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">Refresh feed</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {filteredItems.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400 text-sm bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                            No items found matching your filter.
                                            <br />
                                            <button onClick={clearFilters} className="text-primary hover:underline mt-2 font-bold">Clear Filters</button>
                                        </div>
                                    ) : (
                                        filteredItems.map((item) => (
                                            <div 
                                                key={item.id}
                                                className={`bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative group overflow-hidden transition-all hover:shadow-md ${item.isRead ? 'opacity-70 bg-slate-50' : ''}`}
                                            >
                                                {!item.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                                
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-6 rounded-full bg-center bg-cover border border-slate-100 dark:border-slate-700" style={{ backgroundImage: `url("${item.avatar}")` }}></div>
                                                        <div>
                                                            {!item.isRead && <p className="text-[9px] font-bold text-primary tracking-wider mb-0.5 leading-none">NEW</p>}
                                                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-none">{item.source}</h5>
                                                        </div>
                                                    </div>
                                                    <span className="text-slate-400 text-[10px] font-medium">{item.time}</span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleRead(item)}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">
                                                    {item.excerpt}
                                                </p>

                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => handleRead(item)}
                                                        className="bg-primary hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
                                                    >
                                                        {item.isRead ? 'Read Again' : 'Read Now'}
                                                    </button>
                                                    {!item.isRead && (
                                                        <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* READER VIEW */}
                {view === 'reading' && readingItem && (
                    <motion.div
                        key="reader"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-900 min-h-[calc(100vh-120px)] rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800 relative"
                    >
                        {/* Article Header */}
                        <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                             <div className="flex items-center gap-2 mb-3 text-[10px] font-bold tracking-wider text-primary uppercase">
                                <span>{readingItem.category}</span>
                                <span>•</span>
                                <span>{readingItem.readTime}</span>
                             </div>
                             <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                                {readingItem.title}
                             </h1>
                             
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-center bg-cover border border-slate-100 dark:border-slate-700" style={{ backgroundImage: `url("${readingItem.avatar}")` }}></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{readingItem.source}</p>
                                        <p className="text-[10px] text-slate-500">{readingItem.time}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                     <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                                        <Share2 size={18} />
                                     </button>
                                     <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                                        <Bookmark size={18} />
                                     </button>
                                </div>
                             </div>
                        </div>

                        {/* Article Content (Mock) */}
                        <div className="prose dark:prose-invert max-w-none prose-slate prose-base">
                            <div dangerouslySetInnerHTML={{ __html: readingItem.content }} />
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <blockquote>
                                "The only true wisdom is in knowing you know nothing." - Socrates
                            </blockquote>
                            <p>
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>
                        </div>

                    </motion.div>
                )}

            </AnimatePresence>
        </div>
      <MobileBottomNav />
      </main>
    </div>
  );
};

export default UserDashboard;
