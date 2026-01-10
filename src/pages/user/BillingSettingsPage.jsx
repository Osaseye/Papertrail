import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { useToast } from '../../context/ToastContext';
import { Check, Star, Zap, Shield, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const BillingSettingsPage = () => {
    const { addToast } = useToast();
    
    // FAQ Data
    const faqs = [
        {
            question: "Can I cancel my subscription at any time?",
            answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
        },
        {
            question: "Is there a discount for annual billing?",
            answer: "Absolutely! We offer a 20% discount if you choose to be billed annually instead of monthly."
        },
        {
            question: "What happens if I downgrade my plan?",
            answer: "If you downgrade, your new rate will apply at the start of your next billing cycle. You'll retain access to current features until then."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 14-day money-back guarantee for all new subscriptions if you're not satisfied with the service."
        }
    ];

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    }

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">Choose the perfect plan for your reading habits. Upgrade or downgrade at any time.</p>
                    
                    {/* Billing Toggle (Visual Only) */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <span className="text-sm font-bold text-slate-500">Monthly</span>
                        <div className="w-14 h-8 bg-primary rounded-full relative cursor-pointer px-1 flex items-center">
                             <div className="w-6 h-6 bg-white rounded-full shadow-md translate-x-6 transition-transform"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Annual <span className="text-primary text-xs ml-1 font-normal bg-primary/10 px-2 py-0.5 rounded-full">-20%</span></span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Basic Plan */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Starter</h3>
                            <p className="text-slate-500 text-sm mt-2">Perfect for casual readers.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <Check size={18} className="text-primary shrink-0" /> 5 Newsletter Subscriptions
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <Check size={18} className="text-primary shrink-0" /> Daily Digest (Email)
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Check size={18} className="text-slate-300 shrink-0" /> Smart Categorization
                            </li>
                             <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Check size={18} className="text-slate-300 shrink-0" /> Unlimited Archives
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                            Current Plan
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-slate-900 dark:bg-white rounded-2xl p-8 border border-transparent flex flex-col relative shadow-xl transform scale-105 z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                            Most Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white dark:text-slate-900">Pro Reader</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">For knowledge enthusiasts.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-black text-white dark:text-slate-900">$12</span>
                            <span className="text-slate-400 dark:text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-slate-200 dark:text-slate-700">
                                <div className="p-0.5 bg-green-500 rounded-full text-white"><Check size={12} strokeWidth={4} /></div> Unlimited Subscriptions
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-200 dark:text-slate-700">
                                <div className="p-0.5 bg-green-500 rounded-full text-white"><Check size={12} strokeWidth={4} /></div> Smart Categorization & AI Tags
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-200 dark:text-slate-700">
                                <div className="p-0.5 bg-green-500 rounded-full text-white"><Check size={12} strokeWidth={4} /></div> Audio Summaries
                            </li>
                             <li className="flex items-center gap-3 text-sm text-slate-200 dark:text-slate-700">
                                <div className="p-0.5 bg-green-500 rounded-full text-white"><Check size={12} strokeWidth={4} /></div> Ad-free Experience
                            </li>
                        </ul>
                        <button 
                            onClick={() => addToast("Successfully upgraded to Pro Plan! Welcome to the club.", "success")}
                            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                         <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Power User</h3>
                            <p className="text-slate-500 text-sm mt-2">For research teams & pros.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">$29</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <Check size={18} className="text-primary shrink-0" /> Everything in Pro
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <Check size={18} className="text-primary shrink-0" /> API Access
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <Check size={18} className="text-primary shrink-0" /> Team Collaboration
                            </li>
                             <li className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <Check size={18} className="text-primary shrink-0" /> Priority Support
                            </li>
                        </ul>
                         <button className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto pt-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all"
                            >
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className="font-bold text-slate-900 dark:text-white">{faq.question}</span>
                                    {openFaqIndex === index ? (
                                        <ChevronUp className="text-slate-500" size={20} />
                                    ) : (
                                        <ChevronDown className="text-slate-500" size={20} />
                                    )}
                                </button>
                                <div 
                                    className={`px-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${
                                        openFaqIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
                </div>
                <MobileBottomNav />
            </div>
        </div>
    );
};
export default BillingSettingsPage;
