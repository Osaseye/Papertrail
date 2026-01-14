import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { 
  doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc, serverTimestamp, orderBy, updateDoc, increment 
} from 'firebase/firestore';
import { 
  CheckCircle, Users, MapPin, Share2, Video, Camera, AtSign, 
  Check, ChevronLeft, ChevronRight, ArrowRight, Play, Heart, MessageCircle, ArrowLeft, X,
  UserX, User
} from 'lucide-react';
import MobileBottomNav from '../../components/layout/MobileBottomNav';

const CreatorProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  
  const [creatorData, setCreatorData] = useState(null);
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        // Fetch Creator Data (from creator-brands)
        const brandRef = doc(db, 'creator-brands', id);
        const brandSnap = await getDoc(brandRef);

        // Fallback or additional fetch if needed, but primary is creator-brands
        if (brandSnap.exists()) {
          setCreatorData({ id: brandSnap.id, ...brandSnap.data() });
          
          // Fetch Creator's Public Newsletters
          const qPosts = query(
              collection(db, 'newsletters'), 
              where("creatorId", "==", id),
              where("status", "==", "sent"),
              orderBy("sentAt", "desc")
          );
          const querySnapshot = await getDocs(qPosts);
          const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPostsData(posts);
        } else {
           // Handle case where creator brand doesn't exist (maybe check 'users' if we support fallback, but strictly creator-brands for now)
           console.log("Creator brand not found");
        }
        
        // Check Subscription Status if user is logged in
        if (user) {
            // Check in the creator's subscribers subcollection
            const qSub = query(
                collection(db, 'creator-brands', id, 'subscribers'),
                where("uid", "==", user.uid)
            );
            const subSnapshot = await getDocs(qSub);
            if (!subSnapshot.empty) {
                setIsSubscribed(true);
                setSubscriptionId(subSnapshot.docs[0].id);
            }
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);

  const handleSubscribe = async () => {
      if (!user) {
          addToast("Please login to subscribe", "info");
          navigate('/login');
          return;
      }
      
      setSubLoading(true);
      try {
          if (isSubscribed) {
              // Unsubscribe
              if (subscriptionId) {
                  await deleteDoc(doc(db, 'creator-brands', id, 'subscribers', subscriptionId));
                  setIsSubscribed(false);
                  setSubscriptionId(null);
                  addToast("Unsubscribed successfully.", "info");
              }
          } else {
              // Subscribe
              const docRef = await addDoc(collection(db, 'creator-brands', id, 'subscribers'), {
                  uid: user.uid,
                  email: user.email,
                  name: user.displayName || 'User',
                  status: 'active',
                  joinedAt: serverTimestamp(),
                  source: 'platform_profile'
              });
              setIsSubscribed(true);
              setSubscriptionId(docRef.id);
              addToast(`Subscribed to ${creatorData.brandName || creatorData.name || 'creator'}!`, "success");
          }
      } catch (error) {
          console.error("Error updating subscription:", error);
          addToast("Failed to update subscription", "error");
      } finally {
          setSubLoading(false);
      }
  };

  if (loading) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
       </div>
    );
  }

  if (!creatorData) {
      return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-200">
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
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full mb-4">
                     <UserX size={48} className="text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Creator Not Found</h1>
                <p className="text-slate-500 max-w-md mb-6">
                    We couldn't find the creator you're looking for. They might have changed their handle or deleted their account.
                </p>
                <button 
                    onClick={() => navigate('/explore')}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                    Browse Creators
                </button>
            </main>
        </div>
      );
  }

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    // Analytics: Track Open
    try {
        const newsletterRef = doc(db, 'newsletters', post.id);
        await updateDoc(newsletterRef, {
            'stats.opens': increment(1)
        });
    } catch (error) {
        console.error("Error tracking open:", error);
    }
  };

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
                style={{ backgroundImage: creatorData.cover ? `url("${creatorData.cover}")` : undefined }}
            >
               {!creatorData.cover && <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Profile Info */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-12 relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                        <div 
                            className="size-28 rounded-2xl bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg -mt-16 bg-slate-200 dark:bg-slate-800 flex items-center justify-center" 
                            style={{ backgroundImage: creatorData.avatar ? `url("${creatorData.avatar}")` : undefined }}
                        >
                             {!creatorData.avatar && <User size={40} className="text-slate-400" />}
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h1 className="text-2xl font-bold">{creatorData.brandName || creatorData.name || 'Creator'}</h1>
                                <CheckCircle className="text-primary fill-primary text-white" size={20} />
                            </div>
                            <p className="text-primary font-semibold text-sm mb-2">{creatorData.niche || 'Digital Creator'}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><Users size={16} /> {creatorData.subscribers || 0} Subscribers</span>
                                <span className="flex items-center gap-1"><MapPin size={16} /> {creatorData.location || 'Global'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={handleSubscribe}
                            disabled={subLoading}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                                isSubscribed 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700' 
                                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                            }`}
                        >
                            {subLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                            ) : null}
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
                                {creatorData.bio || creatorData.description || 'This creator has not added a bio yet.'}
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
                                        <p className="text-sm font-semibold">Weekly Newsletter</p>
                                        <p className="text-xs text-slate-500">Get insights directly to your inbox.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="size-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                        <Check className="text-green-600 dark:text-green-400" size={14} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Community Access</p>
                                        <p className="text-xs text-slate-500">Join the discussion with other subscribers.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {postsData.length > 0 ? (
                           <>
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold">Latest Posts</h3>
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
                                        {postsData.map((post) => (
                                            <div 
                                              key={post.id} 
                                              onClick={() => handlePostClick(post)}
                                              className="min-w-[320px] max-w-[320px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                            >
                                                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: post.image ? `url("${post.image}")` : undefined }}>
                                                    {!post.image && <div className="w-full h-full bg-slate-100 dark:bg-slate-800"></div>}
                                                </div>
                                                <div className="p-5">
                                                    <div className="text-xs text-primary font-bold uppercase mb-2">{post.category || 'General'}</div>
                                                    <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors limit-text-2-lines">{post.subject || post.title}</h4>
                                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                        <span className="text-xs text-slate-500">{post.readTime || '5 min'} read</span>
                                                        <span className="text-primary text-sm font-bold flex items-center">Read <ArrowRight size={16} className="ml-1" /></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                           </>
                        ) : (
                             <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 flex flex-col items-center justify-center text-center">
                                <p className="text-slate-500 font-medium">This creator hasn't published any newsletters yet.</p>
                             </section>
                        )}
                        
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
                            {selectedPost.category || 'Article'}
                        </div>
                        <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        {selectedPost.image && (
                            <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover rounded-xl mb-6" />
                        )}
                        <h2 className="text-3xl font-bold mb-6">{selectedPost.subject || selectedPost.title}</h2>
                        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }}></div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default CreatorProfilePage;