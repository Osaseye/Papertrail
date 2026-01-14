import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Check, 
  ChevronRight, 
  Mail, 
  Clock, 
  Zap, 
  Search, 
  UserPlus, 
  User, 
  Calendar, 
  Globe, 
  Phone,
  ArrowRight,
  BadgeCheck,
  X,
  Bell,
  LayoutDashboard,
  Compass,
  Sparkles,
  PartyPopper,
  CheckCircle,
  MailOpen
} from 'lucide-react';

const INTERESTS = [
  "Technology", "Finance", "Health", "Productivity", "Design", 
  "Politics", "Science", "History", "Culture", "Sports"
];

const MOCK_CREATORS = [];

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "EG", name: "Egypt" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "KR", name: "South Korea" },
].sort((a, b) => a.name.localeCompare(b.name));

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for Step 1: Personal Profile
  const [profile, setProfile] = useState({
    preferredName: '',
    dob: '',
    country: '',
    phone: ''
  });

  const [selectedInterests, setSelectedInterests] = useState([]);

  // State for Step 2: Creators
  const [following, setFollowing] = useState([]);
  const [viewingCreator, setViewingCreator] = useState(null);

  // State for Step 3: Subscription
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('free');

  // State for Step 4: Delivery Setup
  const [deliverySettings, setDeliverySettings] = useState({
      frequency: 'Weekly Digest',
      time: '08:00',
      consolidated: true
  });
  
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 4;

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleFollow = (id) => {
    if (following.includes(id)) {
      setFollowing(following.filter(fid => fid !== id));
    } else {
      setFollowing([...following, id]);
    }
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const stepVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  // Helper to determine step title
  const getStepTitle = () => {
    switch (step) {
      case 1: return "Tell us about yourself";
      case 2: return "Explore creators";
      case 3: return "Choose Your Plan";
      case 4: return "Delivery Setup";
      default: return "";
    }
  };
  
  const [progress, setProgress] = useState(0);
  const dataSavedRef = React.useRef(false);

  useEffect(() => {
    const saveUserData = async () => {
        if (isComplete && user && !dataSavedRef.current) {
            dataSavedRef.current = true;
            try {
                // Determine names
                const splitName = profile.preferredName.split(' ');
                const firstName = splitName[0] || '';
                const lastName = splitName.slice(1).join(' ') || '';

                await setDoc(doc(db, 'users', user.uid), {
                    firstName,
                    lastName,
                    fullName: profile.preferredName,
                    dob: profile.dob,
                    country: profile.country, // Store code or name? Usually code from select
                    location: COUNTRIES.find(c => c.code === profile.country)?.name || profile.country,
                    phone: profile.phone,
                    email: user.email,
                    
                    // Preferences
                    interests: selectedInterests,
                    deliverySettings: deliverySettings,
                    billingCycle: billingCycle,
                    subscriptionPlan: selectedPlan,
                    
                    // Metadata
                    role: 'reader',
                    onboardingCompleted: true,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }, { merge: true });

                console.log("User onboarding data saved successfully");
            } catch (error) {
                console.error("Error saving user onboarding data:", error);
            }
        }
    };

    saveUserData();

    if (isComplete) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            navigate('/user/dashboard');
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isComplete, navigate]);

  const getStepSubtitle = () => {
    switch(step) {
      case 1: return "Personal Profile";
      case 2: return "Creators";
      case 3: return "Subscription";
      case 4: return "Delivery";
      default: return "";
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white transition-colors duration-300 flex flex-col items-center justify-center overflow-hidden relative">
        
        {/* Confetti Background */}
        <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
                backgroundImage: 'radial-gradient(#136dec 1px, transparent 1px), radial-gradient(#136dec 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px',
                opacity: 0.05
            }}
        ></div>

        <div className="flex flex-col items-center text-center relative z-10 max-w-md w-full px-6">
            
            {/* Illustration */}
            <div className="w-full aspect-[4/3] relative mb-8 flex items-center justify-center">
                {/* Path */}
                <svg className="absolute w-full h-full text-primary/20" viewBox="0 0 400 300">
                    <path d="M50,250 Q150,50 250,150 T350,50" fill="none" stroke="currentColor" strokeDasharray="12 8" strokeWidth="4"></path>
                </svg>
                
                <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute left-[70%] top-[15%] flex flex-col items-center">
                            <MailOpen className="text-primary w-20 h-20 mb-[-16px] stroke-1" />
                            <div className="bg-primary/20 w-20 h-3 rounded-full blur-md"></div>
                        </div>
                        
                        {/* Floating Envelope */}
                        <div className="absolute left-[15%] top-[60%] animate-bounce duration-[3000ms]">
                            <div className="bg-primary text-white p-5 rounded-2xl shadow-xl shadow-primary/30 transform -rotate-12 border-4 border-white dark:border-background-dark">
                                <Mail className="w-10 h-10" />
                            </div>
                        </div>

                        {/* Sparkles */}
                        <div className="absolute top-10 left-20 text-yellow-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute bottom-20 right-10 text-primary">
                            <PartyPopper className="w-8 h-8" />
                        </div>
                </div>
            </div>

            <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                You're all set, <span className="text-primary">{profile.preferredName || "Alex"}</span>!
            </h1>
            
            <p className="text-[#111418]/60 dark:text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-xs mx-auto mb-10">
                Your personalized trail is being prepared.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mx-auto space-y-2">
                <div className="flex justify-between text-xs font-semibold text-primary">
                    <span>Loading Dashboard</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-primary rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }} // Smooth steps
                    >
                         <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite] skew-x-[-20deg]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>
                    </motion.div>
                </div>
            </div>

        </div>
        
        {/* Background blobs */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="w-full py-4 fixed top-0 bg-background-light dark:bg-background-dark z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo Only - Compact */}
          <div className="h-10 w-auto">
              <img src="/logo.png" alt="Papertrail" className="h-full w-auto object-contain dark:invert" />
          </div>

          {/* Progress Bar - Compact & Top Right */}
          <div className="w-40 flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary">Step {step}/{totalSteps}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="bg-primary h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Adaptive Layout */}
      <main className={`flex-1 w-full flex ${step === 2 || step === 3 ? 'items-start pt-16 px-4 sm:px-6 pb-8' : 'items-center justify-center px-4 pt-20 pb-4'}`}>
        <div className={`${
          step === 2 || step === 3
            ? 'w-full max-w-4xl mx-auto' 
            : step === 4
             ? 'w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-y-auto custom-scrollbar flex flex-col'
             : 'w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 overflow-y-auto custom-scrollbar max-h-[calc(100vh-120px)] flex flex-col'
        }`}>
          
          {step === 4 ? (
            <div className="shrink-0 mb-6">
                <div className="flex items-center justify-between mb-4">
                   <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Delivery Setup</h1>
                   <span className="text-xs font-semibold text-primary">Final Step</span>
                </div>
                <div className="w-full h-1.5 bg-primary rounded-full"></div>
            </div>
          ) : (
          <div className={`text-center shrink-0 ${step === 2 || step === 3 ? 'mb-6' : 'mb-6'}`}>
            <h1 className={`${step === 2 || step === 3 ? 'text-2xl md:text-3xl font-bold mb-2 text-slate-900 dark:text-white' : 'text-xl font-bold mb-1 tracking-tight'}`}>
              {step === 2 ? "Explore creators" : (step === 3 ? "Choose Your Plan" : getStepTitle())}
            </h1>
            {step === 1 && (
              <p className="text-xs text-slate-600 dark:text-slate-400">Help us personalize your experience.</p>
            )}
            {step === 2 && (
               <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                 Connect with top-tier content creators across every niche.
               </p>
            )}
            {step === 3 && (
               <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                 Select the perfect subscription to supercharge your creator discovery.
               </p>
            )}
          </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: PERSONAL PROFILE */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="preferredName">Preferred Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-slate-400" size={16} />
                      </div>
                      <input 
                        type="text" 
                        id="preferredName" 
                        name="preferredName" 
                        value={profile.preferredName}
                        onChange={handleProfileChange}
                        placeholder="What should we call you?" 
                        required
                        className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="dob">Date of Birth</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="text-slate-400" size={16} />
                        </div>
                        <input 
                          type="date" 
                          id="dob" 
                          name="dob" 
                          value={profile.dob}
                          onChange={handleProfileChange}
                          required
                          className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="country">Country/Region</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="text-slate-400" size={16} />
                        </div>
                        <select 
                          id="country" 
                          name="country" 
                          value={profile.country}
                          onChange={handleProfileChange}
                          required
                          className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none"
                        >
                          <option value="" disabled>Select country</option>
                          {COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="phone">
                      Phone Number <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="text-slate-400" size={16} />
                      </div>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={profile.phone}
                        onChange={handleProfileChange}
                        placeholder="+1 (555) 000-0000" 
                        className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
                
                <p className="mt-4 text-center text-[10px] text-slate-400 leading-relaxed px-4">
                  By continuing, you agree to Papertrail's <Link to="#" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link to="#" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}

            {/* STEP 2: CREATORS (Full Width Grid) */}
            {step === 2 && (
               <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex-1 flex flex-col items-center"
              >
                 {/* Centered Search & Filter */}
                 <div className="w-full max-w-xl mb-8 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search creators..." 
                        className="w-full pl-10 pr-20 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm placeholder-slate-400"
                      />
                      <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary hover:bg-blue-700 text-white px-4 rounded-full font-semibold text-xs transition-colors">
                        Explore
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary font-semibold text-xs transition-colors ring-1 ring-primary/10">All</button>
                        {['Tech', 'Finance', 'Sports', 'Lifestyle', 'Travel'].map(cat => (
                            <button key={cat} className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all">{cat}</button>
                        ))}
                    </div>
                 </div>

                  {/* Full Width Grid */}
                  {MOCK_CREATORS.length === 0 ? (
                      <div className="w-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                          <p className="text-slate-500 dark:text-slate-400 font-medium">No creators found to follow yet.</p>
                          <p className="text-xs text-slate-400 mt-2">Check back later as our community grows!</p>
                      </div>
                  ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full mb-8">
                    {MOCK_CREATORS.map((creator) => (
                      <div 
                        key={creator.id} 
                        onClick={() => setViewingCreator(creator)}
                        className={`
                          group relative bg-white dark:bg-slate-800 rounded-xl p-2.5 border transition-all duration-300 flex flex-col cursor-pointer
                          ${following.includes(creator.id) 
                            ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/5' 
                            : 'border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5'
                          }
                        `}
                      >
                         {/* Card Image Area */}
                         <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2.5 bg-slate-100 dark:bg-slate-700">
                             <img src={creator.img || creator.image} alt={creator.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                             <div className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[9px] font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                                {creator.category}
                             </div>
                         </div>

                        {/* Card Content */}
                        <div className="flex flex-col flex-1">
                           <div className="flex items-center justify-between mb-0.5">
                              <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1">
                                {creator.name}
                                {creator.verified && <BadgeCheck className="text-blue-500 fill-white dark:fill-slate-800" size={12} />}
                              </h3>
                              {following.includes(creator.id) && <div className="text-primary"><Check size={14} /></div>}
                           </div>
                           
                           <p className="text-[10px] text-slate-500 line-clamp-2 mb-2 leading-relaxed h-8">
                              {creator.desc || "Creating content that inspires and educates followers around the world."}
                           </p>
                           
                           <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2">
                              <div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">FOLLOWERS</p>
                                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-100">{creator.followers}</p>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFollow(creator.id);
                                }}
                                className={`
                                  h-7 w-7 rounded-full flex items-center justify-center transition-all
                                  ${following.includes(creator.id)
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 hover:border-slate-400'
                                  }
                                `}
                              >
                                {following.includes(creator.id) ? (
                                   <Check size={12} />
                                ) : (
                                   <ArrowRight size={12} className="-rotate-45" />
                                )}
                              </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}

                  {/* Creator Detail Modal */}
                  <AnimatePresence>
                    {viewingCreator && (
                        <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setViewingCreator(null)}
                        >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setViewingCreator(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <X size={18} />
                            </button>
                            
                            <div className="relative h-40 bg-slate-200 dark:bg-slate-800">
                                <img src={viewingCreator.img || viewingCreator.image} alt={viewingCreator.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-5 text-white">
                                    <h2 className="text-xl font-bold flex items-center gap-1.5">
                                        {viewingCreator.name}
                                        {viewingCreator.verified && <BadgeCheck className="text-blue-400 fill-blue-500/20" size={18} />}
                                    </h2>
                                    <p className="text-white/80 font-medium text-sm">{viewingCreator.category}</p>
                                </div>
                            </div>
                            
                            <div className="p-5 space-y-5">
                                <div className="flex justify-between items-center text-center px-2">
                                    <div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{viewingCreator.followers}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Followers</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                                    <div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">4.8</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rating</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                                    <div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">98%</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</p>
                                    </div>
                                </div>
                                
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                    {viewingCreator.desc || "Creating content that inspires and educates followers around the world. Join my community for exclusive insights and updates."}
                                </p>
                                
                                <button 
                                    onClick={() => {
                                        toggleFollow(viewingCreator.id);
                                    }}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        following.includes(viewingCreator.id)
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                                        : 'bg-primary hover:bg-blue-700 text-white shadow-lg shadow-primary/25'
                                    }`}
                                >
                                    {following.includes(viewingCreator.id) ? (
                                        <>
                                            <Check size={18} />
                                            Subscribed
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={18} />
                                            Subscribe
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                        </motion.div>
                    )}
                  </AnimatePresence>

                 {/* Navigation Buttons for Step 2 */}
                 <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-center z-50">
                    <div className="w-full max-w-7xl flex justify-between items-center px-4">
                        <button onClick={handleBack} className="text-slate-500 font-medium px-6 py-3 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            Back
                        </button>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 font-medium hidden sm:block">
                                {following.length} selected
                            </span>
                            <button 
                                onClick={handleNext} 
                                className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all transform active:scale-95"
                            >
                                Continue
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Spacer for fixed footer */}
                <div className="h-20" />

              </motion.div>
            )}

            {/* STEP 3: SUBSCRIPTION PLANS */}
             {step === 3 && (
                <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full flex-1 flex flex-col items-center"
                >
                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Monthly</span>
                        <div 
                            className="relative w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer transition-colors p-1"
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        >
                             <motion.div 
                                className="w-4 h-4 bg-white rounded-full shadow-sm"
                                animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                             />
                        </div>
                        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Yearly</span>
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Save 20%
                        </span>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
                         {/* Free Plan */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col transition-all hover:shadow-xl relative overflow-hidden">
                             <div className="mb-6">
                                <h2 className="text-xl font-bold mb-1">Free</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Essential tools for individuals starting out.</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight">₦0</span>
                                    <span className="text-slate-500 ml-1 text-sm">/mo</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {[
                                    "Limited creators (Up to 5)",
                                    "Standard delivery times",
                                    "Basic analytics dashboard"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="text-primary shrink-0" size={18} />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => setSelectedPlan('free')}
                                className={`w-full py-3 px-6 rounded-xl font-bold transition-colors text-sm ${
                                    selectedPlan === 'free' 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700' 
                                    : 'border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {selectedPlan === 'free' ? 'Current Plan' : 'Select Free'}
                            </button>
                        </div>

                        {/* Pro Plan (Middle Tier) */}
                         <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col transition-all hover:shadow-xl relative overflow-hidden">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-1">Pro</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">For growing creators and brands.</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {billingCycle === 'monthly' ? '₦3,500' : '₦33,600'}
                                    </span>
                                    <span className="text-slate-500 ml-1 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {[
                                    "Up to 20 creators",
                                    "Advanced analytics",
                                    "Priority email support",
                                    "Weekly performance digest"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="text-primary shrink-0" size={18} />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => setSelectedPlan('pro')}
                                className={`w-full py-3 px-6 rounded-xl font-bold transition-colors text-sm ${
                                    selectedPlan === 'pro' 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700' 
                                    : 'border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {selectedPlan === 'pro' ? 'Selected' : 'Select Pro'}
                            </button>
                        </div>

                         {/* Premium Plan */}
                         <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-primary shadow-2xl shadow-primary/10 flex flex-col transition-all">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Recommended
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-1">Premium</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Unlock the full power of Papertrail.</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {billingCycle === 'monthly' ? '₦8,000' : '₦76,800'}
                                    </span>
                                    <span className="text-slate-500 ml-1 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {[
                                    "Unlimited creators",
                                    "Custom delivery times",
                                    "No ads & exclusive content",
                                    "Priority 24/7 support",
                                    "Advanced collaboration tools"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="text-primary shrink-0" size={18} />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => setSelectedPlan('premium')}
                                className="w-full py-3 px-6 rounded-xl bg-primary text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 text-sm"
                            >
                                {selectedPlan === 'premium' ? 'Selected' : 'Upgrade to Premium'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center pb-8">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 mb-4">
                            <Clock className="w-3 h-3" />
                            Secure payment processing via Stripe. Cancel anytime.
                        </p>
                         <div className="flex justify-center gap-4">
                            <button onClick={handleBack} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm px-6 py-2 transition-colors">
                                Back to Step 2
                            </button>
                             <button 
                                onClick={handleNext} 
                                className="bg-primary hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
             )}

            {/* STEP 4: DELIVERY SETUP */}
            {step === 4 && (
               <motion.div 
                key="step4"
                 variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full flex-1 flex flex-col"
              >
                     <p className="text-slate-600 dark:text-slate-400 mb-4 text-xs leading-relaxed">
                        Choose how you want to receive your content. These settings will apply to all your subscriptions unless customized individually.
                     </p>
                     
                     <div className="space-y-4 flex-1">
                        {/* Frequency */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="frequency">
                                Global Delivery Frequency
                            </label>
                            <div className="relative">
                                <select 
                                    id="frequency"
                                    value={deliverySettings.frequency}
                                    onChange={(e) => setDeliverySettings({...deliverySettings, frequency: e.target.value})}
                                    className="block w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary appearance-none transition-all outline-none text-sm"
                                >
                                    <option>Daily</option>
                                    <option>Weekly Digest</option>
                                    <option>Monthly Roundup</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <ChevronRight className="rotate-90 text-slate-400" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Time */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="delivery-time">
                                Preferred Delivery Time
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Clock className="text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                </div>
                                <input 
                                    id="delivery-time" 
                                    type="time" 
                                    value={deliverySettings.time}
                                    onChange={(e) => setDeliverySettings({...deliverySettings, time: e.target.value})}
                                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Consolidated Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                             <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">Consolidated Trail</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Combine all your newsletters into a single email</span>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={deliverySettings.consolidated}
                                    onChange={(e) => setDeliverySettings({...deliverySettings, consolidated: e.target.checked})}
                                    className="sr-only peer" 
                                />
                                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                             </label>
                        </div>

                         <div className="pt-2 mt-auto">
                            <button 
                                onClick={handleNext}
                                className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group"
                            >
                                Complete Setup
                                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <p className="text-center mt-3 text-[10px] text-slate-400">
                                You can always change these settings in your profile dashboard.
                            </p>
                        </div>
                     </div>

                 <div className="flex justify-center pb-0 pt-2">
                  <button onClick={handleBack} className="text-slate-500 font-medium px-4 py-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-xs">
                    Back to Subscription
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer (Step 1 only usually, but good to have generally) */}
      <footer className="py-8 text-center w-full">
        <div className="text-xs text-slate-400">
            © 2026 Papertrail. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default OnboardingPage;
