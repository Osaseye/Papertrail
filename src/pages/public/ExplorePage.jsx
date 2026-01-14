import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { 
  Search, 
  Monitor, 
  DollarSign, 
  Activity, 
  Dumbbell, 
  Palette, 
  ArrowRight,
  TrendingUp,
  SearchX,
  User
} from 'lucide-react';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [exploreItems, setExploreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const categories = [
    { id: "All", label: "All Categories", icon: null },
    { id: "Tech", label: "Tech", icon: Monitor },
    { id: "Finance", label: "Finance", icon: DollarSign },
    { id: "Health", label: "Health", icon: Activity },
    { id: "Sports", label: "Sports", icon: Dumbbell },
    { id: "Art", label: "Art", icon: Palette },
  ];

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        // Fetch creators from brand collection
        let q = query(collection(db, 'creator-brands'), limit(25));
        
        if (activeCategory !== "All") {
             q = query(collection(db, 'creator-brands'), where('niche', '==', activeCategory), limit(25));
        }

        const querySnapshot = await getDocs(q);
        const creators = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                name: data.brandName || data.name || 'Anonymouse Creator',
                niche: data.niche || 'General'
            };
        });
        setExploreItems(creators);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [activeCategory]);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Sidebar Component */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-24 md:pb-4">
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-5">

            {/* Hero Search Section */}
            <section className="mb-6">
                <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold leading-tight text-center pb-6 pt-4">Find your next creative partner</h1>
                <div className="max-w-2xl mx-auto mb-6">
                <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-1.5">
                    <Search className="text-slate-400 ml-3 size-5" />
                    <input 
                    className="flex-1 border-none bg-transparent focus:ring-0 text-sm px-3 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none" 
                    placeholder="Search creators by name, niche, or platform..." 
                    type="text"
                    />
                    <button className="bg-primary text-white font-bold px-6 py-2 text-sm rounded-md hover:bg-primary/90 transition-all">Search</button>
                </div>
                </div>
                {/* Category Chips */}
                <div className="flex gap-2 justify-center flex-wrap">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <div 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 cursor-pointer shadow-sm transition-all border ${
                                    isActive 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {Icon && <Icon size={16} className={isActive ? "text-white" : "text-slate-900 dark:text-white"} />}
                                <p className={`text-xs font-medium ${isActive ? "text-white" : "text-slate-900 dark:text-white"}`}>{cat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Recommended Section */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Recommended for You</h2>
                <a className="text-primary font-semibold text-xs flex items-center gap-1 hover:underline" href="#">View all <ArrowRight size={14} /></a>
                </div>
                
                {exploreItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exploreItems.map((creator) => (
                           <div key={creator.id} 
                                onClick={() => navigate(`/creator/${creator.id}`)}
                                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
                           >
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center shrink-0"
                                         style={{ backgroundImage: creator.avatar ? `url("${creator.avatar}")` : undefined }}
                                    >
                                        {!creator.avatar && <User className="w-full h-full p-2 text-slate-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{creator.name || 'Unnamed Creator'}</h3>
                                        <p className="text-xs text-slate-500 truncate">{creator.niche || 'General'}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {creator.description || 'No description available.'}
                                </p>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                            <SearchX className="size-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {loading ? 'Loading creators...' : 'No creators found'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
                            {loading ? 'Please wait while we respond.' : 'We seem to have run out of recommendations for now. Check back later as more creators join!'}
                        </p>
                    </div>
                )}
            </section>

            {/* Trending Grid Section */}
            <section className="px-1 mb-8">
                <div className="flex items-center justify-between mb-8">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Trending This Week</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Sort by:</span>
                    <select className="bg-transparent border-none font-bold text-primary focus:ring-0 cursor-pointer outline-none">
                    <option>Highest Growth</option>
                    <option>Engagement Rate</option>
                    <option>Follower Count</option>
                    </select>
                </div>
                </div>
                
                {exploreItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Just re-using exploreItems for trending mock for now */}
                       {exploreItems.slice(0, 2).map((creator) => (
                           <div key={`trending-${creator.id}`} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="size-16 rounded-lg bg-slate-200 dark:bg-slate-800 bg-cover bg-center shrink-0"
                                     style={{ backgroundImage: creator.avatar ? `url("${creator.avatar}")` : undefined }}
                                ></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{creator.name}</h4>
                                    <p className="text-sm text-primary font-medium">Trending in {creator.niche}</p>
                                </div>
                           </div>
                       ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                         <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                            <TrendingUp className="size-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No trending creators</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
                           Trending data is currently being gathered. Please check back later.
                        </p>
                    </div>
                )}
            </section>
            
            </div>
        </div>
        <MobileBottomNav />
      </main>
    </div>
  );
};

export default ExplorePage;
