import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const NotificationEditView = ({ onSave, onCancel, number, period, time, message: msg }) => {
    const [notifyNumber, setNotifyNumber] = useState(number || '1');
    const [notifyPeriod, setNotifyPeriod] = useState(period || 'day');
    const [notifyTime, setNotifyTime] = useState(time || '09:00');
    const [message, setMessage] = useState(msg || '$p due $t');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ number: notifyNumber, period: notifyPeriod, time: notifyTime, message });
    };

    return (
        <section className="view slide-up" style={{ backgroundColor: 'var(--bg-color)', zIndex: 100 }}>
            <header className="app-header">
                <button className="icon-btn" onClick={onCancel}>
                    <ChevronLeft size={24} /> Back
                </button>
                <h1>New Notification</h1>
                <div style={{ width: 60 }} />
            </header>
            <main className="scroll-content">
                <form className="sub-form" onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
                        <input
                            type="number"
                            min="0"
                            value={notifyNumber}
                            onChange={e => setNotifyNumber(e.target.value)}
                            style={{ width: 60, background: 'rgba(0,0,0,0.2)' }}
                        />
                        <select
                            value={notifyPeriod}
                            onChange={e => setNotifyPeriod(e.target.value)}
                            style={{ minWidth: 100, background: 'rgba(0,0,0,0.2)' }}
                        >
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                        <span style={{ marginLeft: 8, fontSize: 15, color: 'var(--text-secondary)' }}>before</span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'block', marginBottom: 4 }}>Time</label>
                        <input
                            type="time"
                            value={notifyTime}
                            onChange={e => setNotifyTime(e.target.value)}
                            style={{ width: 100, fontSize: 18, background: 'rgba(0,0,0,0.2)', padding: 8, borderRadius: 8, border: 'none', color: 'inherit' }}
                        />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'block', marginBottom: 4 }}>Message</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={2}
                            style={{ width: '100%', minHeight: 60, fontSize: 17, background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: 'none', color: 'inherit', padding: 10, resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>
                        Parameters will be replaced in the notification:<br />
                        <b>$p</b>: Price<br />
                        <b>$t</b>: Time until payment<br />
                        <b>$n</b>: Subscription name
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: 8, fontSize: 18, borderRadius: 24, padding: '10px 0' }}>Save</button>
                </form>
            </main>
        </section>
    );
};

export default NotificationEditView;
