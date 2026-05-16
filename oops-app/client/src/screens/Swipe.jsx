import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, X, AlertTriangle } from 'lucide-react';

const Swipe = () => {
  const getProfiles = () => {
    const gender = localStorage.getItem('userGender') || 'boy';
    if (gender === 'boy') {
      // Girl profiles shown to boys
      return [
        { id: 2, name: "Stacy", age: 22, bio: "If you can't handle me at my worst, you don't deserve me at my slightly less worse 💅", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy" },
        { id: 4, name: "Becky", age: 24, bio: "Fluent in sarcasm. My love language is leaving you on read 💕", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Becky" },
        { id: 5, name: "Karen", age: 31, bio: "Looking for a man who's 6ft, earns 6 figures, and has 6 months to live so I get the house 🏠", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karen" }
      ];
    }
    // Boy profiles shown to girls
    return [
      { id: 1, name: "Chad", age: 24, bio: "6'2 but my emotional maturity is 3'1. I'll reply in 3-5 business days 😎", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chad" },
      { id: 3, name: "Gary", age: 38, bio: "Just a simple guy who loves gym, protein shakes, and ignoring your texts 💪", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gary" },
      { id: 6, name: "Brad", age: 27, bio: "I'll treat you like a queen... until I find my PS5 controller. No drama pls 🎮", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brad" }
    ];
  };

  const [profiles, setProfiles] = useState(getProfiles());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmStep, setConfirmStep] = useState(0);
  const [guiltTrip, setGuiltTrip] = useState(false);
  const navigate = useNavigate();

  const panicMessages = [
    "HURRY! YOUR BIOLOGICAL CLOCK IS TICKING LOUDER THAN A BOMB.",
    "THEY JUST MATCHED WITH YOUR HOTTER COUSIN.",
    "NOBODY HAS LIKED YOU IN 14 MINUTES. IS YOUR INTERNET BROKEN OR JUST YOUR FACE?",
    "WARNING: RUNNING OUT OF POTENTIAL DISAPPOINTMENTS NEAR YOU."
  ];

  const handleLike = () => {
    if (confirmStep < 3) {
      setConfirmStep(confirmStep + 1);
    } else {
      setConfirmStep(0);
      const matched = profiles[currentIndex];
      localStorage.setItem('matchedProfile', JSON.stringify({ name: matched.name, img: matched.img, age: matched.age, bio: matched.bio }));
      navigate('/match');
    }
  };

  const handleSkip = () => {
    setGuiltTrip(true);
    setTimeout(() => {
      setGuiltTrip(false);
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }, 2000);
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="swipe-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <div className="panic-banner" style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        background: 'var(--accent-pink)',
        color: 'white',
        padding: '10px',
        fontWeight: '900',
        fontSize: '1.2rem',
        textAlign: 'center',
        zIndex: 100
      }}>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {panicMessages[currentIndex % panicMessages.length]}
        </motion.div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ x: 500, opacity: 0, rotate: 20 }}
          className="glass"
          style={{ width: '100%', maxWidth: '400px', padding: '0', overflow: 'hidden', position: 'relative' }}
        >
          <div style={{ height: '300px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={currentProfile.img} alt={currentProfile.name} style={{ width: '200px' }} />
          </div>
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.8rem' }}>{currentProfile.name}, {currentProfile.age}</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '10px', fontSize: '0.9rem' }}>{currentProfile.bio}</p>
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem' }}>🚩 Red Flag: Honest</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem' }}>🚩 Red Flag: Human</div>
            </div>
          </div>

          {guiltTrip && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}
            >
              <h3 style={{ color: 'var(--accent-pink)', marginBottom: '10px' }}>REALLY?</h3>
              <p>They actually kind of liked you. Now they're going to delete the app and adopt 14 cats because of your rejection.</p>
              <p style={{ fontSize: '0.7rem', marginTop: '10px', color: 'var(--text-dim)' }}>Thinking about what you've done...</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <button onClick={handleSkip} className="btn-premium" style={{ background: '#333', borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={30} />
        </button>
        <button onClick={handleLike} className="btn-premium" style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={30} />
        </button>
      </div>

      <AnimatePresence>
        {confirmStep > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="glass"
            style={{ position: 'fixed', width: '300px', padding: '30px', textAlign: 'center', border: '2px solid var(--accent-pink)', zIndex: 200 }}
          >
            <AlertTriangle color="var(--accent-pink)" size={40} style={{ marginBottom: '15px' }} />
            <h3>CONFIRMATION {confirmStep}/4</h3>
            <p style={{ fontSize: '0.8rem', margin: '15px 0' }}>
              {confirmStep === 1 && "Are you sure? They have a weird laugh."}
              {confirmStep === 2 && "Are you REALLY sure? Their ex is a black belt."}
              {confirmStep === 3 && "FINAL WARNING: This will cost you $13.09 to even say 'hi'."}
            </p>
            <button className="btn-premium" style={{ width: '100%' }} onClick={handleLike}>
              YES, I'M DESPERATE →
            </button>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-dim)', marginTop: '10px', cursor: 'pointer' }} onClick={() => setConfirmStep(0)}>
              Wait, nevermind
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Swipe;
