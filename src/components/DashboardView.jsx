import { useSubscriptions } from '../context/SubscriptionContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { format, isAfter, isBefore, addMonths, addYears, parseISO, startOfDay } from 'date-fns';
import { Settings } from 'lucide-react';

const DashboardView = ({ setActiveTab }) => {
    const { subscriptions, getTotalMonthlySpend } = useSubscriptions();
    const { language, currency, t } = useThemeLanguage();

    // Simple formatting
    const formattedTotal = getTotalMonthlySpend().toLocaleString(language === 'it' ? 'it-IT' : 'en-US', {
        style: 'currency',
        currency: currency || 'EUR'
    });

    // Calculate upcoming (next 7 days)
    const getUpcomingBills = () => {
        const today = startOfDay(new Date());
        const nextWeek = addMonths(today, 1); // Let's just show next upcoming ones within a month for demo

        // Very simplified next bill calculation
        const upcoming = subscriptions.map(sub => {
            let nextDate = parseISO(sub.firstBill);

            // Fast forward past dates to current cycle
            while (isBefore(nextDate, today)) {
                if (sub.cycleType === 'monthly') nextDate = addMonths(nextDate, 1);
                else if (sub.cycleType === 'yearly') nextDate = addYears(nextDate, 1);
                else if (sub.cycleType === 'custom-months') nextDate = addMonths(nextDate, parseInt(sub.cycleCount || 1, 10));
                else break;
            }

            return { ...sub, nextDate };
        })
            .filter(sub => isBefore(sub.nextDate, nextWeek) || sub.nextDate.getTime() === today.getTime())
            .sort((a, b) => a.nextDate - b.nextDate)
            .slice(0, 5); // top 5

        return upcoming;
    };

    const upcomingBills = getUpcomingBills();

    return (
        <section className="view">
            <header className="app-header">
                <h1>{t('dashboard')}</h1>
                <button className="icon-btn" aria-label={t('settings')} onClick={() => setActiveTab('settings')}>
                    <Settings size={20} />
                </button>
            </header>

            <main className="scroll-content">
                <div className="summary-card glassmorphism" style={{ padding: '30px 24px', marginBottom: '32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 41, 59, 0.6) 100%)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>
                        {t('totalMonthlySpend')}
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '8px' }}>
                        {formattedTotal}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {t('acrossActive', { count: subscriptions.length })}
                    </div>
                </div>

                <h2 className="section-title">{t('upcomingBills')}</h2>

                <div className="upcoming-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {upcomingBills.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
                            {t('noUpcoming')}
                        </p>
                    ) : (
                        upcomingBills.map(sub => (
                            <div key={`upcoming-${sub.id}`} className="sub-item glassmorphism" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: sub.color, marginRight: '16px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: 600 }}>{sub.title}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{format(sub.nextDate, language === 'it' ? 'dd MMM yyyy' : 'MMM do, yyyy')}</div>
                                </div>
                                <div style={{ fontWeight: 700 }}>
                                    {parseFloat(sub.amount).toLocaleString(language === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: currency || 'EUR' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </section>
    );
};

export default DashboardView;
