import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  MailOpen,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

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

const NICHES = [
    "Technology", "Finance", "Health", "Productivity", "Design", 
    "Politics", "Science", "History", "Culture", "Sports", "Lifestyle", "Marketing"
];

const CreatorOnboardingPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for Step 1: Personal Profile
  const [profile, setProfile] = useState({
    fullName: '',
    dob: '',
    country: '',
    phone: '',
    avatar: null,
    avatarPreview: null
  });

  // State for Step 2: Brand Identity
  const [brand, setBrand] = useState({
    name: '',
    description: '',
    niche: '',
    website: '',
    avatar: null,
    avatarPreview: null
  });

  // State for Step 3: Subscription Plan
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('free');
  
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 3;

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: file, avatarPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandChange = (e) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setBrand(prev => ({
                ...prev,
                avatar: file,
                avatarPreview: reader.result
            }));
        };
        reader.readAsDataURL(file);
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
      case 1: return "Personal Information";
      case 2: return "Brand Identity";
      case 3: return "Choose Your Plan";
      default: return "";
    }
  };
  
  const [progress, setProgress] = useState(0);
  const hasUpgraded = React.useRef(false);

  // Effect to handle user upgrade
  React.useEffect(() => {
    const submitOnboardingData = async () => {
        if (isComplete && !hasUpgraded.current && user) {
            hasUpgraded.current = true;
            
            try {
                let profileAvatarUrl = null;
                let brandAvatarUrl = null;

                // 1. Upload Profile Avatar
                if (profile.avatar) {
                    const profileRef = ref(storage, `creator-profiles/${user.uid}/avatar`);
                    await uploadBytes(profileRef, profile.avatar);
                    profileAvatarUrl = await getDownloadURL(profileRef);
                }

                // 2. Upload Brand Avatar
                if (brand.avatar) {
                    const brandRef = ref(storage, `creator-brands/${user.uid}/avatar`);
                    await uploadBytes(brandRef, brand.avatar);
                    brandAvatarUrl = await getDownloadURL(brandRef);
                }

                // 3. Update Firestore
                // A. Create/Update Public Brand Document
                const brandRef = doc(db, 'creator-brands', user.uid);
                await setDoc(brandRef, {
                    brandName: brand.name, // Public Display Name key: brandName
                    description: brand.description,
                    niche: brand.niche,
                    website: brand.website,
                    avatar: brandAvatarUrl, 
                    email: user.email,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    subscribers: 0,
                    stats: {
                        totalNewsletters: 0,
                        totalOpens: 0
                    }
                });

                // B. Update User Profile (or 'creators' collection for account details)
                const creatorRef = doc(db, 'creators', user.uid);
                await setDoc(creatorRef, {
                    // Personal Identity
                    fullName: profile.fullName,
                    dob: profile.dob,
                    country: profile.country,
                    phone: profile.phone,
                    personalPhoto: profileAvatarUrl, 
                    
                    // Subscription
                    subscriptionPlan: selectedPlan,
                    billingCycle: billingCycle,
                    
                    // System
                    email: user.email,
                    role: 'creator',
                    isVerified: false,
                    onboardingComplete: true,
                    createdAt: serverTimestamp()
                }, { merge: true });
            } catch (error) {
                console.error("Error saving onboarding data:", error);
            }
        }
    };

    submitOnboardingData();
  }, [isComplete, user]);

  // Effect to handle progress animation
  React.useEffect(() => {
    if (isComplete) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            navigate('/creator/dashboard');
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isComplete, navigate]);

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
                            <Zap className="text-primary w-20 h-20 mb-[-16px] stroke-1" />
                            <div className="bg-primary/20 w-20 h-3 rounded-full blur-md"></div>
                        </div>
                        
                        {/* Floating Element */}
                        <div className="absolute left-[15%] top-[60%] animate-bounce duration-[3000ms]">
                            <div className="bg-primary text-white p-5 rounded-2xl shadow-xl shadow-primary/30 transform -rotate-12 border-4 border-white dark:border-background-dark">
                                <CheckCircle className="w-10 h-10" />
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
                Welcome to Papertrail, <span className="text-primary">{brand.name || profile.fullName || "Creator"}</span>!
            </h1>
            
            <p className="text-[#111418]/60 dark:text-white/60 text-base md:text-lg font-medium leading-relaxed max-w-xs mx-auto mb-10">
                Your creator dashboard is being prepared.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mx-auto space-y-2">
                <div className="flex justify-between text-xs font-semibold text-primary">
                    <span>Setting up workspace</span>
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
      <main className="flex-1 w-full flex items-start pt-8 px-4 sm:px-6 pb-6">
        <div className="w-full max-w-3xl mx-auto">
          
          <div className="text-center shrink-0 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900 dark:text-white">
              {getStepTitle()}
            </h1>
            {step === 1 && (
              <p className="text-xs text-slate-600 dark:text-slate-400">Let's get your creator profile started.</p>
            )}
            {step === 2 && (
               <p className="text-xs text-slate-600 dark:text-slate-400">Establish your presence on Papertrail.</p>
            )}
            {step === 3 && (
               <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                 Choose a plan that fits your growth ambitions.
               </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: PERSONAL PROFILE */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-lg mx-auto"
              >
                <form onSubmit={handleNext} className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleProfilePicChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {profile.avatarPreview ? (
                            <img src={profile.avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                                <User size={24} className="mb-1" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={20} />
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 font-medium">Upload Profile Picture</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="fullName">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-slate-400" size={16} />
                      </div>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        value={profile.fullName}
                        onChange={handleProfileChange}
                        placeholder="Your legal name" 
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

            {/* STEP 2: BRAND IDENTITY */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full max-w-lg mx-auto"
              >
                  <form onSubmit={handleNext} className="space-y-4">
                  
                    {/* PFP Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {brand.avatarPreview ? (
                                <img src={brand.avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                                    <Camera size={24} className="mb-1" />
                                    <span className="text-[10px] font-semibold">Upload Logo</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white" size={20} />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">Recommended: 400x400px</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="brandName">Brand/Newsletter Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                id="brandName" 
                                name="name" 
                                value={brand.name}
                                onChange={handleBrandChange}
                                placeholder="e.g. Daily Tech Insights" 
                                required
                                className="block w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">Bio/Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={brand.description}
                            onChange={handleBrandChange}
                            required
                            placeholder="Briefly describe what your followers can expect..."
                            rows={3}
                            className="block w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm resize-none"
                        ></textarea>
                         <p className="text-[10px] text-slate-400 mt-1 text-right">{brand.description.length}/160</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="niche">Primary Niche</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Compass className="text-slate-400" size={16} />
                        </div>
                        <select 
                          id="niche" 
                          name="niche" 
                          value={brand.niche}
                          onChange={handleBrandChange}
                          required
                          className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none"
                        >
                          <option value="" disabled>Select niche</option>
                          {NICHES.map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                         <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <ChevronRight className="rotate-90 text-slate-400" size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                         <button 
                            type="button" 
                            onClick={handleBack}
                            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-sm text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Back
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                  </form>
              </motion.div>
            )}

            {/* STEP 3: CREATOR PLANS */}
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
                            2 Months Free
                        </span>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
                         {/* Free Plan */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col transition-all hover:shadow-xl relative overflow-hidden">
                             <div className="mb-6">
                                <h2 className="text-xl font-bold mb-1">Starter</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Perfect for getting started.</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight">₦0</span>
                                    <span className="text-slate-500 ml-1 text-sm">/mo</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {[
                                    "Up to 1,000 subscribers",
                                    "Basic analytics",
                                    "Standard support",
                                    "Standard transaction fees (5%)"
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
                                {selectedPlan === 'free' ? 'Selected' : 'Select Starter'}
                            </button>
                        </div>

                        {/* Pro Plan (Middle Tier) */}
                         <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col transition-all hover:shadow-xl relative overflow-hidden">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-1">Growth</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">For creators ready to scale.</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {billingCycle === 'monthly' ? '₦15,000' : '₦150,000'}
                                    </span>
                                    <span className="text-slate-500 ml-1 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {[
                                    "Up to 10,000 subscribers",
                                    "Advanced audience insights",
                                    "Custom branding",
                                    "Lower transaction fees (2.5%)"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="text-primary shrink-0" size={18} />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => setSelectedPlan('growth')}
                                className={`w-full py-3 px-6 rounded-xl font-bold transition-colors text-sm ${
                                    selectedPlan === 'growth' 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700' 
                                    : 'border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {selectedPlan === 'growth' ? 'Selected' : 'Select Growth'}
                            </button>
                        </div>

                         {/* Premium Plan */}
                         <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-primary shadow-2xl shadow-primary/10 flex flex-col transition-all">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Best Value
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-1">Scale</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Maximum power & control.</p>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-3xl font-bold tracking-tight">
                                        {billingCycle === 'monthly' ? '₦45,000' : '₦450,000'}
                                    </span>
                                    <span className="text-slate-500 ml-1 text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-grow">
                                {[
                                    "Unlimited subscribers",
                                    "API Access",
                                    "Dedicated account manager",
                                    "Zero transaction fees (0%)",
                                    "Priority support"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="text-primary shrink-0" size={18} />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={() => setSelectedPlan('scale')}
                                className="w-full py-3 px-6 rounded-xl bg-primary text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 text-sm"
                            >
                                {selectedPlan === 'scale' ? 'Selected' : 'Select Scale'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center pb-8">
                         <div className="flex justify-center gap-4">
                            <button onClick={handleBack} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm px-6 py-2 transition-colors">
                                Back to Brand Setup
                            </button>
                             <button 
                                onClick={handleNext} 
                                className="bg-primary hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                Complete Setup
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
             )}

          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 text-center w-full">
        <div className="text-xs text-slate-400">
            © 2026 Papertrail. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default CreatorOnboardingPage;
