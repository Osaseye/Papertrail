import React from 'react';
import { CreditCard, CheckCircle2, Zap, ArrowRight, Star } from 'lucide-react';

const CreatorSubscription = () => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription & Billing</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your creator plan and payment details.</p>
            </div>

            {/* Current Plan Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Current Plan</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">Free Tier</span>
                         </div>
                         <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Starter</h3>
                         <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                            Perfect for getting started. You can have up to 500 subscribers and send 2,000 emails per month.
                         </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <Zap size={18} fill="currentColor" /> Upgrade to Pro
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Manage Billing
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                        <div className="flex justify-between mb-2 text-sm font-medium">
                            <span className="text-slate-700 dark:text-slate-300">Subscribers</span>
                            <span className="text-slate-900 dark:text-white">350 / 500</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[70%]" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2 text-sm font-medium">
                            <span className="text-slate-700 dark:text-slate-300">Emails Sent</span>
                            <span className="text-slate-900 dark:text-white">1,200 / 2,000</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full w-[60%]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Comparison */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pro Plan */}
                <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 border hover:border-primary/50 transition-colors border-slate-200 dark:border-slate-700">
                     <div className="absolute top-0 right-0 p-4">
                        <Star className="text-amber-400" fill="currentColor" size={24} />
                     </div>
                     <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pro Creator</h4>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">$19</span>
                        <span className="text-slate-500">/month</span>
                     </div>
                     <ul className="space-y-3 mb-8">
                        {['Unlimited Subscribers', 'Unlimited Emails', 'Custom Domain', 'Advanced Analytics', 'Priority Support'].map(feat => (
                            <li key={feat} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <CheckCircle2 size={16} className="text-primary" /> {feat}
                            </li>
                        ))}
                     </ul>
                     <button className="w-full py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                        Select Pro
                     </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorSubscription;
