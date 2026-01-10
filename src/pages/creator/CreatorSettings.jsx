import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CreatorSidebar from '../../components/layout/CreatorSidebar';
import CreatorMobileBottomNav from '../../components/layout/CreatorMobileBottomNav';
import CreatorProfile from './settings/CreatorProfile';
import CreatorSubscription from './settings/CreatorSubscription';
import CreatorSecurity from './settings/CreatorSecurity';

const CreatorSettings = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [searchParams] = useSearchParams();
    
    // Default to 'profile' if no tab is specified
    const activeTab = searchParams.get('tab') || 'profile';

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    // Map tab ID to component and title
    const renderContent = () => {
        switch (activeTab) {
            case 'subscription':
                return { title: 'Subscription Settings', component: <CreatorSubscription /> };
            case 'security':
                return { title: 'Security Settings', component: <CreatorSecurity /> };
            case 'profile':
            default:
                return { title: 'Profile & Branding', component: <CreatorProfile /> };
        }
    };

    const { title, component } = renderContent();

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200">
            <CreatorSidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8 py-8 custom-scrollbar pb-32 md:pb-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Only the content panel remains */}
                         <div className="flex-1 min-w-0">
                            {component}
                        </div>
                    </div>
                </main>
                <CreatorMobileBottomNav />
            </div>
        </div>
    );
};

export default CreatorSettings;
