import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { 
  CheckCircle, Users, MapPin, Share2, Video, Camera, AtSign, 
  Check, ChevronLeft, ChevronRight, ArrowRight, Play, Heart, MessageCircle, ArrowLeft, X 
} from 'lucide-react';
import MobileBottomNav from '../../components/layout/MobileBottomNav';

const CreatorProfilePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Dummy data for posts
  const posts = [
    {
      id: 1,
      category: 'Yoga Flow',
      date: 'Jan 12',
      title: '15-Minute Morning Mobility',
      description: 'Start your day with these five simple movements designed to wake up your joints...',
      readTime: '5 min',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt4L3JUGE4w7RrSb8TkBW2xti-uyOrC76vDpjUvkC7W7eJ9fg6grd63y1pJxnljFNJsyAEfAMTn4Dn6fbm2p0DYPnj-RrWli-_-CAVTVxIGXBEAgwNkVoNFbXHI9q1hMxOQlp4wRuXUN8lFAOrbbqKduU3jrcC31JLjipSA4h8WxbAPU2LdGRI7KWh0TxFhMUUaKmGfmbW_7E7Dx7EoGiD94TqdLcjuBFQRAzSzor2ZPzW8L8pa5lMkP9Ccrr_QAze_zMGVIAGGukD',
      content: "Here is the full content of the morning mobility routine. 1. Neck rolls. 2. Shoulder shrugs. 3. Cat-Cow..."
    },
    {
      id: 2,
      category: 'Nutrition',
      date: 'Jan 05',
      title: 'Anti-Inflammatory Breakfasts',
      description: 'The role of nutrition in recovery. Discover three easy recipes that fight inflammation...',
      readTime: '8 min',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApGu4FgTFXbADXBTd4B7i8ek_SQpZ_OhfH7OgyEm6uIrzkxjda_FHb1ofRPqFSLCX4eP34sN9MBo3r4M5aNwSqGiionko2BfAGl8Rv4sBw__VTkvSd9FxNIjbj2LjNudraCRjmRpg9CGm9ps8G-0ovvhb8L-CDFSDAQTVePbmqTHGoj8grgc0CoMymo2xv2zCjcq9XKad001QRUi1vftKW_GAoK1QOL7_h2n-6eCczloSc3iFidks8_Th-EL7Ni8s2g7x7xnc_vNFp',
      content: "Breakfast is key. Try turmeric oats or a berry smoothie..."
    },
    {
       id: 3,
       category: 'Mindset',
       date: 'Dec 28',
       title: 'Setting Intention, Not Goals',
       description: "Why New Year's resolutions often fail and how shifting to daily intentions can change your life...",
       readTime: '6 min',
       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkfoXsUmI6_uNtyGmONaItbiKa-co9CCD4wbrGCCsk16VdjRQWOepGbiPIK5RSsiF4R7MkhzVuNXEPBfMRhYJuD50b8APPtQrf--tX0f58Bjf_y6tDwP6GVT3Ty9xNP0Dn03TyXiKaMzQHsUN7cLnFgdyyWZeblZ7YNrmjwnxGjDBH9lKhZ3TpRBe1l0BnRzcbbyDmzfjxNpZ2DzkSHgmRjhlybyOl8KTkqWuanh_9ccSId3VuBXA4wbSVuNzmb7Ry_HjMQcEUVfOb',
       content: "Intentions are about the present moment..."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-200">
        
        {/* Back Button (Desktop) */}
        <div className="hidden md:block sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
             <div className="max-w-5xl mx-auto">
                <button 
                  onClick={() => navigate('/explore')} 
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Explore
                </button>
             </div>
        </div>

        {/* Back Button (Mobile - Absolute) */}
        <button 
            onClick={() => navigate('/explore')} 
            className="md:hidden absolute top-4 left-4 z-50 p-2 bg-black/30 backdrop-blur-md rounded-full text-white"
        >
             <ArrowLeft size={20} />
        </button>

        <main className="flex-1 w-full pb-24 md:pb-20">
            {/* Cover Image */}
            <div 
                className="relative w-full h-[250px] bg-cover bg-center" 
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCt4L3JUGE4w7RrSb8TkBW2xti-uyOrC76vDpjUvkC7W7eJ9fg6grd63y1pJxnljFNJsyAEfAMTn4Dn6fbm2p0DYPnj-RrWli-_-CAVTVxIGXBEAgwNkVoNFbXHI9q1hMxOQlp4wRuXUN8lFAOrbbqKduU3jrcC31JLjipSA4h8WxbAPU2LdGRI7KWh0TxFhMUUaKmGfmbW_7E7Dx7EoGiD94TqdLcjuBFQRAzSzor2ZPzW8L8pa5lMkP9Ccrr_QAze_zMGVIAGGukD")' }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Profile Info */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-12 relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                        <div 
                            className="size-28 rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg -mt-16" 
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBkfoXsUmI6_uNtyGmONaItbiKa-co9CCD4wbrGCCsk16VdjRQWOepGbiPIK5RSsiF4R7MkhzVuNXEPBfMRhYJuD50b8APPtQrf--tX0f58Bjf_y6tDwP6GVT3Ty9xNP0Dn03TyXiKaMzQHsUN7cLnFgdyyWZeblZ7YNrmjwnxGjDBH9lKhZ3TpRBe1l0BnRzcbbyDmzfjxNpZ2DzkSHgmRjhlybyOl8KTkqWuanh_9ccSId3VuBXA4wbSVuNzmb7Ry_HjMQcEUVfOb")' }}
                        ></div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h1 className="text-2xl font-bold">Maya Zen</h1>
                                <CheckCircle className="text-primary fill-primary text-white" size={20} />
                            </div>
                            <p className="text-primary font-semibold text-sm mb-2">Wellness & Yoga</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><Users size={16} /> 850k Subscribers</span>
                                <span className="flex items-center gap-1"><MapPin size={16} /> Bali, Indonesia</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => {
                                setIsSubscribed(!isSubscribed);
                                if (!isSubscribed) {
                                    addToast("Successfully subscribed to Maya Zen!", "success");
                                } else {
                                    addToast("Unsubscribed from Maya Zen.", "info");
                                }
                            }}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                                isSubscribed 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700' 
                                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                            }`}
                        >
                            {isSubscribed ? 'Subscribed' : 'Subscribe Now'}
                        </button>
                        <button className="px-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <Share2 className="text-slate-500" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">About the Creator</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                I help high-performing professionals find balance through mindfulness and movement. With over 10 years of experience in Hatha and Vinyasa yoga, my mission is to make wellness accessible to everyone, no matter how busy their schedule.
                            </p>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Social Channels</h4>
                                <div className="flex flex-wrap gap-2">
                                    <a className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm hover:bg-primary/5 hover:text-primary transition-all" href="#">
                                        <Video size={18} />
                                        <span>YouTube</span>
                                    </a>
                                    <a className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm hover:bg-primary/5 hover:text-primary transition-all" href="#">
                                        <Camera size={18} />
                                        <span>Instagram</span>
                                    </a>
                                    <a className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm hover:bg-primary/5 hover:text-primary transition-all" href="#">
                                        <AtSign size={18} />
                                        <span>X (Twitter)</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Subscription Perks</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                        <Check className="text-green-600 dark:text-green-400" size={14} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Weekly Wellness Digest</p>
                                        <p className="text-xs text-slate-500">Curated tips and routines delivered every Monday.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                        <Check className="text-green-600 dark:text-green-400" size={14} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Exclusive Video Access</p>
                                        <p className="text-xs text-slate-500">Early access to new flow sequences and workshops.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                        <Check className="text-green-600 dark:text-green-400" size={14} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Direct Q&A Sessions</p>
                                        <p className="text-xs text-slate-500">Monthly live sessions to answer your wellness questions.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Sample Newsletters</h3>
                                <div className="flex gap-2">
                                    <button className="size-10 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="size-10 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                                {posts.map((post) => (
                                    <div 
                                      key={post.id} 
                                      onClick={() => setSelectedPost(post)}
                                      className="min-w-[320px] max-w-[320px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url("${post.image}")` }}></div>
                                        <div className="p-5">
                                            <div className="text-xs text-primary font-bold uppercase mb-2">{post.category} • {post.date}</div>
                                            <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2">{post.description}</p>
                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                <span className="text-xs text-slate-500">{post.readTime} read</span>
                                                <span className="text-primary text-sm font-bold flex items-center">Preview <ArrowRight size={16} className="ml-1" /></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">LATEST UPDATE</span>
                                    <span className="text-xs text-slate-500">Posted 2 days ago</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">The Secret to Deep Sleep: Yoga Nidra</h3>
                                <p className="text-slate-500 dark:text-slate-300 mb-6 leading-relaxed">
                                    After years of struggling with insomnia, I discovered the practice of Yoga Nidra. It's often called "yogic sleep" and it's one of the most powerful tools for nervous system regulation. In this week's full update, I'm sharing a 20-minute guided session you can use tonight.
                                </p>
                                <div className="relative rounded-xl overflow-hidden mb-8 h-[300px]">
                                    <img alt="Yoga session" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt4L3JUGE4w7RrSb8TkBW2xti-uyOrC76vDpjUvkC7W7eJ9fg6grd63y1pJxnljFNJsyAEfAMTn4Dn6fbm2p0DYPnj-RrWli-_-CAVTVxIGXBEAgwNkVoNFbXHI9q1hMxOQlp4wRuXUN8lFAOrbbqKduU3jrcC31JLjipSA4h8WxbAPU2LdGRI7KWh0TxFhMUUaKmGfmbW_7E7Dx7EoGiD94TqdLcjuBFQRAzSzor2ZPzW8L8pa5lMkP9Ccrr_QAze_zMGVIAGGukD"/>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                                            <Play className="text-primary ml-1" size={32} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
                                            <Heart size={20} /> 1.2k
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
                                            <MessageCircle size={20} /> 84
                                        </button>
                                    </div>
                                    <button 
                                      className="text-primary text-sm font-bold"
                                      onClick={() => setSelectedPost({
                                        title: "The Secret to Deep Sleep: Yoga Nidra",
                                        date: "Jan 14",
                                        content: "After years of struggling with insomnia, I discovered the practice of Yoga Nidra...",
                                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt4L3JUGE4w7RrSb8TkBW2xti-uyOrC76vDpjUvkC7W7eJ9fg6grd63y1pJxnljFNJsyAEfAMTn4Dn6fbm2p0DYPnj-RrWli-_-CAVTVxIGXBEAgwNkVoNFbXHI9q1hMxOQlp4wRuXUN8lFAOrbbqKduU3jrcC31JLjipSA4h8WxbAPU2LdGRI7KWh0TxFhMUUaKmGfmbW_7E7Dx7EoGiD94TqdLcjuBFQRAzSzor2ZPzW8L8pa5lMkP9Ccrr_QAze_zMGVIAGGukD"
                                      })}
                                    >
                                        Read Full Post
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>

        {/* Reading Pane Modal */}
        {selectedPost && (
            <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
                <div 
                    className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase">
                            {selectedPost.category || 'Article'} • {selectedPost.date || 'Today'}
                        </div>
                        <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        {selectedPost.image && (
                            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover rounded-xl mb-6" />
                        )}
                        <h2 className="text-3xl font-bold mb-6">{selectedPost.title}</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                {selectedPost.description || selectedPost.content}
                            </p>
                            <p className="mt-4 text-slate-700 dark:text-slate-300">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p className="mt-4 text-slate-700 dark:text-slate-300">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                            Subscribe to Read Full Story
                        </button>
                    </div>
                </div>
            </div>
        )}
        <MobileBottomNav />
    </div>
  );
};

export default CreatorProfilePage;