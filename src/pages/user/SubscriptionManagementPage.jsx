import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2,
  ExternalLink,
  Ban
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

const SubscriptionManagementPage = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) return;

        // Listen to User's Subscriptions Subcollection
        const q = query(collection(db, 'users', user.uid, 'subscriptions'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSubscriptions(subs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching subscriptions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleUnsubscribe = async (subId, creatorId) => {
        if (!confirm("Are you sure you want to unsubscribe?")) return;
        
        try {
            // Delete from user side
            await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', subId));
            
            // Delete from creator side to keep sync
            // The subId here IS the creatorId in the new system, but for legacy compatibility we use creatorId arg if passed, or fall back to subId
            const targetCreatorId = creatorId || subId;
            
            if (targetCreatorId) {
                // Remove from creator's subscribers list
                await deleteDoc(doc(db, 'creator-brands', targetCreatorId, 'subscribers', user.uid));
                
                // Decrement stats
                await updateDoc(doc(db, 'creator-brands', targetCreatorId), {
                    subscribers: increment(-1)
                });
            }

            addToast('Unsubscribed successfully', 'success');
        } catch (error) {
            console.error("Error unsubscribing", error);
            addToast('Failed to unsubscribe', 'error');
        }
    };

    const handleToggleMute = async (sub) => {
        try {
            const newStatus = sub.status === 'muted' ? 'active' : 'muted';
            await updateDoc(doc(db, 'users', user.uid, 'subscriptions', sub.id), {
                status: newStatus
            });
            addToast(`Notifications ${newStatus === 'muted' ? 'muted' : 'resumed'}`, 'info');
        } catch (error) {
            addToast('Action failed', 'error');
        }
    }

    const filteredSubs = subscriptions.filter(sub => {
        const name = sub.brandName || sub.creatorName || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-6">
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscriptions</h1>
                                <p className="text-slate-500 dark:text-slate-400">Manage your newsletter content sources.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search creators..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">Loading subscriptions...</div>
                            ) : filteredSubs.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                        <Search size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No subscriptions found</h3>
                                        <p className="text-slate-500">You haven't subscribed to any newsletters yet.</p>
                                    </div>
                                    <Link to="/explore" className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
                                        Explore Creators
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredSubs.map((sub) => (
                                        <div key={sub.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                                    {(sub.avatar || sub.creatorAvatar) ? (
                                                        <img src={sub.avatar || sub.creatorAvatar} alt={sub.brandName || sub.creatorName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-bold text-slate-500">{(sub.brandName || sub.creatorName || '?')[0]}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{sub.brandName || sub.creatorName || 'Unknown Creator'}</h3>
                                                    <p className="text-sm text-slate-500">Subscribed on {sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleDateString() : 'Unknown date'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    // In new system id = creatorId, but we fallback
                                                    to={`/creator/${sub.creatorId || sub.id}`} 
                                                    className="p-2 text-slate-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                
                                                    title="Visit Profile"
                                                >
                                                    <ExternalLink size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleUnsubscribe(sub.id, sub.creatorId)}
                                                    className={`p-2 rounded-lg transition-colors ${sub.status === 'muted' ? 'text-orange-500 bg-orange-50' : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'}`}
                                                    title={sub.status === 'muted' ? "Unmute" : "Mute Notifications"}
                                                >
                                                    <Ban size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleUnsubscribe(sub.id, sub.creatorId)}
                                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Unsubscribe"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
                <MobileBottomNav />
            </div>
        </div>
    );
};

export default SubscriptionManagementPage;
