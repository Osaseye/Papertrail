import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import NotificationDropdown from '../../components/ui/NotificationDropdown';
import { useAuth } from '../../context/AuthContext'; 
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, where, collectionGroup, updateDoc, increment } from 'firebase/firestore'; 
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
  FileText,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Notifications
const DUMMY_NOTIFICATIONS = [];

const UserDashboard = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'reading'
  
  // Data States
  const [feedItems, setFeedItems] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const [readingItem, setReadingItem] = useState(null);
  
  // Interaction States
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unread' | 'source'
  const [filterSource, setFilterSource] = useState(null);
  const [manageMode, setManageMode] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);

  // Fetch Feed Items and Subscriptions
  useEffect(() => {
    const fetchData = async () => {
        if (!user) return;

        try {
            // 1. Fetch Subscriptions using Collection Group Query
            // This finds all 'subscribers' sub-collections across the DB where uid == user.uid
            const subQuery = query(collectionGroup(db, 'subscribers'), where("uid", "==", user.uid));
            const subSnapshot = await getDocs(subQuery);
            
            // Map subscriptions and extract creatorId from parent path
            const subs = subSnapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
                creatorId: d.ref.parent.parent.id // creator-brands/{id}/subscribers/{subId}
            }));
            setSubscriptions(subs);

            // 2. Determine Post Query
            let q;
            const subscribedCreatorIds = subs.map(sub => sub.creatorId).filter(Boolean);
            
            // Initial Creator Cache from loaded subscriptions (if we had that data, but we might not)
            const creatorCache = {};

            if (subscribedCreatorIds.length > 0) {
                 // Firestore 'in' limit is 10. Take top 10 for now.
                 const topCreatorIds = subscribedCreatorIds.slice(0, 10);
                 q = query(
                    collection(db, 'newsletters'),
                    where('creatorId', 'in', topCreatorIds),
                    where('status', '==', 'sent'),
                    orderBy('sentAt', 'desc'),
                    limit(20)
                );
            } else {
                 // Fallback to global feed if no subscriptions (showing latest sent newsletters)
                 q = query(
                    collection(db, 'newsletters'),
                    where('status', '==', 'sent'),
                    orderBy('sentAt', 'desc'),
                    limit(20)
                );
            }
            
            // 3. Fetch Posts (Newsletters)
            const querySnapshot = await getDocs(q);
            const posts = [];

            for (const docSnapshot of querySnapshot.docs) {
                const postData = docSnapshot.data();
                const creatorId = postData.creatorId;
                
                let creator = { brandName: 'Unknown Creator', avatar: null };
                
                if (creatorId) {
                    if (creatorCache[creatorId]) {
                        creator = creatorCache[creatorId];
                    } else {
                        try {
                            const creatorDoc = await getDoc(doc(db, 'creator-brands', creatorId));
                            if (creatorDoc.exists()) {
                                creator = creatorDoc.data();
                                creatorCache[creatorId] = creator;
                            }
                        } catch (e) {
                            console.error("Error fetching creator", creatorId);
                        }
                    }
                }
                
                // Map newsletter data to feed item format
                posts.push({
                    id: docSnapshot.id,
                    ...postData,
                    title: postData.subject, // Map subject to title
                    source: creator.brandName || creator.name || 'Unknown Creator',
                    avatar: creator.avatar,
                    time: postData.sentAt?.toDate ? postData.sentAt.toDate().toLocaleDateString() : 'Recently',
                    isRead: false, 
                    excerpt: postData.previewText || (postData.content ? postData.content.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...' : '')
                });
            }
            
            setFeedItems(posts);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoadingFeed(false);
        }
    };
    
    fetchData();
  }, [user]);

  // Notification Handlers
  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const handleRead = async (item) => {
    setReadingItem(item);
    setView('reading');

    // Analytics: Track Open
    if (item.id) {
        try {
            const newsletterRef = doc(db, 'newsletters', item.id);
            // track open count
            await updateDoc(newsletterRef, {
                'stats.opens': increment(1)
            });
        } catch (error) {
            console.error("Error tracking open:", error);
        }
    }
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
  const filteredItems = feedItems.filter(item => {
    if (filterMode === 'unread') return !item.isRead;
    if (filterMode === 'source') return item.source === filterSource;
    return true;
  });

  const unreadCount = feedItems.filter(i => !i.isRead).length;

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
                                <p className="text-2xl font-bold leading-tight relative z-10">{subscriptions.length}</p>
                                <p className="text-slate-400 text-[10px] font-bold relative z-10">{subscriptions.length === 1 ? '1 Active Plan' : `${subscriptions.length} Active Plans`}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Clock size={64} />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Next</p>
                                    <Clock size={16} className="text-orange-500" />
                                </div>
                                <p className="text-2xl font-bold leading-tight relative z-10">--</p>
                                <p className="text-slate-500 text-[10px] relative z-10">Nothing scheduled</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Mail size={64} />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Unread</p>
                                    <Mail size={16} className="text-red-500" />
                                </div>
                                <p className="text-2xl font-bold leading-tight relative z-10">0 New</p>
                                <button 
                                    onClick={toggleUnreadFilter}
                                    className="text-slate-400 text-[10px] font-bold relative z-10 cursor-default text-left"
                                >
                                    No new messages
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
                                    {subscriptions.length > 0 ? (
                                        subscriptions.map(sub => (
                                            <div key={sub.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center" style={{ backgroundImage: sub.creatorAvatar ? `url("${sub.creatorAvatar}")` : undefined }}>
                                                        {!sub.creatorAvatar && <User size={14} className="text-slate-400" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{sub.creatorName || 'Unknown'}</h4>
                                                        <p className="text-[10px] text-slate-500">Weekly Newsletter</p>
                                                    </div>
                                                </div>
                                                {manageMode ? (
                                                     <button className="text-red-500 text-xs font-bold hover:underline">Unsub</button>
                                                ) : (
                                                     <button onClick={() => handleSourceClick(sub.creatorName)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-primary transition-colors">
                                                        <ChevronRight size={16} />
                                                     </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                                            No active subscriptions found.
                                            <br />
                                            <a href="/explore" className="text-primary hover:underline mt-1 font-bold">Explore Newsletters</a>
                                        </div>
                                    )}
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

                        {/* Article Content */}
                        <div className="prose dark:prose-invert max-w-none prose-slate prose-base">
                            <div dangerouslySetInnerHTML={{ __html: readingItem.content }} />
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
