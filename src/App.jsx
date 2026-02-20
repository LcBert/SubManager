import { useState, useEffect } from 'react'
import { LocalNotifications } from '@capacitor/local-notifications';
import { SubscriptionProvider } from './context/SubscriptionContext'
import { ThemeLanguageProvider, useThemeLanguage } from './context/ThemeLanguageContext'
import { PieChart, List as ListIcon, Plus } from 'lucide-react'

// Placeholder components - will implement fully next
import DashboardView from './components/DashboardView'
import SettingsView from './components/SettingsView'
import SubscriptionsView from './components/SubscriptionsView'
import AddEditView from './components/AddEditView'

import './index.css'

function App() {
    const { language, t } = useThemeLanguage?.() || { language: 'en', t: (k) => k };
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'list' | 'settings'
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSubId, setEditingSubId] = useState(null);

    useEffect(() => {
        // Request notification permissions on app open
        LocalNotifications.requestPermissions();
    }, []);

    const openForm = (subId = null) => {
        setEditingSubId(subId);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setTimeout(() => setEditingSubId(null), 300); // clear after animation
    };

    return (
        <ThemeLanguageProvider>
            <SubscriptionProvider>
                <div className="app-container">
                    {/* Main Views */}
                    {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
                    {activeTab === 'list' && <SubscriptionsView onEdit={openForm} />}
                    {activeTab === 'settings' && <SettingsView setActiveTab={setActiveTab} />}
                    {/* Slide-up Form View */}
                    {isFormOpen && (
                        <AddEditView
                            subId={editingSubId}
                            onClose={closeForm}
                        />
                    )}
                    {/* Bottom Navigation */}
                    <nav className="bottom-nav">
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <PieChart size={24} />
                            <span>{t('dashboard')}</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'list' ? 'active' : ''}`}
                            onClick={() => setActiveTab('list')}
                        >
                            <ListIcon size={24} />
                            <span>{t('dashboard')}</span>
                        </button>
                        {!isFormOpen && (
                            <button
                                className="nav-item add-action"
                                onClick={() => openForm()}
                            >
                                <div className="fab">
                                    <Plus size={24} />
                                </div>
                            </button>
                        )}
                    </nav>
                </div>
            </SubscriptionProvider>
        </ThemeLanguageProvider>
    )
}

export default App
