import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

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
  const [isCracked, setIsCracked] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [isSlipping, setIsSlipping] = useState(false);
  const [qteActive, setQteActive] = useState(false);
  const [qteTimer, setQteTimer] = useState(5.0);
  const [likeBtnOffset, setLikeBtnOffset] = useState({ x: 0, y: 0 });
  const [isFalling, setIsFalling] = useState(false);
  const [multiplyingPopups, setMultiplyingPopups] = useState([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [showLonelinessPopup, setShowLonelinessPopup] = useState(false);
  const [unsuccessfulLikes, setUnsuccessfulLikes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setProfiles(getProfiles());
  }, []);

  useEffect(() => {
    setUnsuccessfulLikes(0);
    setLikeBtnOffset({ x: 0, y: 0 });
  }, [currentIndex]);

  const panicMessages = [
    "HURRY! YOUR BIOLOGICAL CLOCK IS TICKING LOUDER THAN A BOMB.",
    "THEY JUST MATCHED WITH YOUR HOTTER COUSIN.",
    "NOBODY HAS LIKED YOU IN 14 MINUTES. IS YOUR INTERNET BROKEN OR JUST YOUR FACE?",
    "WARNING: RUNNING OUT OF POTENTIAL DISAPPOINTMENTS NEAR YOU."
  ];

  const crackPaths = [
    // Radial cracks starting from center of screen (960, 540) to edges
    "M 960 540 L 100 100 L 0 80",
    "M 960 540 L 1800 80 L 1920 120",
    "M 960 540 L 150 900 L 0 950",
    "M 960 540 L 1750 950 L 1920 1000",
    "M 960 540 L 900 20 L 910 0",
    "M 960 540 L 980 1060 L 970 1080",
    "M 960 540 L 50 500 L 0 490",
    "M 960 540 L 1870 560 L 1920 570",
    "M 960 540 L 500 200 L 450 150",
    "M 960 540 L 1400 300 L 1450 250",
    "M 960 540 L 600 800 L 550 850",
    "M 960 540 L 1300 850 L 1350 900",
    // concentric rings in 1920x1080 space
    "M 860 490 L 1060 470 L 1010 610 L 810 590 Z",
    "M 710 400 L 1210 350 L 1110 740 L 610 690 Z",
    "M 460 250 L 1460 200 L 1310 890 L 310 790 Z",
    "M 160 100 L 1760 50 L 1560 1020 L 60 920 Z"
  ];

  const shards = [
    { id: 1, x: -600, y: -400, r: 190, delay: 0.02 },
    { id: 2, x: 650, y: -350, r: 250, delay: 0.08 },
    { id: 3, x: -400, y: 550, r: 80, delay: 0.0 },
    { id: 4, x: 700, y: 480, r: 310, delay: 0.12 },
    { id: 5, x: 100, y: -700, r: 25, delay: 0.05 },
    { id: 6, x: -750, y: 180, r: 120, delay: 0.1 },
    { id: 7, x: 450, y: -580, r: 60, delay: 0.01 },
    { id: 8, x: -200, y: -450, r: 290, delay: 0.06 },
    { id: 9, x: -100, y: 680, r: 15, delay: 0.04 },
    { id: 10, x: 800, y: -50, r: 175, delay: 0.09 },
  ];

  const playFahhhhSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const now = ctx.currentTime;
      const fDuration = 0.15;
      const aDuration = 0.6;
      const hDuration = 0.55;
      const totalDuration = fDuration + aDuration + hDuration;

      // 1. Noise Generator for F and H
      const bufferSize = ctx.sampleRate * totalDuration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      // 2. F Filter (Highpass for sibilant 'F' friction)
      const fFilter = ctx.createBiquadFilter();
      fFilter.type = 'highpass';
      fFilter.frequency.setValueAtTime(6500, now);
      
      const fGain = ctx.createGain();
      fGain.gain.setValueAtTime(0, now);
      fGain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      fGain.gain.exponentialRampToValueAtTime(0.001, now + fDuration);

      noiseNode.connect(fFilter);
      fFilter.connect(fGain);
      fGain.connect(ctx.destination);

      // 3. Vowel Sound 'A' (Oscillator + Formant Filters F1 & F2)
      const pitch = 95; // Goofy low pitch for 'fah'
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(pitch, now);
      
      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 6;
      const vibratoGain = ctx.createGain();
      vibratoGain.gain.value = 3;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start();

      const formant1 = ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(800, now);
      formant1.Q.setValueAtTime(10, now);

      const formant2 = ctx.createBiquadFilter();
      formant2.type = 'bandpass';
      formant2.frequency.setValueAtTime(1250, now);
      formant2.Q.setValueAtTime(10, now);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.setValueAtTime(0, now + fDuration * 0.7);
      oscGain.gain.linearRampToValueAtTime(0.3, now + fDuration + 0.05);
      oscGain.gain.setValueAtTime(0.3, now + fDuration + aDuration - 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + fDuration + aDuration);

      osc.connect(formant1);
      osc.connect(formant2);
      
      const formantGain = ctx.createGain();
      formantGain.gain.setValueAtTime(0.5, now);
      
      formant1.connect(formantGain);
      formant2.connect(formantGain);
      formantGain.connect(oscGain);
      oscGain.connect(ctx.destination);

      // 4. H Filter (Decaying 'H' breath noise)
      const hFilter = ctx.createBiquadFilter();
      hFilter.type = 'bandpass';
      hFilter.frequency.setValueAtTime(1500, now);
      hFilter.Q.setValueAtTime(2, now);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(0, now);
      hGain.gain.setValueAtTime(0, now + fDuration + aDuration - 0.15);
      hGain.gain.linearRampToValueAtTime(0.18, now + fDuration + aDuration);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + totalDuration);

      noiseNode.connect(hFilter);
      hFilter.connect(hGain);
      hGain.connect(ctx.destination);

      osc.start(now);
      noiseNode.start(now);

      osc.stop(now + totalDuration);
      noiseNode.stop(now + totalDuration);
      vibrato.stop(now + totalDuration);
    } catch (e) {
      console.error("FAHHHH audio failed", e);
    }
  };

  const playSoapSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!qteActive) return;
    const interval = setInterval(() => {
      setQteTimer(prev => {
        if (prev <= 0.1) {
          clearInterval(interval);
          setQteActive(false);
          toast.error(`💨 Too slow! ${profiles[currentIndex].name} got bored and swiped left on you.`);
          setCurrentIndex((prevIdx) => (prevIdx + 1) % profiles.length);
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [qteActive, currentIndex, profiles]);

  // Background Match requests from other profiles liking the user's custom profile details!
  useEffect(() => {
    const timer = setInterval(() => {
      const stored = localStorage.getItem('userProfile');
      if (!stored) return;
      const userProfile = JSON.parse(stored);
      
      const potentialMatches = [
        { name: 'Stacy', age: 22, bio: 'Aries. Self-proclaimed chef (cereal).', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy' },
        { name: 'Becky', age: 21, bio: 'Looking for someone to pay for my iced lattes.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Becky' },
        { name: 'Chad', age: 24, bio: 'Gym is my therapy. Finance bro.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chad' },
        { name: 'Gary', age: 29, bio: 'I own 47 indoor plants and a cat that hates me.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gary' },
        { name: 'Karen', age: 31, bio: 'I need to speak to the manager of this dating app.', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karen' }
      ];

      const match = potentialMatches[Math.floor(Math.random() * potentialMatches.length)];
      
      // Let's generate a highly personalized pick-up line using the user's name or bio!
      const lines = [
        `"Hey ${userProfile.name}, your bio ('${userProfile.bio.substring(0, 30)}...') is a massive red flag, but I swiped right anyway!"`,
        `"Is your name really ${userProfile.name}? Your avatar looks adorable, let's match!"`,
        `"Wow ${userProfile.name}, your profile is so chaotic, I think we are perfect matches."`
      ];
      
      const greeting = lines[Math.floor(Math.random() * lines.length)];

      toast.info(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', cursor: 'pointer' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-pink)' }}>🔔 NEW MATCH REQUEST!</span>
          <span>{match.name} ({match.age}) swiped right on you!</span>
          <em style={{ fontSize: '0.75rem', opacity: 0.9 }}>{greeting}</em>
          <span style={{ fontSize: '0.65rem', color: '#4cd964', textDecoration: 'underline' }}>Click to accept instantly!</span>
        </div>,
        {
          autoClose: 10000,
          onClick: () => {
            // Instantly accept the match and save to localStorage!
            localStorage.setItem('matchedProfile', JSON.stringify({
              name: match.name,
              img: match.img,
              age: match.age,
              bio: match.bio
            }));
            toast.success(`🎉 MATCH SECURED! Connecting you with ${match.name}...`);
            setTimeout(() => {
              navigate('/match');
            }, 800);
          }
        }
      );
    }, 25000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Synthetic Fan Hum mechanical whirring sound - ramps up pitch and volume as desperation rises!
  useEffect(() => {
    let audioCtx = null;
    let noiseNode = null;
    let filterNode = null;
    let gainNode = null;

    if (swipeCount > 0) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        // Create 2-second loop buffer
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        // Bandpass filter to model mechanical whirring sound
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'bandpass';
        // Base hum starts low but raises with every profile swiped (overheating CPU!)
        const baseFreq = 160 + swipeCount * 35;
        filterNode.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
        filterNode.Q.setValueAtTime(3.5, audioCtx.currentTime);

        // Lowpass filter to damp high frequencies and emphasize deep vibrations
        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(650, audioCtx.currentTime);

        gainNode = audioCtx.createGain();
        // Volume grows louder with desperation (capped safely at 0.3)
        const targetVolume = Math.min(0.3, (swipeCount * 0.04));
        gainNode.gain.setValueAtTime(targetVolume, audioCtx.currentTime);

        noiseNode.connect(filterNode);
        filterNode.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start(0);
      } catch (e) {
        console.error("Desperation hum failed", e);
      }
    }

    return () => {
      if (noiseNode) {
        try { noiseNode.stop(); } catch(e){}
        noiseNode.disconnect();
      }
      if (filterNode) filterNode.disconnect();
      if (gainNode) gainNode.disconnect();
      if (audioCtx) {
        try { audioCtx.close(); } catch(e){}
      }
    };
  }, [swipeCount]);

  const incrementSwipes = () => {
    const nextCount = swipeCount + 1;
    setSwipeCount(nextCount);
    if (nextCount === 7) {
      setShowLonelinessPopup(true);
      toast.error("🔥 SYSTEM TEMPERATURE WARNING: CRITICAL LEVEL!");
    }
  };

  const handleLike = () => {
    incrementSwipes();
    if (isCracked || isSlipping || qteActive) return;

    if (unsuccessfulLikes >= 3) {
      const matched = profiles[currentIndex];
      localStorage.setItem('matchedProfile', JSON.stringify({ name: matched.name, img: matched.img, age: matched.age, bio: matched.bio }));
      toast.success(`🎯 MATCH SECURED! You successfully selected ${matched.name}!`);
      setTimeout(() => {
        navigate('/match');
      }, 800);
      return;
    }

    setUnsuccessfulLikes(prev => prev + 1);

    // 50% chance of soap card slip
    if (Math.random() < 0.5) {
      setIsSlipping(true);
      playSoapSound();
      toast.warn(`🧼 OOPS! ${profiles[currentIndex].name} is too slippery! The profile card slipped out of your greasy hands!`);
      setTimeout(() => {
        setIsSlipping(false);
      }, 1000);
      return;
    }

    // Trigger 5s QTE chase!
    setQteActive(true);
    setQteTimer(5.0);
    toast.info(`⚡ MATCH CHASE STARTED! Click the vibrating card within 5 seconds to secure the match!`);
  };

  const runAway = () => {
    if (unsuccessfulLikes >= 3) {
      return;
    }
    const newX = (Math.random() - 0.5) * 360;
    const newY = (Math.random() - 0.5) * 260;
    setLikeBtnOffset({ x: newX, y: newY });
    setUnsuccessfulLikes(prev => {
      const next = prev + 1;
      toast.warn(`🧼 OOPS! The Like button slipped like wet soap! Try to catch it! (Attempt ${next}/3)`);
      return next;
    });
  };

  const spawnMultiplyingPopups = () => {
    const messages = [
      "⚠️ SYSTEM WARNING: Low relationship standards detected!",
      "🚨 RIZZ MELTDOWN: Biological clock ticking down to zero!",
      "😭 WARNING: Skipping Stacy will guarantee dying alone with 14 cats!",
      "💔 ALERT: Your Ex is matched with Chad and they are laughing at you!",
      "🤡 DANGER: Extreme clown activities detected on skip left!",
      "⚠️ CRITICAL: Please upgrade to Tinder Platinum to view matches' standards!",
      "🚫 FIREWALL MELTDOWN: Lower your standards immediately!"
    ];
    let count = 0;
    const interval = setInterval(() => {
      if (count > 7) {
        clearInterval(interval);
        return;
      }
      setMultiplyingPopups(prev => [
        ...prev,
        {
          id: Math.random(),
          title: messages[Math.floor(Math.random() * messages.length)],
          x: Math.random() * (window.innerWidth - 320),
          y: Math.random() * (window.innerHeight - 200)
        }
      ]);
      count++;
    }, 180);
  };

  const closePopup = (id) => {
    setMultiplyingPopups(prev => prev.filter(p => p.id !== id));
  };

  const handleSkip = () => {
    incrementSwipes();
    if (isCracked || isFalling) return;
    setIsFalling(true);
    spawnMultiplyingPopups();
    playFahhhhSound();
    
    setTimeout(() => {
      setIsCracked(true);
    }, 450);

    setTimeout(() => {
      setShowBox(true);
    }, 850);

    setTimeout(() => {
      setIsCracked(false);
      setShowBox(false);
      setIsFalling(false);
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }, 4850);
  };

  const currentProfile = profiles[currentIndex];

  return (
    <motion.div 
      className="swipe-screen" 
      animate={isCracked ? {
        x: [0, -18, 18, -14, 14, -10, 10, -5, 5, 0],
        y: [0, 14, -14, 10, -10, 7, -7, 3, -3, 0],
        rotate: [0, -1.5, 1.5, -1.0, 1.0, -0.6, 0.6, -0.2, 0.2, 0],
      } : {}}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <AnimatePresence>
        {qteActive && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '15px',
              border: '2px solid white',
              boxShadow: '0 0 35px rgba(225, 29, 72, 0.8)',
              zIndex: 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              width: '100%',
              maxWidth: '450px'
            }}
          >
            <span style={{ fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px', textAlign: 'center' }}>
              ⚡ CATCH THE PROFILE CARD BEFORE THEY SWIPE LEFT!
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', width: '60px', fontFamily: 'monospace' }}>
                {qteTimer.toFixed(1)}s
              </span>
              <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(qteTimer / 5.0) * 100}%`,
                  height: '100%',
                  background: '#f43f5e',
                  transition: 'width 0.1s linear'
                }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
          animate={isFalling ? {
            y: [0, 120, 950],
            rotate: [0, -18, -50],
            scale: [1, 0.96, 0.35],
            opacity: [1, 1, 0]
          } : isSlipping ? {
            x: [0, 80, -250, 450],
            y: [0, -40, 180, 850],
            rotate: [0, 15, -60, 240],
            scale: [1, 0.98, 0.75, 0.2],
            opacity: [1, 1, 0.9, 0]
          } : qteActive ? {
            x: [0, -12, 12, -8, 8, -12, 12, 0],
            y: [0, 10, -10, 6, -6, 10, -10, 0],
            rotate: [0, -3, 3, -2, 2, -3, 3, 0],
            scale: [1, 1.05, 0.95, 1.03, 0.97, 1]
          } : { scale: 1, opacity: 1, rotate: 0 }}
          transition={isFalling ? { duration: 0.75, ease: "easeIn" } : isSlipping ? { duration: 0.95, ease: "easeOut" } : qteActive ? {
            repeat: Infinity,
            duration: 0.35,
            ease: "linear"
          } : { duration: 0.3 }}
          exit={{ x: 500, opacity: 0, rotate: 20 }}
          className="glass swipe-card-responsive"
          style={{ 
            width: '90%', 
            maxWidth: '400px', 
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '0', 
            overflow: 'hidden', 
            position: 'relative', 
            cursor: qteActive ? 'crosshair' : 'default' 
          }}
          onClick={() => {
            if (qteActive) {
              setQteActive(false);
              const matched = profiles[currentIndex];
              localStorage.setItem('matchedProfile', JSON.stringify({ name: matched.name, img: matched.img, age: matched.age, bio: matched.bio }));
              toast.success(`🎯 CATCH SECURED! You locked in a match with ${matched.name}!`);
              setTimeout(() => {
                navigate('/match');
              }, 700);
            }
          }}
        >
          <div style={{ height: '28vh', minHeight: '180px', maxHeight: '280px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={currentProfile.img} alt={currentProfile.name} style={{ width: '170px', maxHeight: '90%', objectFit: 'contain' }} />
          </div>
          <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.8rem' }}>{currentProfile.name}, {currentProfile.age}</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '10px', fontSize: '0.9rem' }}>{currentProfile.bio}</p>
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem' }}>🚩 Red Flag: Honest</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 10px', borderRadius: '5px', fontSize: '0.7rem' }}>🚩 Red Flag: Human</div>
            </div>
          </div>

          {/* Rejection box modal popup overlay */}
          {showBox && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ 
                position: 'absolute', 
                inset: '20px', 
                background: 'rgba(10, 10, 10, 0.95)', 
                border: '2px solid var(--accent-pink)',
                borderRadius: '15px',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '20px',
                zIndex: 20,
                boxShadow: '0 0 30px rgba(255, 45, 85, 0.45)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h3 style={{ color: 'var(--accent-pink)', marginBottom: '15px', fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>💔 REJECTED!</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.4', fontWeight: '500' }}>
                They actually kind of liked you. Now they're going to delete the app and adopt 14 cats because of your rejection.
              </p>
              <div style={{ height: '1px', width: '80%', background: 'var(--glass-border)', margin: '20px 0' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Thinking about what you've done...
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* SVG Cracks overlay - Covers WHOLE viewport! */}
      {isCracked && (
        <svg 
          viewBox="0 0 1920 1080" 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            width: '100vw', 
            height: '100vh', 
            pointerEvents: 'none', 
            zIndex: 999 
          }}
        >
          {crackPaths.map((path, idx) => (
            <motion.path
              key={idx}
              d={path}
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth={idx < 12 ? "4.5" : "2"}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.008 }}
              style={{
                filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.85))'
              }}
            />
          ))}
        </svg>
      )}

      {/* Flying glass shards - Spreads across the WHOLE screen! */}
      {isCracked && shards.map((shard) => (
        <motion.div
          key={shard.id}
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            width: '16px',
            height: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            backdropFilter: 'blur(3px)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
          initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
          animate={{ 
            x: shard.x * 1.5, 
            y: shard.y * 1.5, 
            scale: [1, 0.8, 0], 
            rotate: shard.r * 2.5,
            opacity: [1, 1, 0] 
          }}
          transition={{ duration: 0.9, ease: "easeOut", delay: shard.delay }}
        />
      ))}

      <div style={{ display: 'flex', gap: '20px', marginTop: '40px', zIndex: 10 }}>
        <button 
          onClick={handleSkip} 
          className="btn-premium" 
          disabled={isCracked}
          style={{ 
            background: '#333', 
            borderRadius: '50%', 
            width: '60px', 
            height: '60px', 
            padding: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: isCracked ? 0.5 : 1,
            cursor: isCracked ? 'not-allowed' : 'pointer'
          }}
        >
          <X size={30} />
        </button>
        <button 
          onClick={handleLike} 
          onMouseEnter={runAway}
          className="btn-premium" 
          disabled={isCracked}
          style={{ 
            borderRadius: '50%', 
            width: '60px', 
            height: '60px', 
            padding: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: isCracked ? 0.5 : 1,
            cursor: isCracked ? 'not-allowed' : 'pointer',
            transform: `translate(${likeBtnOffset.x}px, ${likeBtnOffset.y}px)`,
            transition: 'transform 0.12s ease-out'
          }}
        >
          <Heart size={30} />
        </button>
      </div>

      {/* Multiplying Warning Popups */}
      <AnimatePresence>
        {multiplyingPopups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="glass"
            style={{
              position: 'fixed',
              top: popup.y,
              left: popup.x,
              width: '300px',
              padding: '16px 20px',
              zIndex: 3000,
              background: 'rgba(18, 2, 2, 0.96)',
              border: '2.5px solid var(--accent-pink)',
              boxShadow: '0 8px 32px rgba(255, 45, 85, 0.3)',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--accent-pink)', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚠️ WARNING DIALOG
              </span>
              <button 
                onClick={() => closePopup(popup.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', lineHeight: '1.4', margin: 0, color: '#fefefe' }}>
              {popup.title}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>

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

      {/* CPU Overheating Loneliness Dialog */}
      <AnimatePresence>
        {showLonelinessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.92)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              style={{
                background: '#1a0505',
                border: '3px solid #ff3333',
                boxShadow: '0 0 50px rgba(255, 51, 51, 0.6)',
                borderRadius: '20px',
                padding: '30px',
                width: '380px',
                textAlign: 'center',
                color: 'white',
                position: 'relative'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ fontSize: '4.5rem', marginBottom: '15px' }}
              >
                🔥💨
              </motion.div>
              
              <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#ff3333', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                ⚠️ CRITICAL OVERHEATING
              </h3>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>
                "SYSTEM STRUGGLING TO PROCESS LONELINESS."
              </h4>

              <p style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: '1.45', marginBottom: '25px' }}>
                Your desperate rapid-swiping profile updates are pushing the server processor beyond 100% capacity! The virtual fan is screaming to dissipate the friction of your romance seek.
              </p>

              {/* Progress visual bar */}
              <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ff3333', fontWeight: 'bold', marginBottom: '4px' }}>
                  <span>🚨 desperate heat index</span>
                  <span>99.8%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    animate={{ width: ['0%', '100%'] }} 
                    transition={{ duration: 4, ease: 'easeInOut' }}
                    style={{ width: '99.8%', height: '100%', background: 'linear-gradient(90deg, #ef4444, #ff3333)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    setShowLonelinessPopup(false);
                    setSwipeCount(0); // Reset swipe count to restore normal cooling fan quietness!
                    toast.success("❄️ Coolant injected! CPU temperatures normalizing...");
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#ff3333',
                    border: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Acknowledge Loneliness & Cool Down CPU
                </button>
                
                <button
                  onClick={() => {
                    toast.error("❌ Payment Declined: Insufficient Emotional Funds on credit line!");
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    color: '#ffcc00',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Upgrade to Liquid Nitrogen Cooling ($49.99)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Swipe;
