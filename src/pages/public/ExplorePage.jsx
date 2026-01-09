import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { 
  Search, 
  Monitor, 
  DollarSign, 
  Activity, 
  Dumbbell, 
  Palette, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  ThumbsUp,
  Utensils,
  BookOpen,
  Plus,
  Plane,
  Camera,
  Gamepad2,
  Tv,
  Mic,
  MessageSquare,
  Music,
  Video,
  Code,
  Brush,
  Briefcase,
  Heart
} from 'lucide-react';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* Sidebar Component */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
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
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-4 cursor-pointer shadow-md">
                    <p className="text-xs font-semibold">All Categories</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Monitor size={16} />
                    <p className="text-slate-900 dark:text-white text-xs font-medium">Tech</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <DollarSign size={16} />
                    <p className="text-slate-900 dark:text-white text-xs font-medium">Finance</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Activity size={16} />
                    <p className="text-slate-900 dark:text-white text-xs font-medium">Health</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Dumbbell size={16} />
                    <p className="text-slate-900 dark:text-white text-xs font-medium">Sports</p>
                </div>
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Palette size={16} />
                    <p className="text-slate-900 dark:text-white text-xs font-medium">Design</p>
                </div>
                </div>
            </section>

            {/* Recommended Section */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Recommended for You</h2>
                <a className="text-primary font-semibold text-xs flex items-center gap-1 hover:underline" href="#">View all <ArrowRight size={14} /></a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Featured Card 1 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                    <div className="h-32 w-full bg-cover bg-center" title="Tech creator working at a desk" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_MA0kpIOxRDTHDak9A8nFarPtEp4Yw4oVxxXKcdS6souma_iw67s05P8qA2RuJXn1LC3uGf0WB2Hf9hoFw-XKFteqmq5nH9f9oPzo9pEmygtyr0WH9Hwej2mBPzeOgVWz06CBsAT76ja7Yb8XVpvNRPQNLtMTaQUeBmpwFVPWXL9YS4Lu54RAkLz6215WXvg0QxuiGdkgOcBL2oFCVF8otiacOZSoUQvXTuHlBThnZ18_yZdYlgZvxzwL96w7PgQRqt7iN3jxQ9J-")' }}></div>
                    <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 -mt-9" title="Creator headshot" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCrpibYz7R1DJz-tL56fy3T_PgFa5M4A50aOBJ6nqm9JmGc0TnwZ0dWNeFbaybWABRSIWSEO7tIv-ZGKtZ5OzY29NNmoKqEQq-uNqEKCGiJ_I1Xy1xRoKAIoO81bT9Kx5aL_m-A57c5P9J0dBoE1mmFzlP5s-2mCC8Xcp6y6Xu7ybwhDVL2rY-YgmPPeokmIFK2K6QjdBrMacbHuZLe7gr20aIBb2Ih5qfpljuPq6kt-AfzMoHfCE0Ga07byufg4dCThp185_6ZeIsz")' }}></div>
                        <div className="mt-[-8px]">
                        <h3 className="font-bold text-base">Alex Rivet</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Tech Reviewer • 2.4M Subs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">Exploring the future of consumer electronics and sustainable hardware designs.</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">View Profile</button>
                    </div>
                </div>
                {/* Featured Card 2 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                    <div className="h-32 w-full bg-cover bg-center" title="Person doing yoga in nature" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCt4L3JUGE4w7RrSb8TkBW2xti-uyOrC76vDpjUvkC7W7eJ9fg6grd63y1pJxnljFNJsyAEfAMTn4Dn6fbm2p0DYPnj-RrWli-_-CAVTVxIGXBEAgwNkVoNFbXHI9q1hMxOQlp4wRuXUN8lFAOrbbqKduU3jrcC31JLjipSA4h8WxbAPU2LdGRI7KWh0TxFhMUUaKmGfmbW_7E7Dx7EoGiD94TqdLcjuBFQRAzSzor2ZPzW8L8pa5lMkP9Ccrr_QAze_zMGVIAGGukD")' }}></div>
                    <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 -mt-9" title="Creator headshot" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkfoXsUmI6_uNtyGmONaItbiKa-co9CCD4wbrGCCsk16VdjRQWOepGbiPIK5RSsiF4R7MkhzVuNXEPBfMRhYJuD50b8APPtQrf--tX0f58Bjf_y6tDwP6GVT3Ty9xNP0Dn03TyXiKaMzQHsUN7cLnFgdyyWZeblZ7YNrmjwnxGjDBH9lKhZ3TpRBe1l0BnRzcbbyDmzfjxNpZ2DzkSHgmRjhlybyOl8KTkqWuanh_9ccSId3VuBXA4wbSVuNzmb7Ry_HjMQcEUVfOb")' }}></div>
                        <div className="mt-[-8px]">
                        <h3 className="font-bold text-base">Maya Zen</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Wellness & Yoga • 850k Subs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">Mindfulness practices and daily flow routines for high-performance professionals.</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">View Profile</button>
                    </div>
                </div>
                {/* Featured Card 3 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                    <div className="h-32 w-full bg-cover bg-center" title="Stock market charts on multiple screens" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDj8G5m1FYKvlN49tmCnxIqblZkNwVFRD9PII_-_6hpXPNwgeVwUI8OaQoSJ5ZNFBv5YeCuar_9rj1mQRO8Y6hQD4cKQzdDQBNaT0AeJ-IWAWTyVHOezTMK3ZNeo5FMMDQiuZSncjo3pSKNxXpe8_v7rJZBYaxM5TvI21EC4WmXpulcpcgrqW8f9zlHH_y7qO-2n8EyaygHxtqtt3kqikf_4hJXKBt2tOTDuG-IW8brrDrGmQJ1UcJjTQzXAZjsa5hvJDICkLoz4gIP")' }}></div>
                    <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 -mt-9" title="Creator headshot" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxtcxZpiewkfGMxSasFmWBUAdcgIcInpfTB46tyemDm4uNrXeo9tKzqjIer9rV2qFQMTt_fFLk3hEMy_Ne93uwdmZp1IB1XPyF27Pr6hqgzXOZsCUR_lNQyT-0OkzSbysu4CbpJAqJF66dNjrEGNZkzsr_BpOzGHpLmbvAOxdf_jgeDKOlE-Vf7-bFs5IcmDm0X3Q83viLmwnhbWrVyNGfRnOFYHKMWfLO1z7feS-eYDFo4Pjs6LgdL3UmMASDEpecVS14mMJr3pzg")' }}></div>
                        <div className="mt-[-8px]">
                        <h3 className="font-bold text-base">FinMark Daily</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Finance & Stocks • 1.2M Subs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">Daily market analysis and investment strategies for long-term growth portfolios.</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">View Profile</button>
                    </div>
                </div>
                {/* Featured Card 4 (New) */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                    <div className="h-32 w-full bg-cover bg-center" title="Photography studio setup" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")' }}></div>
                    <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 -mt-9 bg-slate-200" title="Creator headshot" >
                             <Users className="w-full h-full p-2 text-slate-400" />
                        </div>
                        <div className="mt-[-8px]">
                        <h3 className="font-bold text-base">Lens & Light</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Photography • 920k Subs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">Mastering the art of photography through lighting, composition, and editing.</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">View Profile</button>
                    </div>
                </div>
                 {/* Featured Card 5 (New) */}
                 <div onClick={() => navigate('/creator/1')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                    <div className="h-32 w-full bg-cover bg-center" title="Coding workspace" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")' }}></div>
                    <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 -mt-9 bg-slate-200" title="Creator headshot" >
                             <Users className="w-full h-full p-2 text-slate-400" />
                        </div>
                        <div className="mt-[-8px]">
                        <h3 className="font-bold text-base">CodeMaster</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Development • 3.1M Subs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">Tutorials on full-stack development, system design, and emerging tech.</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">View Profile</button>
                    </div>
                </div>
                 {/* Featured Card 6 (New) */}
                 <div onClick={() => navigate('/creator/1')} className="cursor-pointer group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                    <div className="h-32 w-full bg-cover bg-center" title="Abstract painting execution" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")' }}></div>
                    <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 -mt-9 bg-slate-200" title="Creator headshot" >
                             <Users className="w-full h-full p-2 text-slate-400" />
                        </div>
                        <div className="mt-[-8px]">
                        <h3 className="font-bold text-base">Artistic Soul</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Art & Design • 550k Subs</p>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">Bringing imagination to life through digital art, painting, and illustration.</p>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">View Profile</button>
                    </div>
                </div>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trending Card 1 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all">
                    <div className="size-20 sm:size-24 rounded-xl bg-cover bg-center shrink-0" title="Cooking channel lifestyle image" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApGu4FgTFXbADXBTd4B7i8ek_SQpZ_OhfH7OgyEm6uIrzkxjda_FHb1ofRPqFSLCX4eP34sN9MBo3r4M5aNwSqGiionko2BfAGl8Rv4sBw__VTkvSd9FxNIjbj2LjNudraCRjmRpg9CGm9ps8G-0ovvhb8L-CDFSDAQTVePbmqTHGoj8grgc0CoMymo2xv2zCjcq9XKad001QRUi1vftKW_GAoK1QOL7_h2n-6eCczloSc3iFidks8_Th-EL7Ni8s2g7x7xnc_vNFp")' }}></div>
                    <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Chef Elena</h3>
                            <CheckCircle size={16} className="text-primary fill-primary text-white" />
                        </div>
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            <TrendingUp size={12} /> +18% Growth
                        </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Users size={12} /> 450k</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> 12.4% Eng.</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Utensils size={10} />
                        </div>
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <BookOpen size={10} />
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 border border-primary text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Sample Content</button>
                        <button className="px-4 bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                        <Plus size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                {/* Trending Card 2 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all">
                    <div className="size-20 sm:size-24 rounded-xl bg-cover bg-center shrink-0" title="Travel vlogger profile photo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0I3rmRTLSAMzc-aXQQhvaB6Obbs45SFJhl9GxpY1y7BK6zJ205NHVQJrO_hIqlLc-4AMD_1pjbDYsIsWJRxeVKJj9vMp69zaHCjEUDt8ESx14j6OSdrGAXacTIWcVZGUiauRjUhNLUGs29URUXwmWVUkbLzjjdmaAoRxPNQoA9waqD-fVIlS3ikf1pq4eWXlhXTiOcxuWWOjjJdGTq0FEeD6MjYuFz7vJLCXfUZVxXloWyH_zj9-mswIdst1TwhWqTZkYb0LimgT0")' }}></div>
                    <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Nomad Sam</h3>
                            <CheckCircle size={16} className="text-primary fill-primary text-white" />
                        </div>
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            <TrendingUp size={12} /> +32% Growth
                        </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Users size={12} /> 1.1M</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> 9.1% Eng.</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Plane size={10} />
                        </div>
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Camera size={10} />
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 border border-primary text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Sample Content</button>
                        <button className="px-4 bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                        <Plus size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                {/* Trending Card 3 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all">
                    <div className="size-20 sm:size-24 rounded-xl bg-cover bg-center shrink-0" title="Gaming setup neon lighting" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUk5pGbBJUeIsdR5yNexzUokyOEAmZDVpG1OeZq6NLW4Wch9oqHY-2olthShBR7rQPmT7GpKTCKeIDlutlwy7bILWIE4T8AgnCR_kP220pLtPw46Ei0cFY62rInTZFKdrQwN1x5QZL-_V5mqE0sSCGvsMKGGF2gnvEAiScftTkRCOu8n69qIpccyT8Csl_uwMSH2FD7Z0OOFJMK5fBYmq3_fM8Jy-qNWa8a8Ay0JqiCayOBP1ZcG-_viU-iKSQd-n3megR7qz9xjcH")' }}></div>
                    <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Pixel Pro</h3>
                            <CheckCircle size={16} className="text-primary fill-primary text-white" />
                        </div>
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            <TrendingUp size={12} /> +12% Growth
                        </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Users size={12} /> 2.8M</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> 15.2% Eng.</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Gamepad2 size={10} />
                        </div>
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Tv size={10} />
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 border border-primary text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Sample Content</button>
                        <button className="px-4 bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                        <Plus size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                {/* Trending Card 4 */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all">
                    <div className="size-20 sm:size-24 rounded-xl bg-cover bg-center shrink-0" title="Podcast studio microphone" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXrSN1DxsVnG519SA6Z-osuwBGKRPCsYQreI8wDv4B5668hdmMLGUMUHtGTySQ3y8K6p8HpInVPPtwg_q2K2ltchrm9Fk_EFT_E_6pd7iouA7S02wukdAUxuqZ0It7itvFn3HqlG4YHAjGhCbvhfBT4X7G7MSoSfgTv_-c6I89kOG7WW8XQUfYrkl2x3VzbK6UkwVqutOCLkoDnhibgUEN5y8sFORaxRH545B6mPi8F0VFRJlJxK5Yg9Zs4_8DQ28CWjLpc369SWQU")' }}></div>
                    <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Talk Truth</h3>
                            <CheckCircle size={16} className="text-primary fill-primary text-white" />
                        </div>
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            <TrendingUp size={12} /> +25% Growth
                        </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Users size={12} /> 670k</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> 8.4% Eng.</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Mic size={10} />
                        </div>
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <MessageSquare size={10} />
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 border border-primary text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Sample Content</button>
                        <button className="px-4 bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                            <Plus size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                {/* Trending Card 5 (New) */}
                <div onClick={() => navigate('/creator/1')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all">
                    <div className="size-20 sm:size-24 rounded-xl bg-cover bg-center shrink-0" title="Music studio" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")' }}></div>
                    <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Beat Maker</h3>
                            <CheckCircle size={16} className="text-primary fill-primary text-white" />
                        </div>
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            <TrendingUp size={12} /> +20% Growth
                        </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Users size={12} /> 320k</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> 18.5% Eng.</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Music size={10} />
                        </div>
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Video size={10} />
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 border border-primary text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Sample Content</button>
                        <button className="px-4 bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                            <Plus size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                 {/* Trending Card 6 (New) */}
                 <div onClick={() => navigate('/creator/1')} className="cursor-pointer flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 gap-4 hover:border-primary transition-all">
                    <div className="size-20 sm:size-24 rounded-xl bg-cover bg-center shrink-0" title="Business meeting" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80")' }}></div>
                    <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">Biz Insider</h3>
                            <CheckCircle size={16} className="text-primary fill-primary text-white" />
                        </div>
                        <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            <TrendingUp size={12} /> +15% Growth
                        </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1"><Users size={12} /> 890k</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> 7.2% Eng.</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Briefcase size={10} />
                        </div>
                        <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded p-1 flex items-center justify-center">
                            <Heart size={10} />
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 border border-primary text-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/5 transition-colors">Sample Content</button>
                        <button className="px-4 bg-primary text-white py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
                            <Plus size={16} />
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            
            </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
