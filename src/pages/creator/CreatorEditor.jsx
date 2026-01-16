import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

// Custom Image Extension to support resizing
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: element => element.style.width,
        renderHTML: attributes => {
          return {
            style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
          }
        }
      }
    }
  }
});

import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { db, storage, aiModel } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { 
  Save, 
  Send, 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered,
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Sparkles, 
  Bot, 
  ChevronRight, 
  RefreshCw, 
  FileText, 
  HelpCircle,
  Eye,
  Loader2,
  Undo,
  Redo,
  Quote
} from 'lucide-react';

const MenuBar = ({ editor, addImage, openLinkModal }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-20">
      <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('underline') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Bullet List"
          >
            <List size={18} />
          </button>
           <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Quote"
          >
            <Quote size={18} />
          </button>
      </div>

      <div className="flex items-center gap-1">
           <button
             onClick={openLinkModal}
            className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-800 text-primary' : 'text-slate-600 dark:text-slate-400'}`}
            title="Link"
          >
            <LinkIcon size={18} />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            title="Add Image"
          >
            <ImageIcon size={18} />
          </button>
      </div>

       <div className="flex items-center gap-1 ml-auto border-l border-slate-300 dark:border-slate-700 pl-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-30"
          >
             <Undo size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-30"
          >
             <Redo size={18} />
          </button>
      </div>
    </div>
  )
}

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
  // const [content, setContent] = useState(''); // Managed by Tiptap
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastGenerationTime, setLastGenerationTime] = useState(0);
  const [brandContext, setBrandContext] = useState({ name: '', niche: '', description: '' });
  const chatEndRef = useRef(null);

  // Initialize Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      CustomImage.configure({
        inline: true,
        allowBase64: true, // Only for preview, we upload to Storage
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing story...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
        attributes: {
            class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] outline-none break-words',
        },
    },
    onUpdate: ({ editor }) => {
       // Optional: Force scroll to bottom if needed, or handle container expansion logic here if manually controlling height
    }
  });

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  // Local Persistence Key
  const DRAFT_KEY = `papertrail_draft_${user?.uid}`;

  // Restore State from Local Storage or DB
  useEffect(() => {
    const restoreState = async () => {
        if (!user || !editor) return;

        // 1. If explicit newsletterId is passed (Editing existing), load from DB
        if (location.state?.newsletterId) {
            setNewsletterId(location.state.newsletterId);
            try {
                const docRef = doc(db, 'newsletters', location.state.newsletterId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.creatorId !== user?.uid) {
                        addToast("You don't have permission.", 'error'); 
                        return navigate('/creator/newsletters');
                    }
                    setTitle(data.subject || '');
                    editor.commands.setContent(data.content || '');
                }
            } catch (e) {
                console.error("DB Load Error", e);
            }
            return;
        }

        // 2. If NO newsletterId, checks Local Storage for unsaved draft
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setTitle(parsed.title || '');
                if (parsed.content) editor.commands.setContent(parsed.content);
                if (parsed.messages) setMessages(parsed.messages);
                // addToast("Restored your unsaved draft", "info");
            } catch (e) {
                console.error("Local Restore Error", e);
            }
        }
    };
    
    restoreState();
  }, [user, editor, location.state]);

  // Save State to Local Storage (Auto-save)
  useEffect(() => {
    if (!user || !editor) return;
    // Don't overwrite local draft if we are editing an existing DB document (unless we want to specific logic for that)
    // For now, let's only auto-save 'new' drafts to the general key
    if (newsletterId) return; 

    const saveLocal = setTimeout(() => {
        const content = editor.getHTML();
        // Only save if there's actual content
        if (title || !editor.isEmpty) {
            const draftData = {
                title,
                content,
                messages,
                timestamp: Date.now()
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
        }
    }, 1000); // Debounce 1s

    return () => clearTimeout(saveLocal);
  }, [title, editor?.state.doc, messages, user, newsletterId]);

  // Fetch Brand Context for AI
  useEffect(() => {
    const fetchBrandContext = async () => {
        if (!user) return;
        try {
            const brandRef = doc(db, 'creator-brands', user.uid);
            const brandSnap = await getDoc(brandRef);
            if (brandSnap.exists()) {
                const data = brandSnap.data();
                setBrandContext({
                    name: data.brandName || user.displayName || 'Newsletter Brand',
                    niche: data.niche || 'General',
                    description: data.description || ''
                });
            }
        } catch (error) {
            console.error("Error fetching brand context:", error);
        }
    };
    fetchBrandContext();
  }, [user]);

  const addImage = () => {
      fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
          addToast("Please upload an image file", "error");
          return;
      }
      
      // Limit size 5MB
      if (file.size > 5 * 1024 * 1024) {
          addToast("Image size must be less than 5MB", "error");
          return;
      }

      try {
          addToast("Uploading image...", "info");
          const storageRef = ref(storage, `creator-content/${user.uid}/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          
          if (editor) {
              editor.chain().focus().setImage({ src: url }).run();
          }
      } catch (error) {
          console.error("Upload failed", error);
          addToast("Failed to upload image", "error");
      } finally {
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = '';
      }
  };
  
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const openLinkModal = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setIsLinkModalOpen(true);
  };

  const saveLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setIsLinkModalOpen(false);
  };

  const handleGenerateNewsletter = async () => {
    if (isAiLoading) return;

    // Rate Limiting: 60 seconds cooldown
    const now = Date.now();
    const COOLDOWN_MS = 60000;
    if (now - lastGenerationTime < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastGenerationTime)) / 1000);
        addToast(`Please wait ${remainingSeconds}s before generating again.`, 'error');
        return;
    }

    if (!title.trim()) {
        addToast("Please enter a subject line first to guide the AI.", "error");
        return;
    }

    if (!editor) return;

    // Confirmation if content exists
    if (!editor.isEmpty) {
        if (!window.confirm("This will overwrite your current content. Are you sure?")) {
            return;
        }
    }

    setIsAiLoading(true);
    try {
        addToast("Generating your draft...", "info");
        const prompt = `Act as an expert newsletter writer for the brand "${brandContext.name}" (Niche: ${brandContext.niche}).
        
        Brand Description: "${brandContext.description}"
        
        Task: Write a complete, engaging newsletter based on the subject: "${title}".
        
        Requirements:
        - Return ONLY the HTML body content (e.g. starting with <h1> or <div>).
        - IMPORTANT: Do NOT include <html>, <head>, <body> tags, <!DOCTYPE>, or <style> blocks.
        - Do NOT use classes or IDs. Use semantic HTML only.
        - Headings (<h1>, <h2>): Make them clear and distinct.
        - Paragraphs (<p>): Use proper spacing.
        - Lists (<ul>, <ol>): Use lists for key points.
        - Formatting: Use <strong> for bold and <em> for italics.
        - Structure: 
            1. Engaging Hook/Greeting
            2. Main Content (broken into sections)
            3. Key Takeaway
            4. Call to Action
        - Tone: Professional but personal, aligned with the brand.
        - Return raw HTML only.
        `;

        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        console.log("Raw AI Response:", text); // Debugging

        // Cleanup potential markdown artifacts more robustly
        text = text.replace(/^```html\s*/i, '')  // Remove leading ```html
                   .replace(/^```\s*/i, '')      // Remove leading ```
                   .replace(/\s*```$/i, '')      // Remove trailing ```
                   .trim();

        console.log("Cleaned Content:", text); // Debugging

        if (editor) {
            editor.commands.setContent(text);
        } else {
            console.error("Editor instance not found");
        }
        
        setLastGenerationTime(Date.now());
        addToast("Newsletter draft generated!", "success");
        
        // Add context to chat
        setMessages(prev => [...prev, { 
            id: Date.now(), 
            text: `I've generated a draft for "${title}". Let me know if you want to refine any specific section!`, 
            sender: 'ai' 
        }]);

    } catch (error) {
        console.error("Generation Error:", error);
        if (error.message && error.message.includes('429')) {
             addToast("Too many requests. Please take a break.", "error");
        } else {
             addToast("Failed to generate content. Please try again.", "error");
        }
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAiLoading) return;
    
    // Rate Limiting for Chat: 5 seconds
    // ... we can reuse strict cooldown or just rely on isLoading but let's be safe
    
    // Add User Message
    const userText = inputMessage;
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiLoading(true);

    try {
        // Build prompt with context
        const currentContent = editor ? editor.getText() : '';
        const prompt = `You are a helpful AI assistant for the newsletter brand "${brandContext.name}" (Niche: ${brandContext.niche}).
        
Brand Description: "${brandContext.description}"

Context:
- Newsletter Title: "${title}"
- Current Content Excerpt: "${currentContent.slice(0, 1000)}"

User Request: "${userText}"

Provide a concise, helpful response. If asked to write content, provide the text directly.`;

        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        setMessages(prev => [...prev, { id: Date.now(), text: text, sender: 'ai' }]);
    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { id: Date.now(), text: "I'm having trouble connecting to the AI service right now. Please try again later.", sender: 'ai' }]);
    } finally {
        setIsAiLoading(false);
    }
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
          // Get content from Tiptap
          const currentContent = editor ? editor.getHTML() : '';
          
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
              localStorage.removeItem(DRAFT_KEY); // Clear local draft
              navigate('/creator/dashboard');
          } else {
              setIsSaveModalOpen(false);
              setIsDataSaved(true);
              localStorage.removeItem(DRAFT_KEY); // Clear local draft
              setTimeout(() => setIsDataSaved(false), 3000);
          }

      } catch (error) {
          console.error("Error saving newsletter:", error);
          addToast('Failed to save. Please try again.', 'error');
      } finally {
          setIsSaving(false);
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
                
                {/* Tiptap Menu Bar */}
                <MenuBar editor={editor} addImage={addImage} openLinkModal={openLinkModal} />

                {/* Text Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar pb-32 md:pb-8">
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm min-h-[800px] h-fit p-6 md:p-12 mb-10 transition-colors relative flex flex-col">
                        <input 
                            className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none focus:ring-0 p-0 mb-6 md:mb-8 placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white outline-none shrink-0" 
                            placeholder="Enter newsletter subject..." 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                         {editor && (
                            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} shouldShow={({ editor }) => editor.isActive('image')}>
                                <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex items-center gap-1 z-50">
                                <button
                                    onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()}
                                    className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-600"
                                >
                                    25%
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}
                                    className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-600"
                                >
                                    50%
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().updateAttributes('image', { width: '75%' }).run()}
                                    className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-600"
                                >
                                    75%
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}
                                    className="px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-600"
                                >
                                    100%
                                </button>
                                </div>
                            </BubbleMenu>
                         )}
                         <EditorContent editor={editor} className="flex-1 w-full" />
                    </div>
                </div>
                
                {/* Hidden File Input for Image Upload */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                />
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
                        <button 
                            onClick={handleGenerateNewsletter}
                            disabled={isAiLoading || !editor}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors group mb-4 ${
                                isAiLoading 
                                ? 'border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed opacity-75' 
                                : 'border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {isAiLoading ? (
                                    <Loader2 size={18} className="text-primary animate-spin" />
                                ) : (
                                    <Bot size={18} className="text-primary" />
                                )}
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {isAiLoading ? "Generating..." : "Generate newsletter"}
                                </span>
                            </div>
                            {!isAiLoading && <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />}
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
                        {/* AI Loading Indicator */}
                        {isAiLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 text-slate-500 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 p-3 shadow-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-xs font-medium">Thinking...</span>
                                </div>
                            </div>
                        )}
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
                            {inputMessage ? (
                             <button 
                                onClick={handleSendMessage}
                                disabled={isAiLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-blue-700 transition-colors p-1"
                            >
                                {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
                            </button>
                        ) : null}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </div>
{/* Styles for ProseMirror to ensure it expands the parent container properly */}
<style>{`
    .ProseMirror {
        min-height: 500px;
        outline: none;
        height: 100%;
    }
    .ProseMirror p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }
    /* Ensure images inside editor don't overflow */
    .ProseMirror img {
        max-width: 100%;
        height: auto;
    }
`}</style>
      
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
                 <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : '' }}>
                 </div>
                 <div className="mt-8 flex justify-end">
                     <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Close Preview</button>
                 </div>
             </div>
        </Modal>

        {/* Link Modal */}
        <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Insert Link" size="sm">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && saveLink()}
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setIsLinkModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                    <button onClick={saveLink} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Save Link</button>
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
