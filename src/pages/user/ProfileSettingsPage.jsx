import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera, User, Mail, Phone, MapPin, Globe, Loader2 } from 'lucide-react';

const ProfileSettingsPage = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // File state
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });

    // Fetch existing data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            try {
                // Determine collection based on role (standard user vs creator)
                const isCreator = user.role === 'creator'; 
                // Note: AuthContext attaches 'role' to user object. 
                // However, we want to update the profile document. 
                // If the user is a creator, they should probably edit this in "CreatorSettings", 
                // but if they are here, we should probably update their 'personal' info.
                // For simplicity, let's assume this page is primarily for 'users' collection updates
                // UNLESS they are a creator, then we update 'creators' collection (personal info part).
                
                const collectionName = isCreator ? 'creators' : 'users';
                const docRef = doc(db, collectionName, user.uid);
                const docSnap = await getDoc(docRef);

                let data = {};
                if (docSnap.exists()) {
                    data = docSnap.data();
                }

                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: user.email,
                    phone: data.phone || '',
                    location: data.location || data.country || '',
                    bio: data.bio || ''
                });

                if (data.photoURL || data.avatar) {
                    setAvatarPreview(data.photoURL || data.avatar);
                }

            } catch (error) {
                console.error("Error fetching user settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            let photoURL = avatarPreview;
            
            // Upload new avatar if selected
            if (avatarFile) {
                const storageRef = ref(storage, `users/${user.uid}/avatar_${Date.now()}`);
                await uploadBytes(storageRef, avatarFile);
                photoURL = await getDownloadURL(storageRef);
            }

            const isCreator = user.role === 'creator';
            const collectionName = isCreator ? 'creators' : 'users';
            
            // For creators, this might overlap with "Personal Identity" fields we set in Onboarding
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                location: formData.location,
                country: formData.location, // redundancy
                bio: formData.bio,
                photoURL: photoURL,
                updatedAt: serverTimestamp()
            };

            // If it's a new user doc (not creator), we ensure email is set
            if (!isCreator) {
                updateData.email = user.email;
            }

            await setDoc(doc(db, collectionName, user.uid), updateData, { merge: true });

            addToast('Profile updated successfully', 'success');
            setAvatarFile(null);
        } catch (error) {
            console.error("Error updating profile:", error);
            addToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
         <div className="flex bg-background-light dark:bg-background-dark h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
         </div>
    );

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 custom-scrollbar">
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
                                className="w-24 h-24 rounded-full bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-800 flex items-center justify-center bg-slate-200 dark:bg-slate-800"
                                style={{ backgroundImage: avatarPreview ? `url("${avatarPreview}")` : undefined }}
                            >
                                {!avatarPreview && <User size={32} className="text-slate-400" />}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors cursor-pointer" title="Change Avatar">
                                <Camera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Recommended dimensions: 400x400px. JPG or PNG.</p>
                            <div className="flex gap-3 pt-2">
                                <label className="text-sm font-semibold text-primary hover:text-primary/80 cursor-pointer">
                                    Upload New
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                                {avatarPreview && (
                                    <button 
                                        onClick={() => { setAvatarPreview(null); setAvatarFile(null); }}
                                        className="text-sm font-semibold text-red-500 hover:text-red-600"
                                    >
                                        Remove
                                    </button>
                                )}
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

                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* App Permissions & Theme */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
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
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
    </div>
        
                </div>
                <MobileBottomNav />
            </div>
        </div>
    </div>
    );
};
export default ProfileSettingsPage;
