import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const niches = [
  'Technology', 'Finance', 'Health & Wellness', 'Lifestyle', 'Food & Cooking', 
  'Travel', 'Education', 'Gaming', 'Art & Design', 'Business', 'Marketing',
  'Politics', 'Science', 'Sports', 'Music', 'Photography', 'Writing'
];

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Sam', 'Jamie', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Cameron', 'Reese', 'Rowan', 'Parker', 'Dakota', 'Hayden', 'Sawyer', 'Emerson', 'Finley'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const newsletterTopics = {
  'Technology': ['The Future of AI', 'Coding Best Practices', 'Latest Gadgets Review', 'Cybersecurity Trends'],
  'Finance': ['Investing 101', 'Crypto Market Update', 'Saving for Retirement', 'Understanding Stocks'],
  'Health & Wellness': ['Morning Routine Tips', 'Nutrition Myths Debunked', 'Home Workout Guide', 'Mental Health Matters'],
  'Lifestyle': ['Minimalist Living', 'Productivity Hacks', 'Interior Design Ideas', 'Sustainable Fashion'],
  'Food & Cooking': ['Easy Weeknight Dinners', 'Baking Sourdough', 'Vegan Recipes', 'Restaurant Reviews'],
  'Travel': ['Backpacking Europe', 'Hidden Gems in Asia', 'Travel on a Budget', 'Luxury Escapes'],
  // Fallback
  'General': ['Weekly Update', 'My Thoughts', 'Recent News', 'Community Highlights']
};

const SeedPage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev.slice(-19), msg]); // Keep last 20 logs

  const seedDatabase = async () => {
    setLoading(true);
    setProgress(0);
    setLogs([]);
    addLog("Starting seeding process...");

    try {
      for (let i = 0; i < 50; i++) {
        const niche = niches[Math.floor(Math.random() * niches.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        const brandName = `${firstName}'s ${niche} Corner`;
        
        // Create Creator
        const creatorData = {
          name,
          brandName, // Using brandName as primary display if available
          niche,
          bio: `I write about ${niche} and share my insights with the world. Join my newsletter to stay updated!`,
          subscribers: Math.floor(Math.random() * 5000) + 10,
          location: 'Global',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
          cover: null, // Could use unsplash source URL if needed, but keeping simple
          createdAt: serverTimestamp(),
          isVerified: Math.random() > 0.8
        };

        const creatorRef = await addDoc(collection(db, 'creator-brands'), creatorData);
        addLog(`Created creator: ${brandName} (${creatorRef.id})`);

        // Create Newsletters for this creator
        const numNewsletters = Math.floor(Math.random() * 3) + 1;
        const topics = newsletterTopics[niche] || newsletterTopics['General'];

        for (let j = 0; j < numNewsletters; j++) {
          const topic = topics[Math.floor(Math.random() * topics.length)];
          const newsletterData = {
            creatorId: creatorRef.id,
            title: `${topic} - Issue #${j + 1}`,
            description: `In this issue, we dive deep into ${topic.toLowerCase()}...`,
            content: `<p>Welcome to another edition of <strong>${brandName}</strong>!</p><p>Here is what we are covering today about ${topic}...</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
            status: 'sent',
            sentAt: serverTimestamp(),
            stats: {
              opens: Math.floor(Math.random() * 1000),
              clicks: Math.floor(Math.random() * 100)
            },
            coverImage: null
          };

          await addDoc(collection(db, 'newsletters'), newsletterData);
        }
        
        setProgress(Math.round(((i + 1) / 50) * 100));
      }

      addLog("Seeding complete!");
    } catch (error) {
      console.error("Error seeding database:", error);
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Database Seeder</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          This tool will generate 50 mock creators with varied niches and newsletters in your Firestore database.
        </p>
        
        <div className="mb-6 bg-slate-100 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs h-40 overflow-y-auto border border-slate-200 dark:border-slate-800">
          {logs.length === 0 ? <span className="text-slate-400">Ready to start...</span> : logs.map((log, i) => (
            <div key={i} className="mb-1 text-slate-700 dark:text-slate-300">{log}</div>
          ))}
        </div>

        {loading && (
          <div className="mb-4">
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-xs text-slate-500 mt-1">{progress}%</p>
          </div>
        )}

        <button
          onClick={seedDatabase}
          disabled={loading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Seeding Database...' : 'Seed 50 Creators'}
        </button>
      </div>
    </div>
  );
};

export default SeedPage;
