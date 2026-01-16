import React, { useState, useEffect } from 'react';
import { Camera, User, Globe, Mail, FileText, Tag, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { db, storage } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../../../context/ToastContext';

const NICHES = [
    "Technology", "Finance", "Health", "Fitness", "Design", 
    "Art", "Politics", "Science", "History", "Culture", "Sports", 
    "Lifestyle", "Travel", "Business", "Education", "Food", 
    "Gaming", "Music", "Photography", "Writing"
].sort();

const CreatorProfile = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // File state
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '', // Newsletter Name (Brand Name)
        bio: '', // Description
        niche: 'Technology',
        fullName: '', // Personal Name
        email: '',
        website: '',
        avatar: '', // URL
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                // Fetch Brand Data
                const brandRef = doc(db, 'creator-brands', user.uid);
                const brandSnap = await getDoc(brandRef);
                
                // Fetch Personal Data (Optional, if we want to edit personal info here too)
                // For now, let's mix them or just focus on Brand
                
                if (brandSnap.exists()) {
                    const data = brandSnap.data();
                    setFormData({
                        name: data.brandName || '',
                        bio: data.description || '', // mapped from description
                        niche: data.niche || 'Technology',
                        fullName: '', // Personal info might be elsewhere
                        email: data.email || user.email,
                        website: data.website || '',
                        avatar: data.avatar || ''
                    });
                    if (data.avatar) setAvatarPreview(data.avatar);
                }
            } catch (error) {
                console.error("Error fetching profile settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
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
        setSaving(true);
        try {
            let photoURL = formData.avatar;
            
            // Upload new avatar if selected
            if (avatarFile) {
                const storageRef = ref(storage, `creator-brands/${user.uid}/avatar_${Date.now()}`);
                await uploadBytes(storageRef, avatarFile);
                photoURL = await getDownloadURL(storageRef);
            }

            const docRef = doc(db, 'creator-brands', user.uid);
            await updateDoc(docRef, {
                brandName: formData.name, // Write as brandName
                description: formData.bio, // Write as description
                niche: formData.niche,
                // fullName: formData.fullName, // Keep personal info in 'creators' collection if needed
                email: formData.email,
                website: formData.website,
                avatar: photoURL,
                updatedAt: serverTimestamp()
            });

            // Update local state to reflect new URL if uploaded
            setFormData(prev => ({ ...prev, avatar: photoURL }));
            setAvatarFile(null);
            
            addToast('Profile updated successfully', 'success');
        } catch (error) {
            console.error("Error updating profile:", error);
            addToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

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
                            className="w-24 h-24 rounded-lg bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-800 shadow-inner bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
                            style={{ backgroundImage: avatarPreview ? `url("${avatarPreview}")` : undefined }}
                        >
                            {!avatarPreview && <User size={32} className="text-slate-400" />}
                        </div>
                        <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors cursor-pointer" title="Change Logo">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Newsletter Logo</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Recommended: Square, at least 400x400px.</p>
                        <div className="flex gap-3 pt-2">
                            <label className="text-sm font-semibold text-primary hover:text-primary/80 cursor-pointer">
                                Upload New
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                            {avatarPreview && (
                                <button className="text-sm font-semibold text-red-500 hover:text-red-600" onClick={() => { setAvatarFile(null); setAvatarPreview(null); setFormData(prev => ({ ...prev, avatar: '' })); }}>
                                    Remove
                                </button>
                            )}
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
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Tag size={16} className="text-slate-400" /> Category
                        </label>
                        <select 
                            name="niche"
                            value={formData.niche}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                        >
                            {NICHES.map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText size={16} className="text-slate-400" /> Description
                        </label>
                        <textarea 
                            name="bio"
                            rows="3"
                            value={formData.bio}
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
                            name="fullName"
                            value={formData.fullName}
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

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Discard
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-all flex items-center gap-2"
                    >
                        {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorProfile;
