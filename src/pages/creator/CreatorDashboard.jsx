import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
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
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 0 },
  { day: 'Wed', value: 0 },
  { day: 'Thu', value: 0 },
  { day: 'Fri', value: 0 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
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
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Data States
  const [stats, setStats] = useState({
      totalSubscribers: 0,
      monthlyGrowth: 0,
      openRate: 0,
      clickRate: 0,
      lastSent: null
  });
  const [newsletters, setNewsletters] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // 1. Fetch Brand Details (Name & Aggregate Stats)
        const brandRef = doc(db, 'creator-brands', user.uid);
        const brandSnap = await getDoc(brandRef);
        
        if (brandSnap.exists()) {
            const data = brandSnap.data();
            setBrandName(data.brandName || user.displayName || 'Creator');
            // Assuming stats might be stored on the brand document
            if (data.stats) {
                setStats(prev => ({ ...prev, ...data.stats }));
            }
        }

        // 2. Fetch Newsletters (Recent 5)
        const q = query(
            collection(db, 'newsletters'),
            where('creatorId', '==', user.uid),
            orderBy('updatedAt', 'desc'), // Use updatedAt to match the list view sort
            limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetchedNewsletters = [];
        querySnapshot.forEach((doc) => {
            fetchedNewsletters.push({ id: doc.id, ...doc.data() });
        });
        setNewsletters(fetchedNewsletters);

        // Calculate stats from ALL fetched newsletters (client-side aggregation simple for now)
        if (fetchedNewsletters.length > 0) {
            const sentNewsletters = fetchedNewsletters.filter(n => n.status === 'sent');
            if (sentNewsletters.length > 0) {
                 // Open Rate = (Opens / Subscribers) * 100 - But we don't have snapshot of subscribers at time of send.
                 // For now, simpler metric: Total Opens
                 const totalOpens = sentNewsletters.reduce((acc, curr) => acc + (curr.stats?.opens || 0), 0);
                 const totalClicks = sentNewsletters.reduce((acc, curr) => acc + (curr.stats?.clicks || 0), 0);
                 
                 // Use raw opens as the 'metric' displayed for Open Rate if we don't have denominator
                 // Or just display 0 if we can't calc rate properly yet
                 
                 const last = sentNewsletters[0];
                 
                 setStats(prev => ({
                     ...prev,
                     openRate: totalOpens, // Displaying Total Opens instead of Rate for now as it's more accurate without historical sub count
                     clickRate: totalClicks,
                     lastSent: last
                 }));
            }
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
            <div className="text-center py-6 text-slate-400 text-sm">
                No recent activity.
            </div>
         </div>
      </Modal>

      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar transition-all duration-300 pb-32 md:pb-6">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {brandName || 'Creator'}</h1>
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
                        <span className="text-slate-400 text-xs font-semibold flex items-center bg-slate-50 dark:bg-slate-900/20 px-2 py-1 rounded-full">
                            <TrendingUp size={14} className="mr-1" />
                            {stats.monthlyGrowth > 0 && '+'}{stats.monthlyGrowth}%
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Subscribers</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalSubscribers.toLocaleString()}</p>
                </div>

                {/* Growth Analytics */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <BarChart2 className="text-indigo-600 dark:text-indigo-400" size={24} />
                        </div>
                        <div className="flex items-end space-x-1 h-6">
                            <div className="w-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2"></div>
                            <div className="w-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3"></div>
                            <div className="w-1 bg-slate-200 dark:bg-slate-700 rounded-full h-5"></div>
                            <div className="w-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4"></div>
                            <div className="w-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6"></div>
                        </div>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Opens</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.openRate}</p>
                </div>

                {/* Last Sent */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                            <History className="text-amber-600 dark:text-amber-400" size={24} />
                        </div>
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                            {stats.lastSent ? new Date(stats.lastSent.sentAt?.seconds * 1000).toLocaleDateString() : '--'}
                        </span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium truncate">
                        {stats.lastSent ? stats.lastSent.subject : 'No newsletters sent'}
                    </h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {stats.lastSent ? `${stats.lastSent.stats?.opens || 0}` : '--'} <span className="text-sm font-normal text-slate-400">opens</span>
                    </p>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                            <Calendar className="text-emerald-600 dark:text-emerald-400" size={24} />
                        </div>
                        <span className="text-slate-400 text-xs font-semibold cursor-default">No schedule</span>
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Next Newsletter</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">-- <span className="text-sm font-normal text-slate-400">--</span></p>
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
                        <div className="text-center py-6 text-slate-400 text-xs">
                             No recent activity.
                        </div>
                    </div>
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
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500 text-sm">
                                        Loading...
                                    </td>
                                </tr>
                            ) : newsletters.length > 0 ? (
                                newsletters.map((newsletter) => (
                                    <tr key={newsletter.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{newsletter.subject}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                newsletter.status === 'sent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                newsletter.status === 'draft' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                                {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {newsletter.sentAt ? new Date(newsletter.sentAt.seconds * 1000).toLocaleDateString() : 'Not sent'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{newsletter.stats?.openRate || 0}%</td>
                                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{newsletter.stats?.clickRate || 0}%</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleOpenStats(newsletter)}
                                                className="text-primary hover:text-blue-700 text-sm font-medium"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500 text-sm">
                                        No newsletters found. <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/creator/editor')}>Create your first one</span>.
                                    </td>
                                </tr>
                            )}
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
