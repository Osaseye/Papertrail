import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { 
  Save, 
  Send, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  Sparkles, 
  Bot, 
  ChevronRight, 
  RefreshCw, 
  FileText, 
  HelpCircle,
  Eye,
  Loader2
} from 'lucide-react';

const CreatorEditor = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Editor State
  const [newsletterId, setNewsletterId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (location.state?.newsletterId) {
        setNewsletterId(location.state.newsletterId);
        const loadNewsletter = async () => {
            try {
                const docRef = doc(db, 'newsletters', location.state.newsletterId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // verify ownership
                    if (data.creatorId !== user?.uid) {
                        addToast("You don't have permission to edit this.", 'error');
                        navigate('/creator/newsletters');
                        return;
                    }
                    setTitle(data.subject || '');
                    setContent(data.content || '');
                    if (contentRef.current) {
                        contentRef.current.innerHTML = data.content || '';
                    }
                }
            } catch (error) {
                console.error("Error loading newsletter:", error);
                addToast("Failed to load newsletter", "error");
            }
        };
        if (user) loadNewsletter();
    }
  }, [location.state, user, navigate, addToast]);
  
  // Modal States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true); // Default open on desktop

  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I help you write your newsletter today?", sender: 'ai' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add User Message
    const userMsg = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate AI Response
    setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: "I can help with that! (AI integration coming soon)", sender: 'ai' }]);
    }, 1000);
  };

  const saveToFirestore = async (status) => {
      if (!user) {
          addToast('You must be logged in to save.', 'error');
          return;
      }
      if (!title.trim()) {
          addToast('Please enter a subject line.', 'error');
          return;
      }

      setIsSaving(true);
      try {
          // Get content from ref if state is lagging or for direct access
          const currentContent = contentRef.current?.innerHTML || content;
          
          // Basic preview text derivation (first 150 chars of text)
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = currentContent;
          const plainText = tempDiv.textContent || tempDiv.innerText || "";
          const previewText = plainText.slice(0, 150) + (plainText.length > 150 ? "..." : "");

          const newsletterData = {
              creatorId: user.uid,
              subject: title, // Stored as 'subject' in DB
              previewText: previewText,
              content: currentContent, 
              status: status, // 'draft' or 'sent'
              updatedAt: serverTimestamp(),
          };

          if (status === 'sent') {
             newsletterData.sentAt = serverTimestamp();
          }

          if (newsletterId) {
             await updateDoc(doc(db, 'newsletters', newsletterId), newsletterData);
          } else {
             newsletterData.createdAt = serverTimestamp();
             newsletterData.stats = {
                  openRate: 0,
                  clickRate: 0,
                  opens: 0,
                  clicks: 0
              };
             const docRef = await addDoc(collection(db, 'newsletters'), newsletterData);
             setNewsletterId(docRef.id);
          }

          addToast(status === 'sent' ? 'Newsletter sent successfully!' : 'Draft saved successfully.', 'success');
          
          if (status === 'sent') {
              setIsScheduleOpen(false);
              navigate('/creator/dashboard');
          } else {
              setIsSaveModalOpen(false);
              setIsDataSaved(true);
              setTimeout(() => setIsDataSaved(false), 3000);
          }

      } catch (error) {
          console.error("Error saving newsletter:", error);
          addToast('Failed to save. Please try again.', 'error');
      } finally {
          setIsSaving(false);
      }
  };

  const handleExecCommand = (command) => {
      document.execCommand(command, false, null);
      if (contentRef.current) {
          setContent(contentRef.current.innerHTML);
      }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''} bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200`}>
      <CreatorSidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 lg:px-6 z-40">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Draft</span>
                    <span className="text-sm font-semibold truncate max-w-[120px] md:max-w-[200px] text-slate-900 dark:text-white">{title || "Untitled Draft"}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="p-2 md:px-4 md:py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                    title="Preview"
                >
                    <Eye size={18} />
                    <span className="hidden md:inline">Preview</span>
                </button>
                <button 
                    onClick={() => saveToFirestore('draft')}
                    disabled={isSaving}
                    className="p-2 md:px-4 md:py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                    title="Save Draft"
                >
                    <Save size={18} />
                    <span className="hidden md:inline">{isSaving ? "Saving..." : isDataSaved ? "Saved!" : "Save"}</span>
                </button>
                <button 
                    onClick={() => setIsScheduleOpen(true)}
                    className="bg-primary text-white p-2 md:px-5 md:py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-shadow shadow-sm flex items-center gap-2"
                    title="Send"
                >
                    <Send size={16} />
                    <span className="hidden md:inline">Send</span>
                </button>
                <button 
                    onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Sparkles size={18} className={isAiSidebarOpen ? "text-primary" : ""} />
                </button>
            </div>
        </header>

        {/* Editor Main Area */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Toolbar & Canvas */}
            <section className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
                
                {/* Formatting Toolbar */}
                <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center lg:justify-center gap-1 px-4 shrink-0 overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg min-w-max">
                        <button onClick={() => handleExecCommand('bold')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all shadow-sm transform active:scale-95"><Bold size={18} /></button>
                        <button onClick={() => handleExecCommand('italic')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all shadow-sm transform active:scale-95"><Italic size={18} /></button>
                        <button onClick={() => handleExecCommand('insertUnorderedList')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all shadow-sm transform active:scale-95"><List size={18} /></button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all shadow-sm transform active:scale-95"><AlignLeft size={18} /></button>
                        <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all shadow-sm transform active:scale-95"><AlignCenter size={18} /></button>
                    </div>
                </div>

                {/* Text Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar pb-32 md:pb-8">
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm min-h-[500px] md:min-h-[800px] p-6 md:p-12 mb-10 transition-colors">
                        <input 
                            className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none focus:ring-0 p-0 mb-6 md:mb-8 placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white outline-none" 
                            placeholder="Enter newsletter subject..." 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="prose dark:prose-invert prose-slate max-w-none prose-sm md:prose-base">
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 italic border-l-4 border-slate-200 dark:border-slate-700 pl-4">
                                Start writing your masterpiece here...
                            </p>
                            <div 
                                ref={contentRef}
                                className="editor-content min-h-[400px] cursor-text outline-none focus:outline-none" 
                                contentEditable="true" 
                                suppressContentEditableWarning={true}
                                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                            >
                                <p>Type your content here...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Assistant Sidebar with Chat Interface */}
            <aside className={`
                w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col
                fixed inset-y-0 right-0 z-[60] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isAiSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:shadow-none hidden lg:flex'}
            `}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between lg:justify-start gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg">
                            <Sparkles size={20} className="text-primary" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">AI Assistant</h3>
                    </div>
                     {/* Close button for mobile */}
                    <button 
                        onClick={() => setIsAiSidebarOpen(false)}
                        className="lg:hidden p-1 text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tools Section */}
                    {/* ... (AI Tools kept as UI placeholder) ... */}
                    <div className="p-6 pb-2 shrink-0 border-b border-slate-100 dark:border-slate-800/50">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group mb-4">
                            <div className="flex items-center gap-3">
                                <Bot size={18} className="text-primary" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Generate newsletter</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
                         {messages.map((msg) => (
                             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                     msg.sender === 'user' 
                                     ? 'bg-primary text-white rounded-br-none shadow-sm' 
                                     : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                                 }`}>
                                     {msg.text}
                                 </div>
                             </div>
                         ))}
                         <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="relative">
                            <input 
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder-slate-400 outline-none" 
                                placeholder="Ask AI to help write..." 
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </div>
      
      {/* Overlay for mobile AI sidebar */}
      {isAiSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsAiSidebarOpen(false)}
        />
      )}
    
        {/* Modals */}
        {/* Preview Modal */}
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Preview Newsletter" size="lg">
             <div className="p-4 bg-white dark:bg-slate-900 rounded-lg min-h-[400px]">
                 <h1 className="text-3xl font-bold mb-4 border-b pb-4">{title || "Untitled Draft"}</h1>
                 <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: contentRef.current?.innerHTML || content }}>
                 </div>
                 <div className="mt-8 flex justify-end">
                     <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Close Preview</button>
                 </div>
             </div>
        </Modal>

        {/* Schedule/Send Modal */}
        <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Confirm Send" size="sm">
             <div className="space-y-4">
                 <p className="text-slate-600 dark:text-slate-300">Are you ready to send this newsletter to your subscribers?</p>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                     <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Summary</p>
                     <ul className="text-xs text-slate-500 space-y-1">
                         <li>Subject: {title}</li>
                         <li>Recipients: All Subscribers</li>
                     </ul>
                 </div>
                 <div className="flex justify-end gap-2 pt-4">
                     <button onClick={() => setIsScheduleOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                     <button 
                        onClick={() => saveToFirestore('sent')} 
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                     >
                        {isSaving && <Loader2 className="animate-spin" size={16} />}
                        Send Now
                     </button>
                 </div>
             </div>
        </Modal>

      <CreatorMobileBottomNav />
    </div>
  );
};

export default CreatorEditor;
