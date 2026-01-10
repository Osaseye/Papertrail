import React, { useState } from 'react';
import { Shield, Key, Smartphone, AlertTriangle, Check } from 'lucide-react';

const CreatorSecurity = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security & Access</h2>
                <p className="text-slate-500 dark:text-slate-400">Protect your creator account and content.</p>
            </div>

            {/* Change Password */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                        <Key size={20} /> 
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Password</h2>
                        <p className="text-sm text-slate-500">Update your password associated with this account.</p>
                    </div>
                </div>
                
                <div className="p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">Current Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Enter current password"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-900 dark:text-white">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                         <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                            <Smartphone size={20} /> 
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h2>
                            <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    <div 
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${twoFactorEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                </div>
                
                {twoFactorEnabled && (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="w-24 h-24 bg-slate-900 pattern-dots"></div>
                            </div>
                            <div className="space-y-3 flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white">Scan QR Code</h4>
                                <p className="text-sm text-slate-500">Scan this code with your authenticator app.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
                <div className="p-6 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3">
                     <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-600">
                        <AlertTriangle size={20} /> 
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-red-900 dark:text-red-100">Danger Zone</h2>
                        <p className="text-sm text-red-700 dark:text-red-300">Irreversible actions.</p>
                    </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Delete Account</h4>
                         <p className="text-sm text-slate-500">Permanently remove your account and all content.</p>
                    </div>
                    <button className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorSecurity;
