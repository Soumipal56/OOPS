import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, RefreshCw, Frown } from 'lucide-react';
import { toast } from 'react-toastify';

const Match = () => {
  const navigate = useNavigate();
  const [matchedProfile, setMatchedProfile] = useState({ name: 'Chad', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chad' });
  const [isGlitching, setIsGlitching] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cutsceneStep, setCutsceneStep] = useState(1); // 1: Dating, 2: Marriage, 3: Divorce, 4: Custody, 5: Done (Glitch & Error starts)

  const playDramaSynthesizer = (frequency, duration) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency - 30, now + duration);

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('matchedProfile');
    if (stored) {
      setMatchedProfile(JSON.parse(stored));
    }

    // Play Phase 1 sound instantly
    playDramaSynthesizer(130, 2.8);

    const t1 = setTimeout(() => {
      setCutsceneStep(2);
      playDramaSynthesizer(165, 2.8);
    }, 3000);

    const t2 = setTimeout(() => {
      setCutsceneStep(3);
      playDramaSynthesizer(98, 2.8);
    }, 6000);

    const t3 = setTimeout(() => {
      setCutsceneStep(4);
      playDramaSynthesizer(73, 3.8);
    }, 9000);

    const t4 = setTimeout(() => {
      setCutsceneStep(5);
      // Trigger glitch visual and sound at 1.5 seconds after cutscene
      const glitchTimer = setTimeout(() => {
        setIsGlitching(true);
        playGlitchSound();
      }, 1500);

      // Show server error screen at 2.1 seconds after cutscene
      const errorTimer = setTimeout(() => {
        setIsGlitching(false);
        setShowError(true);
      }, 2100);

    }, 13000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const playGlitchSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Dynamic buzz sound
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.25);
      osc.frequency.setValueAtTime(90, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.65);

      oscGain.gain.setValueAtTime(0.25, now);
      oscGain.gain.setValueAtTime(0.01, now + 0.22);
      oscGain.gain.setValueAtTime(0.25, now + 0.25);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {
      console.error("Glitch audio failed", e);
    }
  };

  const playBheekMaangneKaSound = () => {
    try {
      const audio = new Audio('/sounds/bheek_maangne_ka.mp3');
      audio.play().catch(e => {
        console.error("Failed to play local MP3 sound:", e);
      });
    } catch (e) {
      console.error("Failed to play bheek maangne ka sound", e);
    }
  };

  return (
    <div className="match-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center',
      background: showError ? '#0f0202' : '#050505',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.5s'
    }}>
      {/* Unskippable Cinematic Overlay */}
      {cutsceneStep < 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'black',
            color: 'white',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'Georgia, serif'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            fontSize: '0.65rem',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            fontWeight: '900'
          }}>
            ⚠️ UNSKIPPABLE PREVIEW: YOUR FUTURE RELATIONSHIP LIFE STAGES
          </div>

          <AnimatePresence mode="wait">
            {cutsceneStep === 1 && (
              <motion.div
                key="dating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.7 }}
                style={{ maxWidth: '650px' }}
              >
                <h2 style={{ fontSize: '3rem', color: 'var(--accent-pink)', marginBottom: '20px', fontWeight: 'bold' }}>💑 Year 1: First Date</h2>
                <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "Splitting the bill at Starbucks down to the exact decimal point. You paid $3.47 and she paid $3.46. She noticed the 1-cent disparity. She will bring this up in Year 5."
                </p>
              </motion.div>
            )}

            {cutsceneStep === 2 && (
              <motion.div
                key="marriage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.7 }}
                style={{ maxWidth: '650px' }}
              >
                <h2 style={{ fontSize: '3rem', color: 'var(--accent-purple)', marginBottom: '20px', fontWeight: 'bold' }}>💒 Year 3: The Marriage</h2>
                <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "The wedding of your dreams! Your parents looked visibly disappointed in every single official photograph. The catering was soggy, cold penne pasta."
                </p>
              </motion.div>
            )}

            {cutsceneStep === 3 && (
              <motion.div
                key="divorce"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.7 }}
                style={{ maxWidth: '650px' }}
              >
                <h2 style={{ fontSize: '3.2rem', color: '#f43f5e', marginBottom: '20px', fontWeight: 'bold' }}>💔 Year 5: The Divorce</h2>
                <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "You argued for four consecutive hours about who left the empty oat milk carton back in the fridge. Both of you hired corporate lawyers costing $450/hour."
                </p>
              </motion.div>
            )}

            {cutsceneStep === 4 && (
              <motion.div
                key="custody"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.7 }}
                style={{ maxWidth: '650px' }}
              >
                <h2 style={{ fontSize: '3.2rem', color: '#ef4444', marginBottom: '20px', fontWeight: 'bold' }}>⚖️ Year 7: Custody Battle</h2>
                <p style={{ fontSize: '1.25rem', color: '#ccc', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "{matchedProfile.name} won absolute sole custody of your Level 90 WoW Warrior and the family Netflix password. You get viewing rights on alternate Sunday afternoons."
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: '60px', width: '250px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 12, ease: 'linear' }}
              style={{ height: '100%', background: 'var(--accent-pink)', boxShadow: '0 0 10px var(--accent-pink)' }}
            />
          </div>
        </motion.div>
      )}

      {/* Glitch Overlay scanlines */}
      {isGlitching && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 0, 0, 0.18)',
          zIndex: 9999,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.08), rgba(0, 255, 0, 0.03), rgba(0, 0, 255, 0.08))',
          backgroundSize: '100% 4px, 6px 100%',
        }} />
      )}

      <AnimatePresence mode='wait'>
        {!showError ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Spinning floating hearts */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100px', height: '100px', marginBottom: '20px' }}>
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, 360] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                style={{ color: 'var(--accent-pink)' }}
              >
                <Heart size={80} fill="var(--accent-pink)" />
              </motion.div>
              
              {/* Little side floating hearts */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, x: 0, opacity: 1, scale: 0.5 }}
                  animate={{ 
                    y: [-10, -100 - Math.random() * 40], 
                    x: [0, (i % 2 === 0 ? 50 : -50) + (Math.random() * 30 - 15)], 
                    opacity: [1, 0],
                    scale: [0.5, 1, 0.3] 
                  }}
                  transition={{ duration: 1.1, delay: i * 0.1, repeat: Infinity }}
                  style={{ position: 'absolute', color: i % 2 === 0 ? 'var(--accent-purple)' : 'var(--accent-pink)' }}
                >
                  <Heart size={16} fill="currentColor" />
                </motion.div>
              ))}
            </div>

            <h1 style={{ fontSize: '3rem', marginBottom: '10px', textShadow: '0 0 15px rgba(255,45,85,0.6)' }}>IT'S A MATCH!</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>They swiped right! Reconciling profiles...</p>

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
          </motion.div>
        ) : (
          <motion.div
            key="error-screen"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              padding: '40px', 
              borderColor: 'red',
              borderWidth: '2px',
              boxShadow: '0 0 35px rgba(255, 0, 0, 0.45)',
              background: 'rgba(18, 2, 2, 0.95)',
              textAlign: 'center' 
            }}
          >
            <div style={{ color: 'red', fontSize: '5rem', marginBottom: '20px' }}>
              <Frown size={80} style={{ margin: '0 auto' }} />
            </div>

            <h1 style={{ fontSize: '2rem', color: 'red', textDecoration: 'line-through', opacity: 0.5, marginBottom: '0' }}>IT'S A MATCH!</h1>
            <h1 style={{ fontSize: '2.8rem', color: 'white', fontWeight: '900', marginTop: '5px', letterSpacing: '1px' }}>
              JUST KIDDING.
            </h1>

            <div style={{ height: '1px', width: '80%', background: 'rgba(255, 0, 0, 0.3)', margin: '20px auto' }} />

            <h3 style={{ color: 'red', letterSpacing: '2px', fontSize: '1rem', fontWeight: '900', marginBottom: '15px' }}>
              ⚠️ SERVER ERROR 500
            </h3>
            
            <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '25px' }}>
              Whoops! Our server crashed trying to reconcile {matchedProfile.name}'s standards with your actual profile. 
              We saved you the embarrassment of being ignored.
            </p>

            <div style={{ background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 0, 0, 0.3)', padding: '15px', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '30px', textAlign: 'left' }}>
              <code style={{ fontFamily: 'monospace', color: 'rgba(255,100,100,0.95)', lineHeight: '1.4' }}>
                System.TypeMismatchException: Expected "Someone interesting"<br />
                Actual: "Spends 8 hours playing video games"<br />
                Result: Core database meltdown. Connection terminated.
              </code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn-premium" 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, red, darkred)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  playGlitchSound();
                  alert("Error 500: Meltdown in progress. Please stop clicking, it hurts.");
                }}
              >
                <RefreshCw size={18} /> RETRY (WILL CRASH AGAIN)
              </button>

              <button 
                className="btn-premium" 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                }}
                onClick={() => {
                  playBheekMaangneKaSound();
                  toast.warn("🔒 Firewall bypassed. Entering chat with active warnings...");
                  setTimeout(() => {
                    navigate('/chat');
                  }, 2000);
                }}
              >
                💬 ENTER CHAT ANYWAY (BYPASS MELTDOWN)
              </button>
              
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-dim)', 
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.9rem',
                  marginTop: '10px'
                }} 
                onClick={() => navigate('/swipe')}
              >
                Accept reality and swipe again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Match;
