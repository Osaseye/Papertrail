import React, { useState, useEffect } from 'react';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, where, Timestamp, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
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
  TrendingUp,
  UserX,
  Loader2,
  Trash2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CreatorSubscribers = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState('All');
  
  // Data States
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Subscriber Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [newSubscriberName, setNewSubscriberName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const fetchSubscribers = async () => {
      if (!user) return;
      try {
          setLoading(true);
          // Assuming a subcollection for simplified rule management per creator
          const subRef = collection(db, 'creator-brands', user.uid, 'subscribers');
          const q = query(subRef, orderBy('joinedAt', 'desc'));
          const querySnapshot = await getDocs(q);
          
          const subs = [];
          querySnapshot.forEach((doc) => {
              subs.push({ id: doc.id, ...doc.data() });
          });
          setSubscribers(subs);
      } catch (error) {
          console.error("Error fetching subscribers:", error);
          // addToast("Failed to load subscribers", "error");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchSubscribers();
  }, [user]);

  const handleAddSubscriber = async (e) => {
      e.preventDefault();
      if (!newSubscriberEmail) return;

      try {
          setIsAdding(true);
          const subRef = collection(db, 'creator-brands', user.uid, 'subscribers');
          
          // Check if already exists (client-side check for now, rules should enforce uniqueness too)
          // Ideally query firestore, but we can just add and let backend handle or check here.
          // Simple check:
          const exists = subscribers.find(s => s.email === newSubscriberEmail);
          if (exists) {
              addToast("Subscriber already exists", "error");
              return;
          }

          await addDoc(subRef, {
              email: newSubscriberEmail,
              name: newSubscriberName || 'Unknown',
              status: 'active',
              joinedAt: serverTimestamp(),
              engagement: { openRate: 0, clickRate: 0 }
          });

          addToast("Subscriber added successfully", "success");
          setIsAddModalOpen(false);
          setNewSubscriberEmail('');
          setNewSubscriberName('');
          fetchSubscribers(); // Refresh list

      } catch (error) {
          console.error("Error adding subscriber:", error);
          addToast("Failed to add subscriber", "error");
      } finally {
          setIsAdding(false);
      }
  };

  const handleOpenDeleteModal = (sub) => {
      setSubscriberToDelete(sub);
      setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
      if (!subscriberToDelete) return;

      try {
          setIsDeleting(true);
          const { id: subscriberId, uid: subscriberUid } = subscriberToDelete;

          // 1. Remove from Creator's Subscriber List
          await deleteDoc(doc(db, 'creator-brands', user.uid, 'subscribers', subscriberId));

          // 2. Decrement Count - Calculate exact count instead of relying on increment(-1) to fix potential sync issues
          // Since we just deleted one, the new count is current list length - 1
          const newCount = Math.max(0, subscribers.length - 1);
          await updateDoc(doc(db, 'creator-brands', user.uid), {
              subscribers: newCount 
          });

          // 3. (Optional cleanliness) Remove from User's side
          if (subscriberUid) {
               try {
                  await deleteDoc(doc(db, 'users', subscriberUid, 'subscriptions', user.uid));
               } catch (err) {
                   console.warn("Could not remove from user's list (permission?)", err);
               }
          }

          addToast("Subscriber removed", "success");
          setIsDeleteModalOpen(false);
          setSubscriberToDelete(null);
          // Refresh full list to update UI
          fetchSubscribers(); 
      } catch (error) {
          console.error("Error deleting subscriber:", error);
          addToast("Failed to delete subscriber", "error");
      } finally {
          setIsDeleting(false);
      }
  };

  const filteredSubscribers = subscribers.filter(sub => {
      const matchesFilter = filter === 'All' || sub.status.toLowerCase() === filter.toLowerCase();
      const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
      <CreatorSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Subscriber"
        size="sm"
      >
        <form onSubmit={handleAddSubscriber} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required
                    value={newSubscriberEmail}
                    onChange={(e) => setNewSubscriberEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="subscriber@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name (Optional)</label>
                <input 
                    type="text" 
                    value={newSubscriberName}
                    onChange={(e) => setNewSubscriberName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="John Doe"
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={isAdding}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {isAdding && <Loader2 className="animate-spin" size={16} />}
                    Add Subscriber
                </button>
            </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Subscriber"
        size="sm"
      >
        <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to remove <span className="font-bold">{subscriberToDelete?.email}</span>? 
                They will no longer receive your newsletters. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
                <button 
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                    Cancel
                </button>
                <button 
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {isDeleting && <Loader2 className="animate-spin" size={16} />}
                    Remove
                </button>
            </div>
        </div>
      </Modal>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-6 z-10 w-full">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Subscribers</h1>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                    <Download size={16} /> <span className="hidden md:inline">Export CSV</span>
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm flex items-center gap-2"
                >
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
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{subscribers.length}</h2>
                        <span className="text-slate-400 text-sm font-semibold flex items-center gap-1">
                            <TrendingUp size={14} className="text-green-500" /> +0%
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Open Rate (Avg)</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">0%</h2>
                        <span className="text-slate-400 text-sm font-semibold flex items-center gap-1">-</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Active Subscribers</p>
                    <div className="flex items-end justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {subscribers.filter(s => s.status === 'active').length}
                        </h2>
                        <div className="flex -space-x-2">
                            {/* Empty avatars */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center p-10">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : filteredSubscribers.length > 0 ? (
                    <>
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
                                    {filteredSubscribers.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                                        {sub.name ? sub.name[0].toUpperCase() : sub.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{sub.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-500">{sub.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                    sub.status === 'active' 
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                                                    : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {sub.joinedAt?.seconds ? new Date(sub.joinedAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><Mail size={12} /> {sub.engagement?.openRate || 0}%</span>
                                                    {/* <span className="flex items-center gap-1"><MousePointer2 size={12} /> {sub.engagement?.clickRate || 0}%</span> */}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleOpenDeleteModal(sub)}
                                                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                    title="Remove Subscriber"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                             {filteredSubscribers.map(sub => (
                                 <div key={sub.id} className="p-4 space-y-3">
                                     <div className="flex items-center justify-between">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                                                {sub.name ? sub.name[0].toUpperCase() : sub.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{sub.name || 'Unknown'}</p>
                                                <p className="text-xs text-slate-500">{sub.email}</p>
                                            </div>
                                         </div>
                                         <button 
                                            onClick={() => handleOpenDeleteModal(sub)}
                                            className="p-2 text-slate-400 hover:text-red-500"
                                         >
                                            <Trash2 size={16} />
                                         </button>
                                     </div>
                                 </div>
                             ))}
                        </div>

                         <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500">
                            <span>Showing {filteredSubscribers.length} of {subscribers.length}</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800" disabled>Prev</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800" disabled>Next</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
                            <UserX className="size-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No subscribers yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm mb-6">
                            You haven't added any subscribers yet. Share your profile or add them manually to get started.
                        </p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                        >
                            Add First Subscriber
                        </button>
                    </div>
                )}
            </div>

        </main>
        <CreatorMobileBottomNav />
      </div>
    </div>
  );
};

export default CreatorSubscribers;
