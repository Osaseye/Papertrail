import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Shield, Key, Smartphone, AlertTriangle, Check, LogOut, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { auth, db } from '../../lib/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import Modal from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

const SecuritySettingsPage = () => {
    
    // Toggle States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    
    // Auth & Feedback
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatingPassword, setUpdatingPassword] = useState(false);

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Handlers
    const handleUpdatePassword = async () => {
        if (!newPassword || !currentPassword) {
            addToast("Please fill in all password fields", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            addToast("New passwords do not match", "error");
            return;
        }

        if (newPassword.length < 6) {
             addToast("Password must be at least 6 characters", "error");
             return;
        }

        setUpdatingPassword(true);
        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            
            // Update
            await updatePassword(auth.currentUser, newPassword);
            
            addToast("Password updated successfully", "success");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Password update error", error);
            if (error.code === 'auth/wrong-password') {
                addToast("Incorrect current password", "error");
            } else if (error.code === 'auth/requires-recent-login') {
                addToast("Session expired. Please re-login.", "error");
            } else {
                addToast("Failed to update password: " + error.message, "error");
            }
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deleteConfirmPassword) {
            addToast("Please enter your password to confirm", "error");
            return;
        }

        setIsDeleting(true);
        try {
             // Re-authenticate first to ensure ownership
            const credential = EmailAuthProvider.credential(user.email, deleteConfirmPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);

            // 1. Delete Firestore Data
            // Note: Cloud Functions usually handle recursive cleanup, but we do basic cleanup here
            const collectionName = user.role === 'creator' ? 'creators' : 'users';
            await deleteDoc(doc(db, collectionName, user.uid));

            // 2. Delete Auth Account
            await deleteUser(auth.currentUser);

            // 3. Cleanup local state
            navigate('/login');
            addToast("Account deleted successfully", "success");

        } catch (error) {
            console.error("Delete account error", error);
             if (error.code === 'auth/wrong-password') {
                addToast("Incorrect password", "error");
            } else {
                addToast("Failed to delete account. Please try again.", "error");
            }
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Account"
                size="sm"
            >
                <div className="p-6 space-y-4">
                     <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50 flex gap-3 text-red-800 dark:text-red-200 text-sm">
                        <AlertTriangle className="shrink-0" size={20} />
                        <p>This action is irreversible. All your data, subscriptions, and settings will be permanently lost.</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                            placeholder="Enter your password"
                            value={deleteConfirmPassword}
                            onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                        />
                     </div>
                     <div className="flex justify-end gap-3 pt-2">
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 flex items-center gap-2"
                        >
                            {isDeleting && <Loader2 size={16} className="animate-spin" />}
                            Delete Permanently
                        </button>
                     </div>
                </div>
            </Modal>

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Protect your account and manage access credentials.</p>
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
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            {/* <a href="#" className="text-xs text-primary font-semibold hover:underline inline-block mt-1">Forgot password?</a> */}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-white">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-white">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Password Requirements:</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                                <li className="flex items-center gap-2"><Check size={12} className="text-green-500" /> Minimum 6 characters long</li>
                                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-slate-300"></div> At least one uppercase character</li>
                                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-slate-300"></div> At least one number</li>
                                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-slate-300"></div> At least one special character</li>
                            </ul>
                        </div>

                        <div className="flex justify-end pt-2">
                             <button 
                                onClick={handleUpdatePassword}
                                disabled={updatingPassword}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all flex items-center gap-2"
                             >
                                {updatingPassword && <Loader2 size={16} className="animate-spin" />}
                                {updatingPassword ? 'Updating...' : 'Update Password'}
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
                                    {/* Placeholder QR Code */}
                                    <div className="w-24 h-24 bg-slate-900 pattern-dots"></div>
                                </div>
                                <div className="space-y-3 flex-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white">Scan QR Code</h4>
                                    <p className="text-sm text-slate-500">Open your authenticator app (e.g., Google Authenticator, Authy) and scan this QR code.</p>
                                    <div className="flex items-center gap-2">
                                        <input type="text" placeholder="Enter 6-digit code" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm w-48 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                                        <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold">Verify</button>
                                    </div>
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
                            <p className="text-sm text-red-700 dark:text-red-300">Irreversible actions for your account.</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div>
                             <h4 className="font-bold text-slate-900 dark:text-white">Delete Account</h4>
                             <p className="text-sm text-slate-500">Permanently remove your account and all associated data.</p>
                        </div>
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors shadow-sm"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
                </div>
                <MobileBottomNav />
            </div>
        </div>
    );
};
export default SecuritySettingsPage;
