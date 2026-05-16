import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Shield, AlertTriangle, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingStatus, setTypingStatus] = useState(false);
  const [mood, setMood] = useState('unstable');
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showExPopup, setShowExPopup] = useState('');
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState({ name: 'Someone', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default' });
  const [showMenu, setShowMenu] = useState(false);
  const [language, setLanguage] = useState('english');
  const [showProfile, setShowProfile] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('matchedProfile');
    if (stored) {
      const profile = JSON.parse(stored);
      setMatchedProfile(profile);
      setMessages([{ id: 1, text: `Hey! I saw your profile and thought you looked... interesting. I'm ${profile.name} btw.`, sender: 'them', time: '3 years ago' }]);
    } else {
      setMessages([{ id: 1, text: "Hey! I saw your profile and thought you looked... interesting.", sender: 'them', time: '3 years ago' }]);
    }
  }, []);

  const exMessages = [
    "i miss you. can we talk?",
    "i know i ruined everything but i still think about you",
    "you were literally the best thing that happened to me",
    "i saw someone who looked like you today and it messed me up",
    "i shouldn't be texting you rn",
    "do you ever think about us anymore?",
    "i still have your photos archived",
    "i thought moving on would be easier",
    "i heard our song today. i'm blaming you for the emotional damage",
    "i miss the way we used to talk at 2am",
    "i know you hate me but i miss you",
    "i was stalking your profile accidentally on purpose",
    "you deserved better than the version of me you got",
    "i still check if you're online sometimes",
    "i'm not asking for another chance... unless?",
    "i've dated other people but nobody feels like home",
    "you left and somehow everything got quieter",
    "i still remember your coffee order for no reason",
    "i was hoping you'd text first",
    "i know this is toxic but i miss you",
    "you ever miss me or should i embarrass myself elsewhere",
    "i'm trying to move on but spotify keeps snitching",
    "i regret acting nonchalant when i actually cared",
    "i replay our old chats sometimes",
    "i miss your annoying little habits",
    "you were my favorite notification",
    "i still laugh at things i would've sent to you",
    "i'm sorry for becoming cold when you needed me",
    "i thought time would make me forget you",
    "i almost called you last night",
    "i wanted space and now i hate it here",
    "you were the only person who understood my weirdness",
    "i'm not healed enough to see you happy with someone else",
    "sometimes i type your name and just stare at it",
    "i miss us more than i admit",
    "i saw your story and my entire mood collapsed",
    "i'm still emotionally subscribed to you",
    "i wish we met later in life",
    "you still cross my mind at the worst times",
    "i've been pretending i'm okay without you",
    "i wanted it to be you so badly",
    "i still compare people to you",
    "you moved on faster than i expected",
    "i'm sorry for texting this late but i couldn't sleep",
    "i miss your voice more than i should",
    "part of me still thinks we'll find our way back",
    "you felt like home and i ruined it",
    "i know i don't deserve a reply",
    "i'm trying not to romanticize the past but it's difficult",
    "i just wanted to hear from you one more time"
  ];

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing', (data) => {
      setTypingStatus(data.status); // e.g., 'asking friends what to say' or false
    });

    socket.on('achievement', (data) => {
      toast(`🏆 Achievement Unlocked: ${data.name}`);
    });

    socket.on('toxic_event', (data) => {
      toast.error(data.text);
    });

    socket.on('stateUpdate', (data) => {
       setMood(data.mood);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('achievement');
      socket.off('toxic_event');
      socket.off('stateUpdate');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingStatus]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: 'me', time: 'Just now' };
    setMessages((prev) => [...prev, newMsg]);
    
    socket.emit('sendMessage', { text: input, language });

    // Detect "i love you" type messages
    const lovePatterns = /i love you|i like you|i have feelings|marry me|be mine|you're the one|i'm falling for you/i;
    if (lovePatterns.test(input)) {
      setShowLovePopup(true);
    }

    setInput('');

    const randomExMessage = exMessages[Math.floor(Math.random() * exMessages.length)];
    setShowExPopup(randomExMessage);
    setTimeout(() => setShowExPopup(''), 4000);
  };

  const handleDoubleTap = () => {
     setShowScreenshotWarning(true);
     setTimeout(() => setShowScreenshotWarning(false), 3000);
  };

  // Dynamic Theme based on Mood
  let themeColor = 'var(--accent-pink)';
  let bgOverlay = 'transparent';
  if (mood === 'distanced') {
     themeColor = '#555';
     bgOverlay = 'rgba(0,0,0,0.5)';
  } else if (mood === 'annoyed') {
     themeColor = '#ff3333';
  }

  return (
    <div className="chat-screen" onDoubleClick={handleDoubleTap} style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#050505',
      position: 'relative'
    }}>
      {/* Background Mood Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: bgOverlay, pointerEvents: 'none', transition: 'background 1s' }} />

      {/* Ex Popup */}
      <AnimatePresence>
        {showExPopup && (
          <motion.div 
            initial={{ opacity: 0, x: 300, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 50 }}
            exit={{ opacity: 0, x: 300 }}
            style={{ position: 'fixed', top: '10px', right: '10px', background: 'rgba(20,20,20,0.95)', border: '1px solid var(--accent-pink)', color: 'white', padding: '15px 20px', borderRadius: '15px', zIndex: 150, maxWidth: '280px', boxShadow: '0 10px 30px rgba(255,45,85,0.2)' }}
          >
             <p style={{ fontSize: '0.7rem', color: 'var(--accent-pink)', marginBottom: '5px', fontWeight: 'bold' }}>Message from Ex 💔</p>
             <p style={{ fontSize: '0.9rem' }}>{showExPopup}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fake Screenshot Warning */}
      <AnimatePresence>
        {showScreenshotWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', background: '#ff3333', color: 'white', padding: '15px', borderRadius: '10px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '10px', width: '80%', textAlign: 'center' }}
          >
             <AlertTriangle />
             Careful. This conversation may be screenshotted and sent to a group chat.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}
          >
             <h2 style={{ color: 'var(--accent-pink)', marginBottom: '15px' }}>Ex: I told you no one can love you better than me.</h2>
             <img src={matchedProfile.img} style={{ width: '100px', borderRadius: '50%', border: `4px solid ${themeColor}`, marginBottom: '15px', objectFit: 'cover', height: '100px' }} alt={matchedProfile.name} />
             <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{matchedProfile.name} says: Wait, don't go! Stop!</p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-premium" onClick={() => window.location.href = '/'}>Leave Anyway</button>
                <button className="btn-premium" style={{ background: '#333' }} onClick={() => setShowExitPopup(false)}>Stay and Suffer</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* I Love You Popup */}
      <AnimatePresence>
        {showLovePopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}
          >
             <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: '5rem', marginBottom: '20px' }}>💀</motion.div>
             <h2 style={{ color: 'var(--accent-pink)', marginBottom: '10px', fontSize: '2rem' }}>YOU SAID THE L-WORD?!</h2>
             <p style={{ color: 'var(--text-dim)', marginBottom: '10px', fontSize: '1rem' }}>To someone you met on a CURSED dating app?!</p>
             <img src={matchedProfile.img} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--accent-pink)', objectFit: 'cover', marginBottom: '15px' }} alt={matchedProfile.name} />
             <p style={{ marginBottom: '5px' }}>{matchedProfile.name} has screenshot this and sent it to 14 group chats.</p>
             <p style={{ color: 'var(--accent-pink)', fontStyle: 'italic', marginBottom: '25px', fontSize: '0.85rem' }}>"lmaooo this person just said they love me after 3 messages 💀"</p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-premium" onClick={() => { setShowLovePopup(false); toast('🏆 Achievement Unlocked: Emotionally Reckless'); }}>I regret nothing</button>
                <button className="btn-premium" style={{ background: '#333' }} onClick={() => { setShowLovePopup(false); toast('😔 Achievement Unlocked: Backpedaling Expert'); }}>I meant it platonically</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="glass" style={{ padding: '20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, borderColor: themeColor }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
          <img src={matchedProfile.img} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: `2px solid ${themeColor}` }} alt={matchedProfile.name} />
          <div>
            <h3 style={{ fontSize: '1rem' }}>{matchedProfile.name}{matchedProfile.age ? `, ${matchedProfile.age}` : ''}</h3>
            {matchedProfile.bio && <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{matchedProfile.bio}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>

            <LogOut color="var(--accent-pink)" style={{ cursor: 'pointer' }} onClick={() => setShowExitPopup(true)} />
            <MoreVertical color="var(--text-dim)" style={{ cursor: 'pointer' }} onClick={() => setShowMenu(!showMenu)} />
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  style={{ position: 'absolute', top: '35px', right: '0', background: 'rgba(20,20,20,0.95)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px 0', minWidth: '200px', zIndex: 300, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                >
                  <p style={{ padding: '8px 15px', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>Preferred Language</p>
                  {['english', 'bengali', 'hindi'].map(lang => (
                    <div 
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowMenu(false); toast(`🌐 Language changed to ${lang.charAt(0).toUpperCase() + lang.slice(1)}`); }}
                      style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{lang === 'english' ? '🇬🇧 English' : lang === 'bengali' ? '🇮🇳 বাংলা (Bengali)' : '🇮🇳 हिन्दी (Hindi)'}</span>
                      {language === lang && <span style={{ color: 'var(--accent-pink)' }}>✓</span>}
                    </div>
                  ))}
                  <div style={{ height: '1px', background: 'var(--glass-border)', margin: '5px 0' }} />
                  <p style={{ padding: '8px 15px', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>Chatting with</p>
                  <div style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={matchedProfile.img} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} alt={matchedProfile.name} />
                    <span>{matchedProfile.name}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>

      {/* Profile About Modal - outside header so position:fixed works */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfile(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', border: `1px solid ${themeColor}`, borderRadius: '20px', padding: '30px', width: '320px' }}
            >
              <img src={matchedProfile.img} style={{ width: '90px', height: '90px', borderRadius: '50%', border: `3px solid ${themeColor}`, display: 'block', margin: '0 auto 15px' }} alt={matchedProfile.name} />
              <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>{matchedProfile.name}{matchedProfile.age ? `, ${matchedProfile.age}` : ''}</h2>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '20px' }}>{matchedProfile.bio}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: '📍 Lives in', value: 'The 3rd circle of Hell' },
                  { label: '💼 Experience', value: 'Professional heartbreaker, 7+ years' },
                  { label: '🎂 Real Age', value: '∞ (but emotionally stuck at 16)' },
                  { label: '💔 Exes', value: '∞ and counting' },
                  { label: '🚩 Red flags', value: 'Yes (collecting them like Pokémon)' },
                  { label: '📱 Reply rate', value: '2% (on a good day)' },
                  { label: '🧠 Therapy', value: 'Refused. Repeatedly.' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                    <span style={{ color: 'white', textAlign: 'right', maxWidth: '160px' }}>{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowProfile(false)} style={{ marginTop: '20px', width: '100%', padding: '10px', background: themeColor, border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>Close & Ignore</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 1 }}>
        {messages.map((m) => (
          <motion.div 
            key={m.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              maxWidth: '80%',
              padding: '12px 18px',
              borderRadius: m.sender === 'me' ? '20px 20px 0 20px' : '20px 20px 20px 0',
              alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start',
              background: m.sender === 'me' ? themeColor : 'var(--glass-bg)',
              border: m.sender === 'me' ? 'none' : '1px solid var(--glass-border)',
              position: 'relative'
            }}
          >
            <p style={{ fontSize: '0.9rem' }}>{m.text}</p>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '5px', textAlign: 'right' }}>
              {m.time}
            </span>
          </motion.div>
        ))}

        {typingStatus && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--glass-bg)', padding: '10px 20px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {typingStatus}...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="glass" style={{ padding: '20px', borderRadius: '20px 20px 0 0', display: 'flex', gap: '10px', alignItems: 'center', zIndex: 10 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '5px 20px', display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
          <input 
            type="text" 
            placeholder="Type your disappointment..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'white', width: '100%', padding: '10px 0', outline: 'none' }}
          />
        </div>
        <button type="submit" className="btn-premium" style={{ background: themeColor, borderRadius: '50%', width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Send size={20} />
        </button>
      </form>

      <div style={{ background: 'rgba(255,45,85,0.1)', padding: '5px', textAlign: 'center', fontSize: '0.6rem', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', zIndex: 10 }}>
        <Shield size={10} /> Heartbreak insurance is active. (Premium plan only)
      </div>
    </div>
  );
};

export default Chat;
