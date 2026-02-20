import { useState } from 'react';
import NotificationEditView from './NotificationEditView';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { PackageOpen, Search } from 'lucide-react';

const SubscriptionsView = ({ onEdit }) => {
    const { subscriptions } = useSubscriptions();
    const { currency, language } = useThemeLanguage();
    const [search, setSearch] = useState('');
    const [notifSubId, setNotifSubId] = useState(null); // which sub to add notification for
    const [notifModalOpen, setNotifModalOpen] = useState(false);
    const filteredSubs = subscriptions.filter(sub => {
        const searchLower = search.toLowerCase();
        const titleMatch = sub.title.toLowerCase().includes(searchLower);
        const tags = (sub.category || '').split(',').map(t => t.trim().toLowerCase());
        const tagMatch = tags.some(tag => tag.includes(searchLower));
        return titleMatch || tagMatch;
    });

    return (
        <section className="view">
            <header className="app-header">
                <h1>Your Subscriptions</h1>
            </header>
            <main className="scroll-content">
                <div className="form-group" style={{ marginBottom: 20 }}>
                    <div className="input-with-icon">
                        <span className="icon-left"><Search size={18} /></span>
                        <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: 36 }}
                        />
                    </div>
                </div>
                <div className="subs-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredSubs.length === 0 ? (
                        <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <PackageOpen size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                            <p style={{ marginBottom: '24px' }}>No subscriptions added yet.</p>
                            <button
                                className="btn-primary"
                                onClick={() => onEdit()}
                                style={{ width: 'auto', padding: '12px 24px' }}
                            >
                                Add your first
                            </button>
                        </div>
                    ) : (
                        filteredSubs.map(sub => (
                            <div
                                key={sub.id}
                                className="sub-item"
                                style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', cursor: 'pointer', position: 'relative' }}
                                onClick={e => {
                                    // Only open edit if not clicking notification button
                                    if (e.target.closest('.notif-btn')) return;
                                    onEdit(sub.id);
                                }}
                            >
                                <div
                                    className="sub-icon"
                                    style={{ width: '48px', height: '48px', borderRadius: '14px', background: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', marginRight: '16px', fontWeight: 600 }}
                                >
                                    {sub.title.substring(0, 1).toUpperCase()}
                                </div>

                                <div className="sub-details" style={{ flex: 1 }}>
                                    <div className="sub-name" style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{sub.title}</div>
                                    {sub.category && sub.category.trim() !== '' && (
                                        <div className="sub-category" style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 500, marginBottom: '2px' }}>
                                            {sub.category}
                                        </div>
                                    )}
                                    <div className="sub-cycle" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {sub.method} • {sub.cycleType === 'monthly' ? 'Monthly' : sub.cycleType === 'yearly' ? 'Yearly' : `Every ${sub.cycleCount} mos`}
                                    </div>
                                </div>

                                <div className="sub-price-col" style={{ textAlign: 'right' }}>
                                    <div className="sub-price" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                                        {parseFloat(sub.amount).toLocaleString(language === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: currency || 'EUR' })}
                                    </div>
                                    {/* Notification button removed as requested */}
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </main>
            {/* Notification modal removed as requested */}
        </section>
    );
};

export default SubscriptionsView;
