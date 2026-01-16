import React, { useState, useEffect } from 'react';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
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
  Calendar,
  PenTool
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Modal from '../../components/ui/Modal';

const CreatorNewsletters = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  useEffect(() => {
    const fetchNewsletters = async () => {
        if (!user) return;
        
        try {
            // Simplified query to avoid Composite Index requirement
            const q = query(
                collection(db, 'newsletters'), 
                where('creatorId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Normalize status
                    statusDisplay: data.status === 'sent' ? 'Published' : data.status === 'scheduled' ? 'Scheduled' : 'Draft',
                    // Stats mapping
                    openRate: data.stats?.openRate || 0,
                    clicks: data.stats?.clicks || 0, 
                };
            });

            // Sort Client-Side (Desc by UpdatedAt)
            items.sort((a, b) => {
                const dateA = a.updatedAt?.seconds || 0;
                const dateB = b.updatedAt?.seconds || 0;
                return dateB - dateA;
            });

            setNewsletters(items);
        } catch (error) {
            console.error("Error fetching newsletters:", error);
            addToast("Failed to fetch newsletters", "error");
        } finally {
            setLoading(false);
        }
    };
    
    fetchNewsletters();
  }, [user, addToast]);

  const confirmDelete = (newsletterId) => {
    setDeleteTargetId(newsletterId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
      if (!deleteTargetId) return;
      
      try {
          await deleteDoc(doc(db, 'newsletters', deleteTargetId));
          setNewsletters(prev => prev.filter(n => n.id !== deleteTargetId));
          addToast("Newsletter deleted successfully.", "success");
      } catch (error) {
          console.error("Error deleting newsletter:", error);
          addToast("Failed to delete. Please try again.", "error");
      } finally {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
      }
  };

  const filteredNewsletters = activeTab === 'All' 
    ? newsletters 
    : newsletters.filter(n => n.statusDisplay === activeTab);


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
                {filteredNewsletters.length > 0 ? (
                    filteredNewsletters.map((newsletter) => (
                        <div 
                            key={newsletter.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow group"
                        >
                             {/* ... existing card content ... */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                                        newsletter.status === 'draft' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                        newsletter.status === 'scheduled' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500' :
                                        'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500'
                                    }`}>
                                        {newsletter.status === 'draft' ? <FileText size={20} /> :
                                         newsletter.status === 'scheduled' ? <Clock size={20} /> :
                                         <CheckCircle size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/creator/editor', { state: { newsletterId: newsletter.id } })}>
                                                {newsletter.subject || 'Untitled Newsletter'}
                                            </h3>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                                newsletter.status === 'draft' ? 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' :
                                                newsletter.status === 'scheduled' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-900/30' :
                                                'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/10 dark:text-green-500 dark:border-green-900/30'
                                            }`}>
                                                {newsletter.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 limit-text-2-lines">
                                            {newsletter.previewText || 'No preview available'}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {newsletter.updatedAt?.toDate ? newsletter.updatedAt.toDate().toLocaleDateString() : 'Just now'}
                                            </span>
                                            {newsletter.stats && (
                                                <>
                                                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                                    <span className="text-slate-700 dark:text-slate-300">Opens: {newsletter.stats.opens || 0}</span>
                                                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                                                    <span className="text-slate-700 dark:text-slate-300">Clicks: {newsletter.stats.clicks || 0}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-centconfirm-2">
                                    {newsletter.status === 'draft' && (
                                        <>
                                            <button 
                                                onClick={() => navigate('/creator/editor', { state: { newsletterId: newsletter.id } })}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Edit"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(newsletter.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" 
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                    {newsletter.status === 'sent' && (
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
                    ))
                ) : (
                     <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 mt-8">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                            <PenTool className="size-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No newsletters found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm mb-6">
                            {activeTab === 'All' 
                                ? "You haven't created any newsletters yet. Start writing your first post!" 
                                : `You don't have any ${activeTab.toLowerCase()} newsletters.`}
                        </p>
                        <button 
                            onClick={() => navigate('/creator/editor')}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                        >
                            Create First Draft
                        </button>
                    </div>
                )}
            </div>

        </main>
        <CreatorMobileBottomNav />

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Newsletter" size="sm">
            <div className="space-y-4">
                 <p className="text-slate-600 dark:text-slate-300">
                    Are you sure you want to delete this newsletter? This action cannot be undone.
                 </p>
                 <div className="flex justify-end gap-2 pt-4">
                     <button 
                        onClick={() => setIsDeleteModalOpen(false)} 
                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleDelete} 
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                     >
                        Delete Forever
                     </button>
                 </div>
            </div>
        </Modal>

      </div>
    </div>
  );
};

export default CreatorNewsletters;
