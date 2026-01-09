import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { Camera, User, Mail, Phone, MapPin, Globe } from 'lucide-react';

const ProfileSettingsPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.com',
        phone: '+1 (555) 000-0000',
        location: 'San Francisco, CA',
        bio: 'Product Designer @ Papertrail. Loves minimalist UI and clean code.'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your public profile and personal details.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-8">
                    
                    {/* Avatar Section */}
                    <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative group">
                            <div 
                                className="w-24 h-24 rounded-full bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-800"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2XbClk2r-PpSha3lWrcvYJrgc3eCUSSmfJ4TPH4W0cxXQkpIHie9VtDfQp1Pev39roiFj-slFUno18fTg-TTrNhRzVA_XaJHjDHvWTiyf-zrHqk28emmh-CzDFHOc-botfIeosl1ZUSpEbGVI61BWzaCVJ8qm8ORQ9U62ksMMQa_PMrPhBKezftZeoCWaz2P93KrF4B69b34nGEJlnPH2K0ZmBag77P54nmbfjjeuF5iypOMpw1_6eMx7CQwPVKUOGsKBwR_BGHlZ")' }}
                            ></div>
                            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors" title="Change Avatar">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Recommended dimensions: 400x400px. JPG or PNG.</p>
                            <div className="flex gap-3 pt-2">
                                <button className="text-sm font-semibold text-primary hover:text-primary/80">Upload New</button>
                                <button className="text-sm font-semibold text-red-500 hover:text-red-600">Remove</button>
                            </div>
                        </div>
                    </section>
                    
                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* Personal Information */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <User size={16} className="text-slate-400" /> First Name
                            </label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <User size={16} className="text-slate-400" /> Last Name
                            </label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Mail size={16} className="text-slate-400" /> Email Address
                            </label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Phone size={16} className="text-slate-400" /> Phone Number
                            </label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" /> Location
                            </label>
                            <input 
                                type="text" 
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Globe size={16} className="text-slate-400" /> Bio
                            </label>
                            <textarea 
                                name="bio"
                                rows="4"
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                            <p className="text-xs text-slate-500 text-right">0/300 characters</p>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Cancel
                        </button>
                        <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all">
                            Save Changes
                        </button>
                    </div>
    </div>
        
                </div>
            </div>
        </div>
    </div>
    );
};
export default ProfileSettingsPage;
