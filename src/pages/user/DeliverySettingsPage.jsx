import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  Clock, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ChevronDown, 
  Download,
  FileText,
  Loader2
} from 'lucide-react';

const DeliverySettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [preferredHour, setPreferredHour] = useState('10:00');
  const [frequency, setFrequency] = useState('daily');
  const [isConsolidated, setIsConsolidated] = useState(true);

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
        if (!user) return;
        try {
            const docRef = doc(db, 'users', user.uid);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                const data = snap.data();
                if (data.deliverySettings) {
                    const settings = data.deliverySettings;
                    if (settings.preferredHour) setPreferredHour(settings.preferredHour);
                    if (settings.frequency) setFrequency(settings.frequency);
                    if (settings.isConsolidated !== undefined) setIsConsolidated(settings.isConsolidated);
                }
            }
        } catch (error) {
            console.error("Error fetching delivery settings", error);
            addToast("Failed to load settings", "error");
        } finally {
            setLoading(false);
        }
    };
    
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
      if (!user) return;
      setSaving(true);
      try {
          const docRef = doc(db, 'users', user.uid);
          await updateDoc(docRef, {
              deliverySettings: {
                  preferredHour,
                  frequency,
                  isConsolidated
              }
          });
          addToast("Delivery preferences updated", "success");
      } catch (error) {
          console.error("Error saving delivery settings", error);
          addToast("Failed to save changes", "error");
      } finally {
          setSaving(false);
      }
  };


  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Delivery Preferences</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Configure how and when you receive your Papertrail reports.</p>
                    </div>

                    <div className="p-8 space-y-10">
                        
                        {/* Global Delivery Time */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Global Delivery Time</h3>
                            <div className="max-w-xs">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Hour (UTC)</label>
                                <div className="relative">
                                    <select 
                                        value={preferredHour}
                                        onChange={(e) => setPreferredHour(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer custom-scrollbar"
                                    >
                                        {Array.from({ length: 24 }).map((_, i) => {
                                            const hour = i.toString().padStart(2, '0');
                                            const time = `${hour}:00`;
                                            const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            return (
                                                <option key={time} value={time}>
                                                    {displayTime} (UTC)
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        {/* Report Frequency */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Report Frequency</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['daily', 'weekly', 'monthly'].map((opt) => (
                                    <label 
                                        key={opt}
                                        className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                                            frequency === opt 
                                                ? 'border-primary ring-1 ring-primary bg-blue-50/10 dark:bg-blue-900/10' 
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    >
                                        <input 
                                            type="radio" 
                                            name="frequency" 
                                            value={opt} 
                                            checked={frequency === opt}
                                            onChange={() => setFrequency(opt)}
                                            className="sr-only"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-bold capitalize ${frequency === opt ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                {opt}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {opt === 'daily' ? 'Every morning' : opt === 'weekly' ? 'Every Monday' : '1st of the month'}
                                            </span>
                                        </div>
                                        {frequency === opt && (
                                            <div className="absolute top-4 right-4 text-primary">
                                                <CheckCircle size={18} fill="currentColor" className="text-white dark:text-slate-900" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </section>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        {/* Consolidated Trail */}
                        <section className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consolidated Trail</h3>
                                <p className="text-sm text-slate-500 max-w-md">Combine all your platform reports into a single daily delivery.</p>
                            </div>
                            <div 
                                onClick={() => setIsConsolidated(!isConsolidated)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ease-in-out ${isConsolidated ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div 
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${isConsolidated ? 'translate-x-7' : 'translate-x-1'}`}
                                ></div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                        <button 
                            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            disabled={saving}
                        >
                            Discard
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            {saving ? 'Saving...' : 'Save Changes'}
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

export default DeliverySettingsPage;
