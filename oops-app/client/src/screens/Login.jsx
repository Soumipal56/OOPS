import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('boy');
  const [errors, setErrors] = useState([]);
  const [step, setStep] = useState(1);
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('Swiping to see if someone can handle my issues.');
  const [profileAvatar, setProfileAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=LonelyUser');
  const controls = useAnimation();
  const navigate = useNavigate();

  // Volume & Screamer game states
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showScreamGame, setShowScreamGame] = useState(false);
  const [screamProgress, setScreamProgress] = useState(0);
  const [isScreamUnlocked, setIsScreamUnlocked] = useState(false);

  const playScreamOfCharacter = (char) => {
    if (isMuted) return;
    if (!char) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(char.toUpperCase());
    utterance.rate = 1.6;
    utterance.pitch = 2.0;
    utterance.volume = volume / 100;
    synth.speak(utterance);
  };

  // Mic Scream input analyzer loop
  useEffect(() => {
    if (!showScreamGame || isScreamUnlocked) return;
    
    let audioContext = null;
    let analyser = null;
    let micStream = null;
    let animationFrameId = null;
    
    const startMicMonitoring = async () => {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(micStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const trackVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          const percentage = Math.min(100, Math.max(0, Math.floor((average / 110) * 100)));
          
          setScreamProgress(prev => {
            const next = Math.max(prev, percentage);
            if (next >= 100) {
              setIsScreamUnlocked(true);
              setIsMuted(true);
              setShowScreamGame(false);
              toast.success("🍦 SCREAM ACCEPTED! Volume successfully muted!");
            }
            return next;
          });
          
          animationFrameId = requestAnimationFrame(trackVolume);
        };
        
        trackVolume();
      } catch (err) {
        console.warn("Microphone access denied or not available. Using button cheat.");
      }
    };
    
    startMicMonitoring();
    
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (micStream) micStream.getTracks().forEach(t => t.stop());
      if (audioContext) audioContext.close();
    };
  }, [showScreamGame, isScreamUnlocked]);

  // Natural volume/scream drain
  useEffect(() => {
    if (!showScreamGame || isScreamUnlocked) return;
    const interval = setInterval(() => {
      setScreamProgress(prev => Math.max(0, prev - 3));
    }, 400);
    return () => clearInterval(interval);
  }, [showScreamGame, isScreamUnlocked]);

  const [validations, setValidations] = useState({
    noE: false,
    nickname: false,
    weather: false
  });

  useEffect(() => {
    if (profileName.trim()) {
      setProfileAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileName.trim())}`);
    } else {
      setProfileAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=LonelyUser`);
    }
  }, [profileName]);

  const passwordRules = [
    { id: 'noE', text: "No letter 'e' (too common, like you)" },
    { id: 'nickname', text: "Must include your childhood nickname (any capitalized name like John, Mary)" },
    { id: 'weather', text: "Must predict the weather tomorrow (sunny, rain, snow, etc)" },
  ];

  const handleMouseEnter = async () => {
    const allPassed = password.length > 0 && validations.noE && validations.nickname && validations.weather;
    if (allPassed) {
      // Return button to center if they finally got it right
      await controls.start({ x: 0, y: 0, transition: { type: 'spring' } });
      return;
    }

    // Button flees to a random position
    const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100);
    const y = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2 - 50);
    
    await controls.start({
      x: x,
      y: y,
      transition: { type: 'spring', stiffness: 500, damping: 20 }
    });
  };

  const validate = () => {
    setValidations({
      noE: password.length > 0 && !/e/i.test(password),
      nickname: /[A-Z][a-z]{2,}/.test(password),
      weather: /sunny|rain|cloud|snow|storm|wind/i.test(password)
    });
  };

  useEffect(() => {
    validate();
  }, [password]);

  return (
    <div className="login-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div className="ticker" style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        background: 'rgba(255,45,85,0.1)',
        padding: '5px',
        fontSize: '0.8rem',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <motion.div
          animate={{ x: [window.innerWidth, -1000] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          BREAKING: Your ex just joined. • "I'm just here for the plot" is now a banned bio. • 4,000 people just swiped left on a ghost. • Mercury is in retrograde.
        </motion.div>
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '4rem', marginBottom: '0', fontStyle: 'italic' }}
      >
        OOPS
      </motion.h1>
      <p style={{ color: 'var(--text-dim)', letterSpacing: '4px', marginBottom: '40px' }}>
        THE DATING APP THAT KNOWS YOU TOO WELL
      </p>

      <div className="glass" style={{ width: '90%', maxWidth: '450px', padding: '30px 20px', boxSizing: 'border-box', transition: 'all 0.3s ease' }}>
        {step === 1 ? (
          <>
            <label style={{ display: 'block', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '10px' }}>EMAIL</label>
            <input 
              type="email" 
              className="cursed-input" 
              placeholder="youresoalone@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '20px' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>PASSWORD</label>
              
              {/* Cursed Volume controller */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: 'bold' }}>
                  {isMuted ? '🔇 MUTED' : `🔊 VOL: ${volume}%`}
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    if (!isScreamUnlocked) {
                      setShowScreamGame(true);
                      toast.warn("🍦 Blinkit Alert: You must scream to mute this application!");
                    } else {
                      setIsMuted(!isMuted);
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  {isMuted ? '🔇' : '🔈'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    if (!isScreamUnlocked) {
                      setShowScreamGame(true);
                      toast.warn("🍦 Blinkit Alert: Silence requires screaming!");
                    } else {
                      setVolume(prev => Math.max(0, prev - 10));
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', padding: 0, color: 'white', fontWeight: 'bold' }}
                >
                  ➖
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setVolume(prev => Math.min(100, prev + 10));
                    setIsMuted(false);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', padding: 0, color: 'white', fontWeight: 'bold' }}
                >
                  ➕
                </button>
              </div>
            </div>
            <input 
              type="password" 
              className="cursed-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                const newVal = e.target.value;
                setPassword(newVal);
                if (newVal.length > password.length) {
                  const lastChar = newVal.charAt(newVal.length - 1);
                  playScreamOfCharacter(lastChar);
                }
              }}
            />

            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              {passwordRules.map(rule => {
                const passed = password.length > 0 && validations[rule.id];
                return (
                  <p key={rule.id} style={{ 
                    fontSize: '0.7rem', 
                    color: passed ? '#4cd964' : 'var(--accent-pink)',
                    marginBottom: '5px',
                    transition: 'color 0.3s'
                  }}>
                    {passed ? '✓' : '✕'} {rule.text}
                  </p>
                );
              })}
            </div>

            <label style={{ display: 'block', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '10px' }}>I AM A</label>
            <select 
              className="cursed-input" 
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                localStorage.setItem('userGender', e.target.value);
              }}
              style={{ marginBottom: '30px', width: '100%', appearance: 'none' }}
            >
              <option value="boy">Boy (Show me girls)</option>
              <option value="girl">Girl (Show me boys)</option>
            </select>

            <motion.button
              animate={controls}
              onMouseEnter={handleMouseEnter}
              className="btn-premium"
              style={{ width: '200px' }}
              onClick={() => {
                const allPassed = password.length > 0 && validations.noE && validations.nickname && validations.weather;
                if (!allPassed) return;
                localStorage.setItem('userGender', gender);
                setStep(2);
              }}
            >
              ENTER THE VOID →
            </motion.button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', marginBottom: '10px' }}>
              🎨 CUSTOMIZE YOUR PROFILE
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '3px solid var(--accent-pink)',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(255,45,85,0.4)',
                padding: '10px'
              }}>
                <img 
                  src={profileAvatar} 
                  alt="Avatar Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                YOUR NAME
              </label>
              <input 
                type="text" 
                className="cursed-input" 
                placeholder="What should we yell when you ghost us?"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                style={{ marginBottom: '0' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                YOUR RED-FLAG BIO
              </label>
              <textarea 
                className="cursed-input" 
                placeholder="List your favorite traumas or red flags here..."
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                style={{ 
                  width: '100%', 
                  height: '80px', 
                  resize: 'none', 
                  fontFamily: 'inherit',
                  padding: '12px'
                }}
              />
            </div>

            <button
              className="btn-premium"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => {
                const finalName = profileName.trim() || 'Lonely User';
                const finalProfile = {
                  name: finalName,
                  bio: profileBio.trim() || 'Swiping to see if someone can handle my issues.',
                  img: profileAvatar,
                  gender: gender
                };
                localStorage.setItem('userProfile', JSON.stringify(finalProfile));
                navigate('/quiz');
              }}
            >
              FINALIZE IDENTITY →
            </button>
          </motion.div>
        )}
        
        <p style={{ marginTop: '20px', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
          By clicking, you agree to be ghosted within 48 hours.
        </p>
      </div>

      {/* Blinkit Ice Cream Scream Mute Challenge */}
      <AnimatePresence>
        {showScreamGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 2, 2, 0.98)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: screamProgress > 50 ? [-1, 1, -1] : 0
              }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="glass"
              style={{
                width: '90%',
                maxWidth: '400px',
                padding: '30px 20px',
                textAlign: 'center',
                border: '2px solid #ef4444',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.5)'
              }}
            >
              <span style={{ fontSize: '3rem' }}>🍦</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white', margin: '15px 0 10px' }}>
                ICE CREAM SCREAM!
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '25px', lineHeight: '1.4' }}>
                Blinkit safety system detected a silence request. You must **SCREAM** into your microphone to reach **100%** to unlock the mute button!
              </p>

              {/* Progress bar */}
              <div style={{ position: 'relative', width: '100%', height: '26px', background: 'rgba(255,255,255,0.06)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '25px' }}>
                <div style={{
                  width: `${screamProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ef4444, #ec4899)',
                  transition: 'width 0.1s ease-out'
                }} />
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                  🎤 SCREAM POWER: {screamProgress}%
                </span>
              </div>

              {/* Backup click masher trigger */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const shoutSynth = window.speechSynthesis;
                    if (shoutSynth) {
                      shoutSynth.cancel();
                      const shout = new SpeechSynthesisUtterance("SCREAM!!!");
                      shout.pitch = 2.0;
                      shout.rate = 1.8;
                      shoutSynth.speak(shout);
                    }
                    
                    setScreamProgress(prev => {
                      const next = Math.min(100, prev + 8);
                      if (next >= 100) {
                        setIsScreamUnlocked(true);
                        setIsMuted(true);
                        setShowScreamGame(false);
                        toast.success("🍦 SCREAM ACCEPTED! Volume successfully muted!");
                      }
                      return next;
                    });
                  }}
                  className="btn-premium"
                  style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444, #ec4899)' }}
                >
                  🎙️ MASH TO SCREAM MANUALLY!
                </button>

                <button
                  type="button"
                  onClick={() => setShowScreamGame(false)}
                  style={{ background: 'none', border: 'none', color: '#777', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Give up (Keep loud scream audio active)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
