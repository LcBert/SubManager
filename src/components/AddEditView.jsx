import { useState, useEffect } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { ChevronLeft, DollarSign } from 'lucide-react';

const COLORS = [
  '#E50914', '#1DB954', '#00A8E1', '#7B61FF', 
  '#FF3B30', '#FF9500', '#34C759', '#5AC8FA'
];

const METHODS = ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'Other'];

const AddEditView = ({ subId, onClose }) => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  
  const isEditing = !!subId;
  const existingSub = isEditing ? subscriptions.find(s => s.id === subId) : null;

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    method: 'Credit Card',
    cycleType: 'monthly',
    cycleCount: '3',
    firstBill: new Date().toISOString().split('T')[0],
    color: COLORS[0]
  });

  useEffect(() => {
    if (existingSub) {
      setFormData(existingSub);
    }
  }, [existingSub]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateSubscription({ ...formData, id: subId });
    } else {
      addSubscription(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (isEditing) {
      deleteSubscription(subId);
      onClose();
    }
  };

  return (
    <section className="view slide-up" style={{ backgroundColor: 'var(--bg-color)', zIndex: 100 }}>
      <header className="app-header">
        <button className="icon-btn" onClick={onClose}>
          <ChevronLeft size={24} /> Back
        </button>
        <h1>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</h1>
        <div style={{ width: 60 }} /> {/* Spacer */}
      </header>
      
      <main className="scroll-content">
        <form className="sub-form" onSubmit={handleSubmit}>
          
          <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
            <label>Title</label>
            <input 
              type="text" 
              placeholder="e.g. Netflix, Spotify" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
              style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
            />
          </div>
          
          <div className="form-group row">
            <div className="col glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
              <label>Amount</label>
              <div className="input-with-icon" style={{ marginTop: '8px' }}>
                <DollarSign className="icon-left" size={18} />
                <input 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01" 
                  min="0" 
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required 
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                />
              </div>
            </div>
          </div>
          
          <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
            <label>Billing Method</label>
            <select 
              value={formData.method}
              onChange={e => setFormData({...formData, method: e.target.value})}
              required
              style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
            >
              {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="form-group row glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
            <div className="col">
              <label>Billing Cycle</label>
              <select 
                value={formData.cycleType}
                onChange={e => setFormData({...formData, cycleType: e.target.value})}
                required
                style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
              >
                <option value="monthly">Every Month</option>
                <option value="custom-months">Every X Months</option>
                <option value="yearly">Every Year</option>
              </select>
            </div>
            
            {formData.cycleType === 'custom-months' && (
              <div className="col">
                <label>Months (X)</label>
                <input 
                  type="number" 
                  min="2" max="11" 
                  value={formData.cycleCount}
                  onChange={e => setFormData({...formData, cycleCount: e.target.value})}
                  style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
                />
              </div>
            )}
          </div>
          
          <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
            <label>Next Billing Date</label>
            <input 
              type="date" 
              value={formData.firstBill}
              onChange={e => setFormData({...formData, firstBill: e.target.value})}
              required 
              style={{ marginTop: '8px', background: 'rgba(0,0,0,0.2)' }}
            />
          </div>

          <div className="form-group glassmorphism" style={{ padding: '20px', border: 'none', backgroundColor: 'var(--surface-color)' }}>
            <label>Color Accent</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
              {COLORS.map(c => (
                <div 
                  key={c}
                  onClick={() => setFormData({...formData, color: c})}
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
  );
};

export default AddEditView;
