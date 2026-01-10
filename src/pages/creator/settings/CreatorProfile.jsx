import React, { useState } from 'react';
import { Camera, User, Globe, Mail, FileText, Tag, Moon, Sun } from 'lucide-react';

const CreatorProfile = () => {
    const [formData, setFormData] = useState({
        newsletterName: 'Weekly Creator Insights',
        description: 'Deep dives into the creator economy, monetization, and growth strategies.',
        category: 'Tech & Business',
        creatorName: 'Alex Morgan',
        email: 'alex@example.com',
        website: 'https://alexmorgan.io',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile & Branding</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your newsletter's public appearance and details.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-8">
                
                {/* Branding Section */}
                <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative group">
                        <div 
                            className="w-24 h-24 rounded-lg bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-800 shadow-inner"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80")' }}
                        ></div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors" title="Change Logo">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Newsletter Logo</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Recommended: Square, at least 400x400px.</p>
                        <div className="flex gap-3 pt-2">
                            <button className="text-sm font-semibold text-primary hover:text-primary/80">Upload New</button>
                            <button className="text-sm font-semibold text-red-500 hover:text-red-600">Remove</button>
                        </div>
                    </div>
                </section>
                
                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Newsletter Details */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" /> Newsletter Name
                        </label>
                        <input 
                            type="text" 
                            name="newsletterName"
                            value={formData.newsletterName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Tag size={16} className="text-slate-400" /> Category
                        </label>
                        <select 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                        >
                            <option>Tech & Business</option>
                            <option>Health & Wellness</option>
                            <option>Art & Design</option>
                            <option>News & Politics</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" /> Description
                        </label>
                        <textarea 
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                    </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Personal Info */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <User size={16} className="text-slate-400" /> Creator Name
                        </label>
                        <input 
                            type="text" 
                            name="creatorName"
                            value={formData.creatorName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" /> Contact Email
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>

                     <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Globe size={16} className="text-slate-400" /> Website
                        </label>
                        <input 
                            type="url" 
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* Theme Toggle */}
                <section className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Toggle the application theme between light and dark mode.</p>
                    </div>
                    <button 
                        onClick={() => document.documentElement.classList.toggle('dark')}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-slate-900"
                    >
                        <span className="translate-x-1 dark:translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                </section>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Discard
                    </button>
                    <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorProfile;
