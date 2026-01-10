import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import Modal from '../../components/ui/Modal';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Plus, 
  Users, 
  TrendingUp, 
  BarChart2, 
  History, 
  Calendar, 
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle2,
  Package,
  Mail,
  MousePointer2,
  UserMinus,
  ExternalLink
} from 'lucide-react';

const chartData = [
  { day: 'Mon', value: 2400 },
  { day: 'Tue', value: 1398 },
  { day: 'Wed', value: 9800 },
  { day: 'Thu', value: 3908 },
  { day: 'Fri', value: 4800 },
  { day: 'Sat', value: 3800 },
  { day: 'Sun', value: 4300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-primary">
          Subscribers: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CreatorDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Modal States
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  const handleOpenStats = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setIsStatsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
      <CreatorSidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        title={selectedNewsletter?.subject || "Newsletter Stats"}
        size="lg"
      >
        {selectedNewsletter && (
            <div className="space-y-8">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                                <Mail size={16} />
                             </div>
                             <span className="text-sm font-medium text-slate-500">Open Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedNewsletter.openRate}</p>
                        <p className="text-xs text-green-500 mt-1">+2.4% vs average</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
                                <MousePointer2 size={16} />
                             </div>
                             <span className="text-sm font-medium text-slate-500">Click Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{selectedNewsletter.ctr}</p>
                        <p className="text-xs text-green-500 mt-1">+0.8% vs average</p>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400">
                                <UserMinus size={16} />
                             </div>
                             <span className="text-sm font-medium text-slate-500">Unsubscribes</span>
                        </div>
                         <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                         <p className="text-xs text-slate-400 mt-1">0.1% rate</p>
                    </div>
                </div>

                {/* Detailed Chart (Placeholder using existing components logic) */}
                <div>
                     <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Engagement Over Time (24h)</h3>
                     <div className="h-64 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm overflow-hidden">
                        <div style={{ width: '100%', height: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { time: '1h', opens: 400 }, { time: '2h', opens: 300 }, { time: '4h', opens: 550 },
                                        { time: '8h', opens: 200 }, { time: '12h', opens: 150 }, { time: '24h', opens: 80 }
                                    ]}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                                        cursor={{ fill: 'transparent' }} 
                                    />
                                    <Bar dataKey="opens" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                </div>

                {/* Link Preview */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Top Link</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <ExternalLink size={12} />
                             https://papertrail.com/blog/ai-design
                        </p>
                    </div>
                    <span className="text-sm font-bold text-primary">482 clicks</span>
                </div>
            </div>
        )}
      </Modal>

      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title="Recent Activity"
        size="md"
      >
         <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-start space-x-4 pb-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0">
                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                        i % 2 === 0 ? 'bg-primary' : i % 3 === 0 ? 'bg-green-500' : 'bg-amber-500'
                    }`}></div>
                    <div>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                            {i % 2 === 0 ? 'Draft auto-saved' : i % 3 === 0 ? 'New premium subscriber' : 'Issue with delivery'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {i % 2 === 0 ? '"The Creator Economy" draft updated' : i % 3 === 0 ? 'Alex Chen joined the VIP tier' : '3 bounces detected in last blast'} 
                            {' · '}{i * 4}h ago
                        </p>
                    </div>
                </div>
            ))}
         </div>
      </Modal>

      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar transition-all duration-300 pb-32 md:pb-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Jordan</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your Papertrail newsletter.</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <button 
                        onClick={() => navigate('/creator/editor')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} className="mr-2" />
                        Create Newsletter
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Total Subscribers */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <Users className="text-primary" size={24} />
                        </div>
                        <span className="text-green-500 text-xs font-semibold flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1" />
                            +12.5%
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Subscribers</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">24,512</p>
                </div>

                {/* Growth Analytics */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <BarChart2 className="text-indigo-600 dark:text-indigo-400" size={24} />
                        </div>
                        <div className="flex items-end space-x-1 h-6">
                            <div className="w-1 bg-primary/20 rounded-full h-2"></div>
                            <div className="w-1 bg-primary/40 rounded-full h-3"></div>
                            <div className="w-1 bg-primary/60 rounded-full h-5"></div>
                            <div className="w-1 bg-primary/80 rounded-full h-4"></div>
                            <div className="w-1 bg-primary rounded-full h-6"></div>
                        </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Growth Analytics</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1,402 <span className="text-sm font-normal text-slate-400">/mo</span></p>
                </div>

                {/* Last Sent */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                            <History className="text-amber-600 dark:text-amber-400" size={24} />
                        </div>
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Sent 2 days ago</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">The Future of AI Design</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">42.8% <span className="text-sm font-normal text-slate-400">open</span></p>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                            <Calendar className="text-emerald-600 dark:text-emerald-400" size={24} />
                        </div>
                        <span className="text-primary text-xs font-semibold cursor-pointer hover:underline">Edit schedule</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Weekly Round-up</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">Oct 24 <span className="text-sm font-normal text-slate-400">9:00 AM</span></p>
                </div>
            </div>

            {/* Main Content Grid: Chart & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Subscriber Growth Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subscriber Growth</h2>
                        <select className="text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 rounded-lg focus:ring-primary focus:border-primary py-1.5 pl-3 pr-8 outline-none">
                            <option>Last 30 days</option>
                            <option>Last 6 months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="h-80 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: -20, // Adjust to move Y-axis closer
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }} 
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar 
                                    dataKey="value" 
                                    fill="currentColor" 
                                    className="text-primary hover:text-blue-700 transition-colors duration-300" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-green-500 rounded-full shrink-0 animate-pulse"></div>
                            <div>
                                <p className="text-sm text-slate-900 dark:text-white font-medium">New premium subscriber</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Alex Chen joined the VIP tier · 12m ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0"></div>
                            <div>
                                <p className="text-sm text-slate-900 dark:text-white font-medium">Draft auto-saved</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">"The Creator Economy" draft updated · 1h ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-amber-500 rounded-full shrink-0"></div>
                            <div>
                                <p className="text-sm text-slate-900 dark:text-white font-medium">Issue with delivery</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">3 bounces detected in last blast · 4h ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 mt-2 bg-slate-300 dark:bg-slate-600 rounded-full shrink-0"></div>
                            <div>
                                <p className="text-sm text-slate-900 dark:text-white font-medium">Archive updated</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Past issues synchronized with site · 1d ago</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsActivityModalOpen(true)}
                        className="w-full mt-8 py-2.5 text-sm text-primary font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                    >
                        View all activity
                    </button>
                </div>
            </div>

            {/* Recent Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Newsletter Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sent Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Rate</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CTR</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">The Future of AI Design</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800">
                                        Sent
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">Oct 20, 2023</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">42.8%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">12.1%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button 
                                        onClick={() => handleOpenStats({
                                            subject: "The Future of AI Design",
                                            openRate: "42.8%",
                                            ctr: "12.1%",
                                            sentDate: "Oct 20, 2023"
                                        })}
                                        className="text-primary hover:text-blue-700 font-medium hover:underline"
                                    >
                                        View stats
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Weekly Roundup: SaaS Trends</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800">
                                        Sent
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">Oct 13, 2023</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">39.5%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">9.4%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button 
                                         onClick={() => handleOpenStats({
                                            subject: "Weekly Roundup: SaaS Trends",
                                            openRate: "39.5%",
                                            ctr: "9.4%",
                                            sentDate: "Oct 13, 2023"
                                        })}
                                        className="text-primary hover:text-blue-700 font-medium hover:underline"
                                    >
                                        View stats
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Why Email is King in 2024</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                        Draft
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">--</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">--</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-bold">--</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button 
                                        onClick={() => navigate('/creator/editor')}
                                        className="text-primary hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Edit draft
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
        <CreatorMobileBottomNav />
      </main>
    </div>
  );
};

export default CreatorDashboard;
