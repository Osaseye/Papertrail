import React, { useState } from 'react';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import {  
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Mail, 
  User, 
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';

const MOCK_SUBSCRIBERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', joined: 'Oct 24, 2023', engagement: 'High' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@company.com', status: 'Active', joined: 'Sep 12, 2023', engagement: 'Medium' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@test.com', status: 'Unsubscribed', joined: 'Aug 05, 2023', engagement: 'Low' },
  { id: 4, name: 'Diana Prince', email: 'diana@themyscira.gov', status: 'Active', joined: 'Jan 10, 2024', engagement: 'High' },
  { id: 5, name: 'Evan Wright', email: 'evan@writer.io', status: 'Bounced', joined: 'Dec 01, 2023', engagement: '-' },
];

const CreatorSubscribers = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState('All');

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
      <CreatorSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-6 z-10 w-full">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Subscribers</h1>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                    <Download size={16} /> <span className="hidden md:inline">Export CSV</span>
                </button>
                <button className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm flex items-center gap-2">
                    <User size={16} /> <span className="hidden md:inline">Add Subscriber</span>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-32 md:pb-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Total Subscribers</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">2,451</h2>
                        <span className="text-green-500 text-sm font-semibold flex items-center gap-1"><TrendingUp size={14} /> +12%</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Open Rate (Avg)</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">48.2%</h2>
                        <span className="text-green-500 text-sm font-semibold flex items-center gap-1"><TrendingUp size={14} /> +2.4%</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Active Subscribers</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">2,100</h2>
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 ring-2 ring-white dark:ring-slate-900" />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white" 
                        placeholder="Search by name or email..." 
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Active', 'Unsubscribed', 'Bounced'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                                filter === f 
                                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white' 
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                    <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-6 py-4">Subscriber</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date Joined</th>
                                <th className="px-6 py-4">Engagement</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                            {MOCK_SUBSCRIBERS.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700">
                                                {sub.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{sub.name}</p>
                                                <p className="text-slate-500 text-xs">{sub.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                            sub.status === 'Unsubscribed' ? 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400' :
                                            'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                            {sub.status === 'Active' ? <CheckCircle2 size={12} /> : 
                                             sub.status === 'Unsubscribed' ? <XCircle size={12} /> : null}
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {sub.joined}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold ${
                                            sub.engagement === 'High' ? 'text-green-600' :
                                            sub.engagement === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                                        }`}>
                                            {sub.engagement}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Mobile Card View (Visible only on small screens) */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {MOCK_SUBSCRIBERS.map((sub) => (
                        <div key={sub.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-sm ring-1 ring-slate-200 dark:ring-slate-700">
                                    {sub.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{sub.name}</p>
                                    <p className="text-slate-500 text-xs">{sub.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                            sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400' :
                                            sub.status === 'Unsubscribed' ? 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400' :
                                            'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                            {sub.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Calendar size={10} /> {sub.joined}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="text-slate-400 p-2">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pagination (Mock) */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500">
                    <span>Showing 1-5 of 2,451</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Prev</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
                    </div>
                </div>
            </div>

        </main>
        <CreatorMobileBottomNav />
      </div>
    </div>
  );
};

export default CreatorSubscribers;
