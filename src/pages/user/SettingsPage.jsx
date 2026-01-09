import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ChevronDown, 
  Download,
  FileText
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('delivery');
  
  // Form States
  const [preferredHour, setPreferredHour] = useState('10:00');
  const [frequency, setFrequency] = useState('daily');
  const [isConsolidated, setIsConsolidated] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'delivery', label: 'Delivery Preferences', icon: Clock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Global Sidebar */}
      <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                
                {/* Settings Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="flex flex-col gap-6 sticky top-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage account & delivery</p>
                        </div>
                        <nav className="flex flex-col gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full text-left ${
                                            isActive 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon size={20} className={isActive ? 'fill-primary/20' : ''} />
                                        <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Content Panel */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Delivery Preferences</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Configure how and when you receive your Papertrail reports.</p>
                    </div>

                    <div className="p-8 space-y-10">
                        
                        {/* Global Delivery Time */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Global Delivery Time</h3>
                            <div className="max-w-xs">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Hour (UTC)</label>
                                <div className="relative">
                                    <select 
                                        value={preferredHour}
                                        onChange={(e) => setPreferredHour(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                                    >
                                        <option value="08:00">08:00 AM</option>
                                        <option value="09:00">09:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        {/* Report Frequency */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Report Frequency</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['daily', 'weekly', 'monthly'].map((opt) => (
                                    <label 
                                        key={opt}
                                        className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                                            frequency === opt 
                                                ? 'border-primary ring-1 ring-primary bg-blue-50/10 dark:bg-blue-900/10' 
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="frequency" 
                                            value={opt} 
                                            checked={frequency === opt}
                                            onChange={() => setFrequency(opt)}
                                            className="sr-only"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-bold capitalize ${frequency === opt ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                {opt}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {opt === 'daily' ? 'Every morning' : opt === 'weekly' ? 'Every Monday' : '1st of the month'}
                                            </span>
                                        </div>
                                        {frequency === opt && (
                                            <div className="absolute top-4 right-4 text-primary">
                                                <CheckCircle size={18} fill="currentColor" className="text-white dark:text-slate-900" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </section>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        {/* Consolidated Trail */}
                        <section className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consolidated Trail</h3>
                                <p className="text-sm text-slate-500 max-w-md">Combine all your platform reports into a single daily delivery.</p>
                            </div>
                            <div 
                                onClick={() => setIsConsolidated(!isConsolidated)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${isConsolidated ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div 
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${isConsolidated ? 'translate-x-7' : 'translate-x-1'}`}
                                ></div>
                            </div>
                        </section>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        {/* Billing Overview */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Billing Overview</h3>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Premium Plan</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Next billing date</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">October 12, 2024</p>
                                    </div>
                                    <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        Manage Subscription
                                    </button>
                                </div>
                                <div className="mt-6">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recent Invoices</p>
                                    <div className="space-y-1">
                                        {[
                                            { date: 'Sep 12, 2023', amount: '$29.00' },
                                            { date: 'Aug 12, 2023', amount: '$29.00' }
                                        ].map((invoice, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={16} className="text-slate-400" />
                                                    <span className="text-sm text-slate-600 dark:text-slate-300">{invoice.date} - {invoice.amount}</span>
                                                </div>
                                                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                                    <Download size={14} /> PDF
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                        <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Discard
                        </button>
                        <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-colors">
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
