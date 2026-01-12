import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Typewriter = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let interval;
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return <span className="font-mono">{displayText}<span className="animate-pulse">|</span></span>;
};

const NavLink = ({ href, children, isActive }) => (
  <a className={`text-sm font-bold transition-colors relative py-1 ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`} href={href}>
    {children}
    {isActive && (
      <motion.div
        layoutId="activeNav"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </a>
);

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['readers', 'creators', 'how-it-works', 'pricing'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-slate-100 font-display transition-colors duration-300 overflow-x-hidden w-full">
      <header className="sticky top-0 z-50 w-full border-b border-solid border-[#e7ebf3] dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 lg:px-20 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
                <img src="/logo.png" alt="Papertrail" className="h-10 w-auto object-contain" />
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink href="#readers" isActive={activeSection === 'readers'}>For Readers</NavLink>
            <NavLink href="#creators" isActive={activeSection === 'creators'}>For Creators</NavLink>
            <NavLink href="#how-it-works" isActive={activeSection === 'how-it-works'}>How it Works</NavLink>
            <NavLink href="#pricing" isActive={activeSection === 'pricing'}>Pricing</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#e7ebf3] dark:bg-slate-800 text-[#0d121b] dark:text-white text-sm font-bold tracking-tight hover:bg-[#d1d9e7] dark:hover:bg-slate-700 transition-colors">
                Log In
            </Link>
            <Link to="/register" className="min-w-[100px] sm:min-w-[120px] flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold tracking-tight hover:opacity-90 transition-opacity">
                <span className="sm:hidden">Join Now</span>
                <span className="hidden sm:inline">Get Started</span>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative overflow-hidden bg-white dark:bg-slate-950 pt-10 pb-16 border-b border-slate-100 dark:border-slate-800"
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                Your Newsletters, <span className="text-primary">Reimagined</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                The bridge between deep reading and high-impact writing. Choose your path to get started.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Readers Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="group relative flex flex-col p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 transition-all hover:ring-2 hover:ring-primary/20"
              >
                <div className="mb-4 size-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">auto_stories</span>
                </div>
                <h3 className="text-2xl font-black mb-2 italic">I'm a Reader</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-base">
                  Tame your inbox with a unified daily digest. Read on your terms, without the noise.
                </p>
                <div className="mt-auto">
                  <Link to="/register?role=user" className="inline-block text-center w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform">
                    Start Reading
                  </Link>
                </div>
                <div className="mt-8 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white dark:bg-slate-800 rounded-t-xl p-3 shadow-xl border-t border-x border-slate-200 dark:border-slate-700 h-24 overflow-hidden">
                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded"></div>
                      <div className="h-1.5 w-3/4 bg-slate-50 dark:bg-slate-900 rounded"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Creators Card */}
              <motion.div 
                 whileHover={{ y: -5 }}
                 className="group relative flex flex-col p-8 rounded-3xl creator-gradient text-white transition-all shadow-xl"
              >
                <div className="mb-4 size-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">edit_note</span>
                </div>
                <h3 className="text-2xl font-black mb-2 italic">I'm a Writer</h3>
                <p className="text-white/80 mb-6 text-base">
                  Own your audience. Powerful AI tools to draft, distribute, and monetize your brilliance.
                </p>
                <div className="mt-auto">
                  <Link to="/register?role=creator" className="inline-block text-center w-full sm:w-auto px-6 py-3 bg-white text-primary font-bold rounded-xl hover:scale-105 transition-transform shadow-md">
                    Start Creating
                  </Link>
                </div>
                <div className="mt-8 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-900/40 rounded-t-xl p-3 shadow-xl border-t border-x border-white/10 h-24 overflow-hidden">
                    <div className="flex gap-2 mb-3">
                      <div className="size-2 rounded-full bg-white/20"></div>
                      <div className="h-2 w-16 bg-white/20 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-white/10 rounded"></div>
                      <div className="h-1.5 w-1/2 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="py-24 bg-white dark:bg-slate-950"
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-6 p-8 lg:p-12 rounded-[2.5rem] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                <span className="text-primary font-black uppercase tracking-widest text-sm">For Readers</span>
                <h2 className="text-4xl font-black">Inbox Sanity</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Stop hunting through 50 different emails. Papertrail extracts the signal from the noise, presenting your subscriptions in a beautiful, unified interface.
                </p>
                <ul className="space-y-4 my-4">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">done_all</span> Aggregated Daily Digest</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">notifications_off</span> Zero distractions, zero ads</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">history_edu</span> Highlight &amp; Save insights</li>
                </ul>
              </div>
              <div className="flex flex-col gap-6 p-8 lg:p-12 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 font-black uppercase tracking-widest text-sm">For Creators</span>
                <h2 className="text-4xl font-black">Platform Independence</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Don't let algorithms control your reach. Own your mailing list and your revenue with tools built to respect both you and your readers.
                </p>
                <ul className="space-y-4 my-4">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">group_add</span> Portable Audience Data</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">payments</span> Integrated 90/10 Split Revenue</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">bar_chart</span> Advanced Reader Analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="py-24 bg-background-light dark:bg-background-dark border-y border-slate-200 dark:border-slate-800" id="readers">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="mb-32">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-black mb-4 tracking-tight">Featured Creators</h2>
                  <p className="text-slate-500">Join thousands reading these top voices.</p>
                </div>
                <div className="flex gap-2">
                  <button className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Creator Cards */}
                {[
                  { name: "The Daily Pulse", category: "Tech & Design", desc: "Navigating the future of digital experience and AI ethics.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVcOZoKYVlytpAgHnDSTfccTmLsO8aKTFe7whdTDApTsbnxwZyRCyJSL_QSzze_Zb66IxZbxc1y47W3UoLkMRdTOgQIZRaenpPNea7nG6hDqsOtY8qSOAyDjDigkzAhlLitmHqiXE4IhG7cJm5MIGxrgm0wOIYOoE5_IGQn3skk5LEos-URtytIsbVRdmmdD-mDg7vKOt_y2eSkUj6XSvw5hnHmCXmllUqzAJ1X7Dgu6PY1beT_Nnmh5S_BTi5DDF92DQsRdkTIty" },
                  { name: "Market Flow", category: "Finance", desc: "Expert market analysis without the Wall Street jargon.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_iNXDpTWpMK6t2-hSkaJ44Ze5AoxNJFsHVukWgZgZTcbnrIwMAlu8dXH7aaVXYRtm2921LUVkOiKw8MEZ8fRG3bsrATSycK3r-w5yIueyW3PxUVrrVgxpxZn1zKYDS4sF60dxpv_x4w2L6iqC4P-zMieZxk3CWQPdmZ0yhNXWotDcO4BZS_X57JnXFy8Efm9O04xtGEp-gIM4eJXqZuNWX8XLM1nYborqUR3PbJmE0wr5Vso0aQRfjxT432tlZuoViJUnEpJ36aDX" },
                  { name: "Mind & Body", category: "Health", desc: "Science-backed wellness tips for the busy professional.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAytzmb7_8eXx1PArnyCk2SLWtyNk-RXdFQF0A5r2_Xp0bVGv-0nwuxOXhw6AM7vM9P--z-ebgqdwqpcf6YDoVJaylAvTobiOsY5szcR47nFx9VejiBoIMvpodwW11sBEBhJxyuZly0SuJP1l1aKS74ULZ9LS6cu4Uw94G_wQCUx7w2jMH2i7GozyP4zGiYwwDN5ZEdv86r6cdEBKZBA-mqqVftIg6G_TxcljoXhoQNykARAdWGyxbI0cIpgL6ZF4jLOH_0P28wbAZN" },
                  { name: "Modern Mind", category: "Philosophy", desc: "Applying timeless wisdom to 21st-century challenges.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9rQHY0tlzmkwNduIxE1Y-X31xT4XctiKfusucB5tEWRDex3RnqlVnVYFcLRzvPqbnb_MfI6BQYdpq2OyXmIjXjVVQBghfteS1W8m999OGXdDweYZS4tOuo6iL52TOnkamgtWzhvbSK_Huv54NBn73QTO7ROJtZClouEg-tSU_frL8qtXtNEjrA1KALQQxzZQv4ok-TxPtiQ2nXPqNv9rNie3sNFpXo0mXZHC0zWrhI7R0IgUkImnWy-DLqBycpYxDoPDImV933Fmg" }
                ].map((item, index) => (
                    <motion.div variants={fadeIn} key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden">
                        <img alt="Profile" className="w-full h-full object-cover" src={item.img} />
                        </div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-sm text-primary font-bold mb-4">{item.category}</p>
                        <p className="text-slate-500 text-sm mb-6">{item.desc}</p>
                        <button className="w-full py-2 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">Subscribe</button>
                    </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" id="creators">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1 relative"
              >
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                    </div>
                    <h5 className="font-bold">AI Writing Assistant</h5>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-tighter">Drafting Prompt</p>
                      <p className="text-sm italic">"Summarize my recent market analysis into a 5-bullet summary for the daily digest view."</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <p className="text-xs text-primary mb-2 font-mono uppercase tracking-tighter">AI Suggestion</p>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                         <Typewriter delay={1000} text="Here is a high-impact summary of your market analysis: • Sector growth up 15% YoY • Consumer confidence stabilized • Emerging markets showing strong resistance. Would you like to expand on any point?" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -left-10 size-40 bg-primary/5 rounded-full blur-3xl"></div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <h2 className="text-4xl font-black mb-6 tracking-tight">Powerful Tools for Powerful Ideas</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Our creator studio is built for the modern writer. From AI-assisted drafting to seamless cross-platform distribution, we provide everything you need to build a media empire.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    <div>
                      <h4 className="font-bold">Smart Formatting</h4>
                      <p className="text-sm text-slate-500">Automatically optimize your newsletter for both mobile and the unified Papertrail digest.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    <div>
                      <h4 className="font-bold">Reader Insights</h4>
                      <p className="text-sm text-slate-500">See what your readers are highlighting and where they spend the most time.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden" id="how-it-works">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black mb-4">How it Works</h2>
              <p className="text-slate-500">A seamless ecosystem for both sides of the page.</p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px path-line hidden lg:block"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="space-y-16"
                >
                  <div className="text-center lg:text-right mb-8">
                    <span className="px-4 py-1 rounded-full bg-blue-100 text-primary text-xs font-black uppercase tracking-widest">Reader Path</span>
                  </div>
                  {[
                    { step: 1, title: "Connect Subscriptions", desc: "Sync your email or browse our directory to find voices you love." },
                    { step: 2, title: "Define Your Schedule", desc: "Choose when your digest arrives. Once a day? Once a week? You decide." },
                    { step: 3, title: "Focus & Enjoy", desc: "Read in a clean, distraction-free environment optimized for focus." }
                  ].map((item, idx) => (
                    <motion.div variants={fadeIn} key={idx} className="relative flex lg:flex-row-reverse items-center gap-6">
                        <div className="size-12 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 shrink-0 font-bold">{item.step}</div>
                        <div className="lg:text-right">
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: true, margin: "-100px" }}
                   variants={staggerContainer}
                   className="space-y-16"
                >
                  <div className="text-center lg:text-left mb-8">
                    <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">Creator Path</span>
                  </div>
                  {[
                    { step: 1, title: "Craft Your Story", desc: "Use our minimalist editor and AI tools to write your best content." },
                    { step: 2, title: "Grow Your Audience", desc: "Get discovered by readers browsing the Papertrail network." },
                    { step: 3, title: "Direct Monetization", desc: "Keep 90% of your subscription revenue. No hidden platform fees." }
                  ].map((item, idx) => (
                    <motion.div variants={fadeIn} key={idx} className="relative flex items-center gap-6">
                        <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center z-10 shrink-0 font-bold">{item.step}</div>
                        <div className="text-left">
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="pricing">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
              <p className="text-slate-500">Whether you read or write, we've got you covered.</p>
            </div>
            <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeIn} 
             className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
                <h3 className="text-xl font-bold mb-2">Premium Reader</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black">₦15,000</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Unlimited newsletter bundles</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Custom delivery timing</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Highlights &amp; Audio-mode</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-sm">check_circle</span> Zero advertisements</li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-primary text-white font-black hover:opacity-90 transition-opacity">Get Started</button>
              </div>
              <div className="bg-slate-900 text-white p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded">Pro</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Creator Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black">₦35,000</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span> 90% Revenue Retention</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span> AI Drafting Assistant</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span> Advanced Audience CRM</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-400 text-sm">check_circle</span> Priority Discovery Listing</li>
                </ul>
                <button className="w-full py-4 rounded-xl bg-white text-slate-900 font-black hover:bg-slate-100 transition-colors">Start Building</button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1),_transparent)]"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black mb-6">Join the future of publishing.</h2>
                <p className="text-white/80 text-lg mb-10">Whether you're looking for your next great read or your next 10,000 subscribers, Papertrail is home.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/register?role=user" className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-xl hover:scale-105 transition-transform">Start Reading</Link>
                  <Link to="/register?role=creator" className="inline-block px-8 py-4 bg-primary border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">Apply as Creator</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Landing-specific footer with short write-ups instead of link lists */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <img src="/logo.png" alt="Papertrail" className="h-12 mb-4" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Papertrail brings clarity to your inbox and power to your pen. We help readers rediscover focus and creators build direct, lasting relationships with their audience.
            </p>
          </div>

          <div>
            <h5 className="font-bold mb-2">For Readers</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">Curate the newsletters you actually want to read. Papertrail bundles, highlights, and delivers them on your schedule so you can consume high-quality writing without the overwhelm.</p>
          </div>

          <div>
            <h5 className="font-bold mb-2">For Creators</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">Own your audience and monetize directly. Our tools help you write, publish, and grow while keeping the relationship between you and your readers simple and sustainable.</p>
          </div>

          <div>
            <h5 className="font-bold mb-2">About</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">We’re a small team focused on long-form reading and independent writers. No advertisements, no algorithmic manipulation — just better reading and better publishing.</p>
          </div>
        </div>

            <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400 px-4">
          © {new Date().getFullYear()} Papertrail Technologies Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

