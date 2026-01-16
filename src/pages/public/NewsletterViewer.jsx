import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const NewsletterViewer = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState(null);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // 1. Fetch Newsletter
        const docRef = doc(db, 'newsletters', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Newsletter not found.");
          return;
        }

        const data = docSnap.data();
        setNewsletter(data);

        // 2. Fetch Creator Brand (for header)
        if (data.creatorId) {
            const brandRef = doc(db, 'creator-brands', data.creatorId);
            const brandSnap = await getDoc(brandRef);
            if (brandSnap.exists()) {
                setBrand(brandSnap.data());
            }
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Oops!</h1>
        <p className="text-slate-500 mb-4">{error}</p>
        <Link to="/" className="text-primary hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-serif">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
             <Link to="/" className="text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft size={20} />
             </Link>
             <div className="font-sans font-bold text-lg tracking-tight">
                 {brand ? brand.brandName : "Papertrail"}
             </div>
             <div className="w-5" /> {/* Spacer */}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
         {/* Metadata */}
         <header className="mb-8 md:mb-12 text-center">
             <div className="flex items-center justify-center gap-3 mb-4">
                {brand?.avatar && (
                    <img src={brand.avatar} alt="Brand" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                )}
                <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-sans">{brand?.brandName || "Unknown Creator"}</p>
                    <p className="text-xs text-slate-500">{newsletter?.updatedAt?.seconds ? format(new Date(newsletter.updatedAt.seconds * 1000), 'MMMM d, yyyy') : 'Recently'}</p>
                </div>
             </div>
             <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                 {newsletter.subject}
             </h1>
             {newsletter.previewText && (
                 <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-sans">
                     {newsletter.previewText}
                 </p>
             )}
         </header>

         {/* Content - Prose Wrapper */}
         <article className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-blue-600 prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
         </article>

         {/* Footer */}
         <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 font-sans">
             <p className="text-sm">Published via <strong>Papertrail</strong></p>
         </footer>
      </main>
    </div>
  );
};

export default NewsletterViewer;
