import { useState } from 'react';
import NotificationEditView from './NotificationEditView';
import { ChevronLeft, Plus } from 'lucide-react';

const NotificationsPage = ({ notifications, onAdd, onRemove, onBack }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState(null);

    return (
        <section className="view slide-up" style={{ backgroundColor: 'var(--bg-color)', zIndex: 100 }}>
            <header className="app-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="icon-btn" onClick={onBack}>
                    <ChevronLeft size={24} /> Back
                </button>
                <h1 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Notifications</h1>
                <button
                    className="icon-btn"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => setModalOpen(true)}
                >
                    <Plus size={24} />
                </button>
            </header>
            <main className="scroll-content">
                {notifications && notifications.length > 0 ? (
                    <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {notifications.map((n, i) => (
                            <div
                                key={i}
                                style={{
                                    background: 'var(--surface-color)',
                                    borderRadius: '16px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    padding: '18px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setEditIndex(i);
                                    setEditData(n);
                                }}
                            >
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    background: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: 20,
                                    marginRight: 8
                                }}>
                                    ⏰
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>
                                        {n.number} {n.period}(s) before
                                        <span style={{ fontWeight: 400, fontSize: 14, color: 'var(--text-secondary)', marginLeft: 8 }}>at {n.time}</span>
                                    </div>
                                    {n.message && (
                                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, whiteSpace: 'pre-line' }}>
                                            {n.message}
                                        </div>
                                    )}
                                </div>
                                <button
                                    style={{ fontSize: 18, color: 'red', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }}
                                    title="Remove notification"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onRemove(i);
                                    }}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '32px 0' }}>No notifications set.</div>
                )}
            </main>
            {modalOpen && (
                <NotificationEditView
                    onSave={notif => {
                        onAdd(notif);
                        setModalOpen(false);
                    }}
                    onCancel={() => setModalOpen(false)}
                />
            )}
            {editIndex !== null && (
                <NotificationEditView
                    {...editData}
                    onSave={notif => {
                        // Replace notification at editIndex
                        const updated = [...notifications];
                        updated[editIndex] = notif;
                        onAdd(updated[editIndex], editIndex);
                        setEditIndex(null);
                        setEditData(null);
                    }}
                    onCancel={() => {
                        setEditIndex(null);
                        setEditData(null);
                    }}
                />
            )}
        </section>
    );
};

export default NotificationsPage;
