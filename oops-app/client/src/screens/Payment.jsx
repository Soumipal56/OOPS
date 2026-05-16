import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Receipt, CreditCard } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();

  const fees = [
    { label: "Base Heartbreak Fee", price: 4.99 },
    { label: "Server Maintenance (Passive-Aggressive)", price: 2.50 },
    { label: "Ghosting Insurance (Non-refundable)", price: 3.25 },
    { label: "Dave from Accounting (He's having a bad week)", price: 0.01 },
    { label: "Convenience Charge (For us, not you)", price: 1.45 },
    { label: "Oxygen Consumption Tax", price: 0.89 }
  ];

  const total = fees.reduce((acc, curr) => acc + curr.price, 0).toFixed(2);

  return (
    <div className="payment-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px'
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-pink)', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' }}>
          INVOICE #000-LO-SER
        </div>

        <h2 style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Receipt /> ORDER SUMMARY
        </h2>

        <div style={{ display: 'grid', gap: '15px', margin: '30px 0' }}>
          {fees.map((fee, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>{fee.label}</span>
              <span>${fee.price.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900' }}>
            <span>TOTAL</span>
            <span style={{ color: 'var(--accent-pink)' }}>${total}</span>
          </div>
        </div>

        <div className="cursed-input" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard size={18} color="var(--text-dim)" />
          <input type="text" placeholder="CARD NUMBER" style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="MM/YY" className="cursed-input" style={{ flex: 1 }} />
          <input type="text" placeholder="CVV" className="cursed-input" style={{ flex: 1 }} />
        </div>

        <button 
          className="btn-premium" 
          style={{ width: '100%', marginTop: '20px' }}
          onClick={() => navigate('/chat')}
        >
          PAY TO BE IGNORED →
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.6rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          *By paying, you acknowledge that we will probably sell your data to your ex for a nickel.
        </p>
      </div>
    </div>
  );
};

export default Payment;
