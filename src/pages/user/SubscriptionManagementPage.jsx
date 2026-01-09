import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  Compass, 
  Rss, 
  MoreVertical, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  Trash2,
  Clock,
  Mail,
  Zap,
  Calendar
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import { useNavigate } from 'react-router-dom';

// Mock Data
const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    creator: "Silicon Insights",
    author: "Marcus Thorne",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAEYsaiS1WhnWvmo8kKc252i3kovtmDGNI96bV-RrXxiZbilnV3obzLfamTF17v7R0oeFxCMj-vVrdJapyA2N8rKh0BLtjrMju8peNTEIJQ5vFLGKvTAWRBM_nS9Tb72s1_ZSfMfSnrYI5umX8gANG7WcIUiirEvNNF8-UEye9oPSWxLgmKNOCNhDsZqUXZAcNNuRB6GgX8QG-lFSRi14hatTwahmiJsCdhGMpE1Djihu4aWK9R8DqY4UvEL6oprddtBfH0FhuLjkv",
    status: "active", // active, snoozed
    schedule: "daily", // daily, immediate, weekly, monthly
    nextDelivery: "Tomorrow, 8:00 AM"
  },
  {
    id: 2,
    creator: "The Creative Flow",
    author: "Sarah Jenkins",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCeVzq09Aek99ogfQGY0-4a6DLmpd6yBtUG-HkgMnkLBwOiZwZbchYN7UIz4Y6Xml-mSL6p-INSKctxPYtC284bBeW2WQ3tzrbk1lzflyIyWRoIjQU2xKGW0Zq77PdPUaj-_Gi1vhNgXTAqPnA7Tqs5LgoitXNYpf71hQEmVKLjRUXM7bSrocFe2pw7jbnsch76MhTf2AI7Z_8pIxcWjvDdaVKGtsZYr9YV2GtKaARlHxb33VD252reXvzDpnjeW9rlIFsZPnvWIyn",
    status: "snoozed",
    schedule: "immediate",
    nextDelivery: "Resumes in 4 days"
  },
  {
    id: 3,
    creator: "World Finance Weekly",
    author: "Official Publication",
    avatar: "", // Initials style
    initials: "WF",
    initialsColor: "bg-indigo-500",
    status: "active",
    schedule: "immediate",
    nextDelivery: "Sent as published"
  },
  {
    id: 4,
    creator: "Design Trends 2024",
    author: "Elena Rossi",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkG374pu6n0G8DCHtYf7U4LEogHn5ULmwWR8VDnoKr02a7sKVuUq8gcQDGXogfqzqAIwhcgw6Ec_-ltbmvr_oXIJTnSQ6ZYsEfLvIzpp2LPSgrh2u3PxXwq1w3WfjArswHkrD9ACUKuHXnwNyIYG7FcKKxO3x8te4Ggxv7SgEgC7ZfmMTYdgYRg8x2sJe8odS7thcDhxBwUEtVQMuGpykipmD9uoOUhuTt5SbipPOIXfSjSmjIyap0AU_3hXdqr7s0WynsFn4KfaAm",
    status: "active",
    schedule: "weekly",
    nextDelivery: "Sunday, 6:00 PM"
  },
  {
    id: 5,
    creator: "Green Nomad",
    author: "Sustainable Travel",
    avatar: "",
    initials: "GN",
    initialsColor: "bg-emerald-500",
    status: "active",
    schedule: "daily",
    nextDelivery: "Tomorrow, 8:00 AM"
  },
  {
    id: 6,
    creator: "Indie Hacker Life",
    author: "Josh Pigford",
    avatar: "", 
    initials: "IH",
    initialsColor: "bg-orange-500",
    status: "active",
    schedule: "daily",
    nextDelivery: "Tomorrow, 9:00 AM"
  },
];

const SubscriptionManagementPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Settings State
  const [autoArchive, setAutoArchive] = useState(true);
  const [smartBatching, setSmartBatching] = useState(false);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subscriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

  // Actions
  const handleSnooze = (id) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'snoozed', nextDelivery: 'Paused' } : sub
    ));
  };

  const handleResume = (id) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'active', nextDelivery: 'Updated' } : sub
    ));
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to unsubscribe?")) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const handleScheduleChange = (id, newSchedule) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, schedule: newSchedule } : sub
    ));
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar - Reusing existing component */}
      <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header - Simplified version of UserDashboard header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10 w-full">
           {/* Left: Breadcrumbs / Title */}
           <div className="flex items-center gap-2">
             <h1 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Subscription Control Center</h1>
           </div>

           {/* Right: Actions */}
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
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-100 dark:border-slate-800"></span>
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden z-20">
                            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-xs font-bold uppercase text-slate-500">Notifications</span>
                                <button className="text-primary text-xs font-bold hover:underline">Mark all read</button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                <div className="p-4 text-center text-slate-500 text-sm">No new notifications</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Subscriptions</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Control how and when you receive updates from your creators.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                           onClick={() => navigate('/user/settings')}
                           className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900"
                        >
                            <Settings size={16} />
                            <span className="font-medium text-sm">Global Preferences</span>
                        </button>
                        <button 
                             onClick={() => navigate('/explore')}
                             className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
                        >
                            <Compass size={16} />
                            <span>Discover More</span>
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Rss className="text-primary" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Active Trails</p>
                                <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Clock className="text-amber-600 dark:text-amber-500" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Paused Subscriptions</p>
                                <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'snoozed').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <Mail className="text-emerald-600 dark:text-emerald-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Daily Trail Size</p>
                                <p className="text-2xl font-bold">128 KB</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <Clock className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Est. Reading Time</p>
                                <p className="text-2xl font-bold">18m</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
                    {/* Search/Filter Bar */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-900">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-shadow shadow-sm" placeholder="Search by creator or newsletter name..." type="text"/>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                            <div className="relative">
                                <select className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm py-2 pl-3 pr-8 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                    <option>Most Recent Activity</option>
                                    <option>Name (A-Z)</option>
                                    <option>Delivery Frequency</option>
                                </select>
                                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Creator</th>
                                    <th className="px-6 py-4">Delivery Status</th>
                                    <th className="px-6 py-4">Override Schedule</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {currentItems.map((sub) => (
                                    <tr key={sub.id} className={`group ${sub.status === 'snoozed' ? 'bg-slate-50/30 dark:bg-slate-800/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-3 ${sub.status === 'snoozed' ? 'opacity-60' : ''}`}>
                                                {sub.avatar ? (
                                                     <img alt={sub.creator} className={`size-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 ${sub.status === 'snoozed' ? 'grayscale' : ''}`} src={sub.avatar}/>
                                                ) : (
                                                    <div className={`size-10 rounded-lg ${sub.initialsColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                                        {sub.initials}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={`font-bold text-sm text-slate-900 dark:text-white ${sub.status !== 'snoozed' && 'group-hover:text-primary transition-colors'}`}>{sub.creator}</p>
                                                    <p className="text-xs text-slate-500">{sub.author}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.status === 'active' ? (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        {sub.schedule === 'immediate' ? (
                                                           <div className="flex items-center gap-2 text-primary">
                                                                <Zap size={16} fill="currentColor" />
                                                                <span className="text-sm font-medium">Immediate</span>
                                                           </div>
                                                        ) : sub.schedule === 'weekly' ? (
                                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                                <Calendar size={16} />
                                                                <span className="text-sm font-medium">Weekly Digest</span>
                                                           </div>
                                                        ) : (
                                                            <>
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">In Daily Trail</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">{sub.nextDelivery}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                                        <Clock size={16} />
                                                        <span className="text-sm font-medium">Snoozed</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">{sub.nextDelivery}</p>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`relative w-44 ${sub.status === 'snoozed' ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <select 
                                                    value={sub.schedule}
                                                    onChange={(e) => handleScheduleChange(sub.id, e.target.value)}
                                                    className="appearance-none w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                                    disabled={sub.status === 'snoozed'}
                                                >
                                                    <option value="daily">Use Global (Daily)</option>
                                                    <option value="immediate">Immediate</option>
                                                    <option value="weekly">Weekly Digest</option>
                                                </select>
                                                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={12} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`flex items-center justify-end gap-2 ${sub.status === 'active' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity`}>
                                                {sub.status === 'active' ? (
                                                    <button 
                                                        onClick={() => handleSnooze(sub.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                                                    >
                                                        Snooze
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleResume(sub.id)}
                                                        className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/30"
                                                    >
                                                        Resume
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(sub.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                        <p>Showing <span className="font-bold text-slate-900 dark:text-white">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, subscriptions.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{subscriptions.length}</span> active trails</p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center bg-white dark:bg-slate-800"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded-lg font-bold transition-colors ${currentPage === i + 1 
                                        ? 'border-primary bg-primary text-white' 
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center bg-white dark:bg-slate-800"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="p-8 bg-gradient-to-r from-primary to-blue-600 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden relative shadow-lg mb-8">
                    <div className="relative z-10 w-full md:w-1/2">
                        <h3 className="text-2xl font-bold mb-3">Feeling overwhelmed?</h3>
                        <p className="text-blue-100 leading-relaxed mb-6">Try setting up a "Quiet Period" or bundle less-critical subscriptions into a single Weekly Digest to reclaim your focus.</p>
                        <button 
                            onClick={() => alert("Configure Quiet Periods functionality coming soon!")}
                            className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
                        >
                            Configure Quiet Periods
                        </button>
                    </div>
                    
                     {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-12 -mr-12 pointer-events-none"></div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 w-full md:w-auto min-w-[300px]">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                            <span className="text-sm font-bold">Auto-Archive Inactive</span>
                            <div 
                                onClick={() => setAutoArchive(!autoArchive)}
                                className={`w-10 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors ${autoArchive ? 'bg-emerald-400' : 'bg-slate-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${autoArchive ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-sm font-bold">Smart Batching</span>
                             <div 
                                onClick={() => setSmartBatching(!smartBatching)}
                                className={`w-10 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors border border-white/10 ${smartBatching ? 'bg-emerald-400' : 'bg-black/20'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 bg-white/80 rounded-full shadow-sm transition-all ${smartBatching ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;
