import { useState, useEffect, useRef } from 'react';
import NotificationsPage from './NotificationsPage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { scheduleSubscriptionNotifications } from '../utils/notificationScheduler';
import { useSubscriptions } from '../context/SubscriptionContext';
import { ChevronLeft, DollarSign } from 'lucide-react';

const COLORS = [
    '#E50914', '#1DB954', '#00A8E1', '#7B61FF',
    '#FF3B30', '#FF9500', '#34C759', '#5AC8FA'
];

const PAY_METHODS = ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'Other'];

const AddEditView = ({ subId, onClose }) => {
    const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
    const { language, currency } = useThemeLanguage();

    const isEditing = !!subId;
    const existingSub = isEditing ? subscriptions.find(s => s.id === subId) : null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        method: 'Credit Card',
        category: '',
        cycleType: 'monthly',
        cycleCount: '1',
        firstBill: new Date().toISOString().split('T')[0],
        color: COLORS[0],
        notifications: [] // array of notification objects
    });
    const [notifPageOpen, setNotifPageOpen] = useState(false);

    useEffect(() => {
        if (existingSub) {
            setFormData({
                ...existingSub,
                notifications: Array.isArray(existingSub.notifications) ? existingSub.notifications : []
            });
        }
    }, [existingSub]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Remove category if empty or only whitespace
        const cleanedFormData = { ...formData };
        if (!cleanedFormData.category || cleanedFormData.category.trim() === '') {
            delete cleanedFormData.category;
        }
        if (isEditing) {
            updateSubscription({ ...cleanedFormData, id: subId });
            await scheduleSubscriptionNotifications({ ...cleanedFormData, id: subId }, cleanedFormData.title);
        } else {
            addSubscription(cleanedFormData);
            await scheduleSubscriptionNotifications(cleanedFormData, cleanedFormData.title);
        }
        onClose();
    };

    const handleDelete = () => {
        if (isEditing) {
            deleteSubscription(subId);
            onClose();
        }
    };

    const descriptionRef = useRef(null);
    const amountRef = useRef(null);
    return (
        <>
            <section className="view slide-up" style={{ backgroundColor: 'var(--bg-color)', zIndex: 100 }}>
                <header className="app-header">
                    <button className="icon-btn" onClick={onClose}>
                        <ChevronLeft size={24} /> Back
                    </button>
                    <h1>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</h1>
                    <div style={{ width: 60 }} /> {/* Spacer */}
                </header>

                <main className="scroll-content">
                    {isEditing && (
                        <button
                            className="btn-secondary"
                            style={{ margin: '16px 0', padding: '8px 18px', borderRadius: 10 }}
                            onClick={e => {
                                e.preventDefault();
                                setNotifPageOpen(true);
                            }}
                        >
                            Manage Notifications
                        </button>
                    )}
                    <form className="sub-form" onSubmit={handleSubmit}>
                        <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
                            <label>{language === 'it' ? 'Nome' : 'Name'}</label>
                            <input
                                type="text"
                                placeholder={language === 'it' ? 'es. Netflix, Spotify' : 'e.g. Netflix, Spotify'}
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
                                tabIndex={1}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        descriptionRef.current?.focus();
                                    }
                                }}
                            />
                            <label style={{ marginTop: 16 }}>{language === 'it' ? 'Descrizione' : 'Description'}</label>
                            <input
                                type="text"
                                placeholder={language === 'it' ? 'es. Account famiglia, promo, ecc.' : 'e.g. Family account, promo, etc.'}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
                                tabIndex={2}
                                ref={descriptionRef}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        amountRef.current?.focus();
                                    }
                                }}
                            />
                            <label style={{ marginTop: 16 }}>{language === 'it' ? 'Tag personalizzati' : 'Custom Tags'}</label>
                            <input
                                type="text"
                                placeholder={language === 'it' ? 'es. streaming, lavoro, cloud' : 'e.g. streaming, work, cloud'}
                                value={formData.category || ''}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
                            />
                        </div>

                        <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
                            <label style={{ marginBottom: 8, display: 'block' }}>{language === 'it' ? 'Dati di fatturazione' : 'Billing Details'}</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label>{language === 'it' ? 'Importo' : 'Amount'}</label>
                                    <div className="input-with-icon" style={{ marginTop: '8px' }}>
                                        <span className="icon-left" style={{ fontWeight: 700, fontSize: 18 }}>
                                            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : currency === 'CHF' ? 'CHF' : ''}
                                        </span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                            style={{ background: 'rgba(0,0,0,0.2)' }}
                                            tabIndex={3}
                                            ref={amountRef}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ marginBottom: 8, display: 'block' }}>{language === 'it' ? 'Periodo di fatturazione' : 'Billing Period'}</label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <span style={{ alignSelf: 'center', minWidth: 32 }}>{language === 'it' ? 'Ogni' : 'Every'}</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.cycleType === 'yearly' ? 1 : formData.cycleCount}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (formData.cycleType === 'yearly') {
                                                    setFormData({ ...formData, cycleType: 'yearly', cycleCount: '1' });
                                                } else {
                                                    setFormData({ ...formData, cycleCount: val });
                                                }
                                            }}
                                            style={{ width: 60, background: 'rgba(0,0,0,0.2)' }}
                                            disabled={formData.cycleType === 'yearly'}
                                        />
                                        <select
                                            value={formData.cycleType}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (val === 'yearly') {
                                                    setFormData({ ...formData, cycleType: val, cycleCount: '1' });
                                                } else if (val === 'monthly') {
                                                    setFormData({ ...formData, cycleType: val, cycleCount: '1' });
                                                } else {
                                                    setFormData({ ...formData, cycleType: val });
                                                }
                                            }}
                                            style={{ minWidth: 100, background: 'rgba(0,0,0,0.2)' }}
                                        >
                                            <option value="monthly">{language === 'it' ? 'Mese' : 'Month'}</option>
                                            <option value="yearly">{language === 'it' ? 'Anno' : 'Year'}</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label>{language === 'it' ? 'Primo pagamento' : 'First payment'}</label>
                                    <input
                                        type="date"
                                        value={formData.firstBill}
                                        onChange={e => setFormData({ ...formData, firstBill: e.target.value })}
                                        style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
                                        placeholder={language === 'it' ? 'es. Oggi' : 'e.g. Today'}
                                    />
                                </div>
                                <div>
                                    <label>{language === 'it' ? 'Metodo di pagamento' : 'Billing Method'}</label>
                                    <select
                                        value={formData.method}
                                        onChange={e => setFormData({ ...formData, method: e.target.value })}
                                        required
                                        style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
                                    >
                                        {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Next Billing Date removed: now determined from first payment and billing period */}

                        <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
                            <label>Color Accent</label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {COLORS.map(c => (
                                    <div
                                        key={c}
                                        onClick={() => setFormData({ ...formData, color: c })}
                                        style={{
                                            width: '36px', height: '36px', borderRadius: '18px', cursor: 'pointer',
                                            backgroundColor: c,
                                            border: formData.color === c ? '3px solid white' : '3px solid transparent',
                                            transform: formData.color === c ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '20px 0 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button type="submit" className="btn-primary">
                                {isEditing ? 'Save Changes' : 'Create Subscription'}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn-danger" onClick={handleDelete}>
                                    Delete Subscription
                                </button>
                            )}
                        </div>
                    </form>
                </main>
            </section>
            {notifPageOpen && (
                <NotificationsPage
                    notifications={formData.notifications || []}
                    onAdd={(notif, editIndex) => {
                        let updatedNotifications;
                        if (typeof editIndex === 'number') {
                            updatedNotifications = [...(formData.notifications || [])];
                            updatedNotifications[editIndex] = notif;
                        } else {
                            updatedNotifications = [...(formData.notifications || []), notif];
                        }
                        setFormData({ ...formData, notifications: updatedNotifications });
                        if (isEditing) {
                            updateSubscription({ ...formData, notifications: updatedNotifications, id: subId });
                        }
                    }}
                    onRemove={idx => {
                        const updatedNotifications = formData.notifications.filter((_, i) => i !== idx);
                        setFormData({ ...formData, notifications: updatedNotifications });
                        if (isEditing) {
                            updateSubscription({ ...formData, notifications: updatedNotifications, id: subId });
                        }
                    }}
                    onBack={() => setNotifPageOpen(false)}
                />
            )}
        </>
    );
};

export default AddEditView;
