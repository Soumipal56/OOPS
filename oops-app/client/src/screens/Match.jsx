import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, TrendingDown, Clock, Ghost } from 'lucide-react';

const Match = () => {
  const navigate = useNavigate();
  const [matchedProfile, setMatchedProfile] = useState({ name: 'Chad', img: '/chad.png' });

  useEffect(() => {
    const stored = localStorage.getItem('matchedProfile');
    if (stored) {
      setMatchedProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="match-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center',
      overflowY: 'auto'
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        style={{ color: 'var(--accent-pink)', marginBottom: '20px' }}
      >
        <Heart size={100} fill="var(--accent-pink)" />
      </motion.div>

      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>IT'S A MATCH!</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>...but don't get your hopes up.</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <img 
          src={localStorage.getItem('userGender') === 'girl' 
            ? "https://api.dicebear.com/7.x/avataaars/svg?seed=GirlYou" 
            : "https://api.dicebear.com/7.x/avataaars/svg?seed=BoyYou"} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--accent-pink)', objectFit: 'cover' }} 
          alt="You" 
        />
        <img src={matchedProfile.img} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--accent-purple)', objectFit: 'cover' }} alt={matchedProfile.name} />
      </div>

      <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '30px', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingDown color="var(--accent-pink)" /> FAILURE PROBABILITY: 98.4%
        </h3>
        
        <div style={{ display: 'grid', gap: '15px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
            <span>Last Active:</span>
            <span style={{ color: 'white' }}>3 years ago</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
            <span>Response Rate:</span>
            <span style={{ color: 'white' }}>0.001% (Never)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
            <span>Avg. Ghosting Time:</span>
            <span style={{ color: 'white' }}>14 seconds</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
            <span>Compatibility:</span>
            <span style={{ color: 'var(--accent-pink)' }}>ERROR: NOT FOUND</span>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '20px 0' }} />
        
        <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-dim)', textAlign: 'center' }}>
          "They are currently talking to 14 other people who are taller than you."
        </p>
      </div>

      <button 
        className="btn-premium" 
        style={{ marginTop: '40px', width: '300px' }}
        onClick={() => navigate('/payment')}
      >
        MESSAGE THEM ANYWAY ($13.09)
      </button>
      
      <p style={{ marginTop: '20px', color: 'var(--text-dim)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Ghost size={14} /> 4 people are currently ghosting you.
      </p>
    </div>
  );
};

export default Match;
