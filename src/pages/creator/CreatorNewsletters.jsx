import React, { useState } from 'react';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import {  
  Plus, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  MoreHorizontal, 
  Edit3, 
  BarChart2, 
  Eye, 
  Trash2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_NEWSLETTERS = [
  { 
    id: 1, 
    title: 'Weekly Creator Insights #42', 
    subject: 'Why micro-communities are the future', 
    status: 'Draft', 
    date: 'Last edited 2h ago', 
    stats: null 
  },
  { 
    id: 2, 
    title: 'Tech Trends Report - Q3 2024', 
    subject: 'AI is changing everything, again.', 
    status: 'Scheduled', 
    date: 'Sends tomorrow at 9:00 AM', 
    stats: null 
  },
  { 
    id: 3, 
    title: 'The minimalist approach to coding', 
    subject: 'Less code, more value. Here is how.', 
    status: 'Published', 
    date: 'Sent on Oct 12, 2024', 
    stats: { openRate: '42%', ctr: '12%' } 
  },
  { 
    id: 4, 
    title: 'Welcome to my newsletter!', 
    subject: 'Thanks for subscribing - here is what to expect.', 
    status: 'Published', 
    date: 'Sent on Sep 01, 2024', 
    stats: { openRate: '68%', ctr: '24%' } 
  },
];

const CreatorNewsletters = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const filteredNewsletters = activeTab === 'All' 
    ? MOCK_NEWSLETTERS 
    : MOCK_NEWSLETTERS.filter(n => n.status === activeTab);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
      <CreatorSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 z-10 w-full">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Newsletters</h1>
            <button 
                onClick={() => navigate('/creator/editor')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm flex items-center gap-2"
            >
                <Plus size={18} /> New Draft
            </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-32 md:pb-6">

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-6 border-b border-slate-200 dark:border-slate-800">
                {['All', 'Draft', 'Scheduled', 'Published'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-colors relative ${
                            activeTab === tab 
                            ? 'text-primary' 
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredNewsletters.map((newsletter) => (
                    <div 
                        key={newsletter.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg flex-shrink-0 ${
                                    newsletter.status === 'Draft' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                    newsletter.status === 'Scheduled' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500' :
                                    'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500'
                                }`}>
                                    {newsletter.status === 'Draft' ? <FileText size={20} /> :
                                     newsletter.status === 'Scheduled' ? <Clock size={20} /> :
                                     <CheckCircle size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/creator/editor')}>
                                            {newsletter.title}
                                        </h3>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                            newsletter.status === 'Draft' ? 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' :
                                            newsletter.status === 'Scheduled' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/30' :
                                            'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/10 dark:text-green-500 dark:border-green-900/30'
                                        }`}>
                                            {newsletter.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                                        {newsletter.subject}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {newsletter.date}
                                        </span>
                                        {newsletter.stats && (
                                            <>
                                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                                <span className="text-slate-700 dark:text-slate-300">Open Rate: {newsletter.stats.openRate}</span>
                                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                                <span className="text-slate-700 dark:text-slate-300">CTR: {newsletter.stats.ctr}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {newsletter.status === 'Draft' && (
                                    <button 
                                        onClick={() => navigate('/creator/editor')}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Edit"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                )}
                                {newsletter.status === 'Published' && (
                                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="View Stats">
                                        <BarChart2 size={18} />
                                    </button>
                                )}
                                <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </main>
        <CreatorMobileBottomNav />
      </div>
    </div>
  );
};

export default CreatorNewsletters;
