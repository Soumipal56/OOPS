import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MoreVertical, Shield, AlertTriangle, LogOut, Heart, Volume2, Wind } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { Application, Assets } from 'pixi.js';
import '@pixi/gif';

const PixiGif = ({ url, alt }) => {
  const containerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let gifSprite = null;

    const initPixi = async () => {
      try {
        const app = new Application();
        await app.init({ width: 250, height: 200, backgroundAlpha: 0 });
        if (!isMounted) {
          app.destroy({ removeView: true, children: true });
          return;
        }
        appRef.current = app;
        if (containerRef.current) {
          containerRef.current.appendChild(app.canvas);
        }

        const loadedGif = await Assets.load(url);
        if (!isMounted) return;

        gifSprite = loadedGif.clone();
        const scale = Math.min(250 / gifSprite.width, 200 / gifSprite.height);
        gifSprite.scale.set(scale);
        gifSprite.x = (250 - gifSprite.width * scale) / 2;
        gifSprite.y = (200 - gifSprite.height * scale) / 2;

        app.stage.addChild(gifSprite);
      } catch (err) {
        console.error("Failed to load Pixi GIF:", err);
      }
    };

    initPixi();

    return () => {
      isMounted = false;
      if (gifSprite) {
        gifSprite.destroy();
      }
      if (appRef.current) {
        appRef.current.destroy({ removeView: true, children: true });
        appRef.current = null;
      }
    };
  }, [url]);

  return <div ref={containerRef} style={{ width: '100%', maxWidth: '250px', borderRadius: '10px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title={alt} />;
};

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

const defaultMatches = [
  { name: 'Stacy', age: 22, bio: "If you can't handle me at my worst, you don't deserve me at my slightly less worse 💅", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy" },
  { name: 'Becky', age: 24, bio: "Fluent in sarcasm. My love language is leaving you on read 💕", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Becky" },
  { name: 'Chad', age: 24, bio: "6'2 but my emotional maturity is 3'1. I'll reply in 3-5 business days 😎", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chad" },
  { name: 'Gary', age: 38, bio: "Just a simple guy who loves gym, protein shakes, and ignoring your texts 💪", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gary" },
  { name: 'Karen', age: 31, bio: "Looking for a man who's 6ft, earns 6 figures, and has 6 months to live so I get the house 🏠", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karen" }
];

const exMessages = [
  "i miss you. can we talk?",
  "i know i ruined everything but i still think about you",
  "you were literally the best thing that happened to me",
  "i shouldn't be texting you rn",
  "i still remember your coffee order for no reason",
  "i know you hate me but i miss you",
  "i wish we met later in life",
  "you still cross my mind at the worst times",
  "i just wanted to hear from you one more time"
];

const Chat = () => {
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [chatHistories, setChatHistories] = useState({});

  const [input, setInput] = useState('');
  const [typingStatus, setTypingStatus] = useState(false);
  const [mood, setMood] = useState('unstable');
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showExPopup, setShowExPopup] = useState('');
  const [showLovePopup, setShowLovePopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [language, setLanguage] = useState('english');
  const [showProfile, setShowProfile] = useState(false);
const [blockedMatches, setBlockedMatches] = useState({});
  // Tornado state
  const [flyingMessages, setFlyingMessages] = useState([]);
  // Heart Attack state
  const [heartAttackNotice, setHeartAttackNotice] = useState(null);
  const [showReelModal, setShowReelModal] = useState(false);
  const [activeReelMatch, setActiveReelMatch] = useState('Stacy');

  const [chatTheme, setChatTheme] = useState('dark'); // 'dark' or 'deep-white'
  const [showSafeBanner, setShowSafeBanner] = useState(false);
  const [currentReelVideoId, setCurrentReelVideoId] = useState('dQw4w9WgXcQ');
  // Fake RAM & Task Manager states
  const [fakeRam, setFakeRam] = useState(12); // starts at 12%
  const [showTaskManager, setShowTaskManager] = useState(false);

  // Homie Interruption state
  const [showHomieInterruption, setShowHomieInterruption] = useState(false);
  const [homieMessage, setHomieMessage] = useState('you folding over THIS??');

  // BSOD Rejection Crash State
  const [showBSOD, setShowBSOD] = useState(false);
  const [bsodPercentage, setBsodPercentage] = useState(0);

  // Dynamic visual non-hardcoded YouTube & Emoji reactions states
  const [showMediaSelector, setShowMediaSelector] = useState(null); // 'love_song' | 'funny_joke' | null
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [reactions, setReactions] = useState({}); // { messageId: ['❤️', '🤡'] }
  const [twitchChat, setTwitchChat] = useState([
    { id: 1, user: 'Sharma_Ji_Ki_Aunty', text: 'ye relation workout krega ya nhi... mujhe to doubt hai beta 💀', tagColor: '#a855f7' },
    { id: 2, user: 'Pammi_Aunty', text: 'he is not a good person fr, text speed is way too suspicious!', tagColor: '#ec4899' }
  ]);

  // Dodge the Red Flags bullet hell state variables
  const [bossActive, setBossActive] = useState(false);
  const [playerX, setPlayerX] = useState(150); // range 20 to 280
  const [bullets, setBullets] = useState([]);
  const [bossTimer, setBossTimer] = useState(5.0);
  const [pendingMessage, setPendingMessage] = useState(null);

  const [activeReactionTray, setActiveReactionTray] = useState(null);

  const addReaction = (msgId, emoji) => {
    setReactions(prev => {
      const current = prev[msgId] || [];
      if (current.includes(emoji)) {
        return { ...prev, [msgId]: current.filter(e => e !== emoji) };
      }
      return { ...prev, [msgId]: [...current, emoji] };
    });
  };

  const addTwitchComment = (text, type = 'user') => {
    const commentators = [
      'Sharma_Ji_Ki_Aunty', 'Pammi_Aunty', 'Gupta_Ji_Specials', 'Rishta_Expert_Sweety', 
      'RizzWarlock_Uncle', 'Dolly_Didi', 'Neighborhood_Eye', 'Chintu_Ke_Papa'
    ];
    const colors = ['#ec4899', '#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#84cc16'];
    
    let rizzReplies = [];

    if (language === 'hindi') {
      rizzReplies = [
        'use chodd de beta, acha ladka nahi hai 🚩',
        'ye relation workout krega ya nahi... mujhe to doubt hai 💀',
        'ye ladka acha nhi hai beta block krdo isko!',
        'Sharma Ji ki beti ko dekha hai? tum usse achi ho beta!',
        'chodd de ise beta, time waste hai!',
        'mohalle ki aunty is watching closely 👁️',
        'chutki me divorce ho jayega inka! 💀',
        'bohot kharab ladka hai, block krdo!'
      ];
    } else if (language === 'bengali') {
      rizzReplies = [
        'o bhalo chele noi, chere de ok beta! 🚩',
        'ei relation ta cholbe na, blocked kore de!',
        'cheleta ekdom bhalo noy, trust me 😭',
        'o bhalo chele noi, block kor beta!',
        'shotti bolchi, o bhalo chele noi!',
        'para’r lok shob dekhche beta, sorke jao!',
        'shotti, bhalo chele noi ekdom!'
      ];
    } else {
      // Default English
      rizzReplies = [
        'he is bad, sis block him! 🚩',
        'he is not a good person fr, block him!',
        'Stacy, he is so bad for you!',
        'this relation won\'t workout, trust me!',
        'she is way out of his league, fumbled hard 😭',
        'they will divorce in Year 5, saw it in the stars!',
        'he is not a good person, trust me!',
        'L RIZZ, block him Stacy!',
        'BRO STOP TYPING 🛑',
        'THIS IS HARD TO WATCH 😭',
        'SHE LOST INTEREST 4 MESSAGES AGO 💀',
        'BRO FUMBLED SO HARD IN REAL TIME'
      ];
    }

    if (type === 'media') {
      if (language === 'hindi') {
        rizzReplies = [
          '🎵 YouTube video share kiya? ye relation workout krega ya nhi?',
          'dekho kaise gaane bhej rha hai, kharab ladka hai beta!',
          'lofi track bhej ke fasa rha hai, chodd de ise!'
        ];
      } else if (language === 'bengali') {
        rizzReplies = [
          '🎵 YouTube video pathacche? o bhalo chele noi!',
          'গান পাঠিয়ে পটাতে চাইছে! ছেড়ে দে ওকে!',
          'ekdom bhalo chele noy, gaan share korche boka banate!'
        ];
      } else {
        rizzReplies = [
          '🎵 YouTube video sent! visual media share is valid or not?',
          'Look at that song choice, absolute red flag activity!',
          'he is not a good person fr, using jokes to hide issues!'
        ];
      }
    } else if (text.length > 25) {
      if (language === 'hindi') {
        rizzReplies = [
          'itne lambe text wall?? ye ladka acha nhi hai beta block krdo!',
          'pura essay likh rha hai, timepass hai beta chodd de!'
        ];
      } else if (language === 'bengali') {
        rizzReplies = [
          'eto boro paragraph likhche? o bhalo chele noi beta!',
          'chere de ok, boka banacche boro text likhe!'
        ];
      } else {
        rizzReplies = [
          'itne lambe text wall?? he is bad for you, too desperate!',
          'mohalle ke log are extremely disappointed in this paragraph!'
        ];
      }
    } else if (text.toLowerCase().includes('rizz') || text.toLowerCase().includes('love')) {
      if (language === 'hindi') {
        rizzReplies = [
          'love songs sharing already?? ye relation workout krega ya nhi?',
          'He is trying to act sweet, classic trap!',
          'AWWW THAT WAS ACTUALLY KINDA SWEET BUT STAY CAUTIOUS'
        ];
      } else if (language === 'bengali') {
        rizzReplies = [
          'prem korche gaan share kore! o bhalo chele noi beta!',
          'mihti kotha bolche, trap a poro na beta!'
        ];
      } else {
        rizzReplies = [
          'love songs sharing already?? ye relation workout krega ya nhi?',
          'He is trying to act sweet, classic trap!',
          'AWWW THAT WAS ACTUALLY KINDA SWEET BUT STAY CAUTIOUS'
        ];
      }
    }

    const comment = {
      id: Date.now() + Math.random(),
      user: commentators[Math.floor(Math.random() * commentators.length)],
      text: rizzReplies[Math.floor(Math.random() * rizzReplies.length)],
      tagColor: colors[Math.floor(Math.random() * colors.length)]
    };

    setTwitchChat(prev => [...prev.slice(-30), comment]); // keep last 30
  };

  const triggerDeepWhite = () => {
    // Disabled theme flashing to keep theme color like previous
  };

  const getYoutubeId = (urlOrText) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrText.match(regExp);
    return (match && match[2].length === 11) ? match[2] : 'dQw4w9WgXcQ';
  };

  const sendMediaMessage = (type, videoId, videoTitle, customText) => {
    if (!activeMatch) return;
    
    let prefix = '🎵 [LOVE_SONG]';
    if (type === 'funny_joke') {
      prefix = '😂 [FUNNY_JOKE]';
    } else if (type === 'custom') {
      prefix = '📹 [CUSTOM_YOUTUBE]';
    }

    const embedTitle = videoTitle || 'Custom Video Share';
    const desc = customText || 'Real-time media shared in session';
    const text = `${prefix} ${embedTitle}: ${desc} https://www.youtube.com/watch?v=${videoId}`;

    const newMsg = {
      id: Date.now() + Math.random(),
      text,
      sender: 'me',
      time: 'Just now'
    };

    setChatHistories(prev => ({
      ...prev,
      [activeMatch.name]: [...(prev[activeMatch.name] || []), newMsg]
    }));

    addTwitchComment(text, 'media');

    setShowMediaSelector(null);
    setCustomYoutubeUrl('');

    // Trigger match response
    setTimeout(() => {
      let replyText = '';
      if (type === 'love_song') {
        replyText = `💖 OMG! "${embedTitle}" is literally my absolute favorite love track! How did you know?? 🥰`;
      } else if (type === 'funny_joke') {
        replyText = `😂 LMAOO stop that joke compilation was actually so hilarious! I'm laughing so hard right now.`;
      } else {
        replyText = `🤩 Woah! This custom YouTube link is extremely cool! Thanks for sharing this video with me, you are awesome!`;
      }

      const matchReply = {
        id: Date.now() + Math.random(),
        text: replyText,
        sender: 'them',
        time: 'Just now'
      };

      setChatHistories(prev => ({
        ...prev,
        [activeMatch.name]: [...(prev[activeMatch.name] || []), matchReply]
      }));
      
      toast.success(`🥰 ${activeMatch.name} loved your shared video!`);
    }, 2000);
  };

  const chatEndRef = useRef(null);

  // Sound Synthesizers
  const playWindSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.7);
      filter.frequency.exponentialRampToValueAtTime(100, now + 1.5);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 1.5);
    } catch (e) {
      console.error(e);
    }
  };

  const playCatchSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error(e);
    }
  };

  const playWindDissolveSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(7000, now + 0.4);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.5);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerBSOD = () => {
    setShowBSOD(true);
    setBsodPercentage(0);
    const interval = setInterval(() => {
      setBsodPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 200);
  };

  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(980, now + i * 0.25);
        osc.frequency.setValueAtTime(800, now + i * 0.25 + 0.08);
        
        gain.gain.setValueAtTime(0.3, now + i * 0.25);
        gain.gain.setValueAtTime(0.3, now + i * 0.25 + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.25);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Setup matches list and unique histories
  useEffect(() => {
    let list = [...defaultMatches];
    const stored = localStorage.getItem('matchedProfile');
    if (stored) {
      const profile = JSON.parse(stored);
      list = list.filter(m => m.name !== profile.name);
      list.unshift(profile);
    }
    setMatches(list);
    setActiveMatch(list[0]);

    // Get current user custom profile
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { name: 'Dan', bio: 'Just swiping to feel something.' };

    // Build initial threads with personalized greetings!
    const histories = {};
    list.forEach(m => {
      histories[m.name] = [
        { id: 1, text: `Hey ${userProfile.name}! I saw your bio ("${userProfile.bio}"). That is... a lot of issues, but I'm ${m.name} and I think we can match anyway! 😂`, sender: 'them', time: 'Just now' }
      ];
    });
    setChatHistories(histories);
  }, []);

  // Socket triggers
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      if (!activeMatch) return;
      triggerDeepWhite();
      setChatHistories(prev => ({
        ...prev,
        [activeMatch.name]: [...(prev[activeMatch.name] || []), msg]
      }));
    });

    socket.on('typing', (data) => {
      setTypingStatus(data.status);
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
  }, [activeMatch]);

  // Tornado physics update loop
  useEffect(() => {
    const loop = setInterval(() => {
      const now = Date.now();
      setFlyingMessages(prev => {
        const updated = prev.map(m => {
          let newRadius = m.radius - 1.2; // pull closer to center slower
          if (newRadius < 40) {
            newRadius = 500; // loop back to outer edge if not caught
          }
          return {
            ...m,
            angle: m.angle + m.speed,
            radius: newRadius,
            scale: 0.4 + (newRadius / 500) * 0.6
          };
        });

        // Filter out expired (10 seconds limit)
        const expired = updated.filter(m => now - m.createdAt >= 10000);
        if (expired.length > 0) {
          expired.forEach(m => {
            playWindDissolveSound();

            // Each unread message eats fake RAM
            setFakeRam(prev => {
              const next = Math.min(100, prev + 15);
              if (next >= 75) {
                setShowTaskManager(true);
              }
              return next;
            });
            
            // If the user is currently chatting with someone, leak the message into the active chat log!
            if (activeMatch) {
              const leakedText = `🚨 [TORNADO LEAK] ${m.senderName}: "${m.text}"`;
              const leakedMsg = {
                id: Date.now() + Math.random(),
                text: leakedText,
                sender: 'them',
                time: 'Just now'
              };
              
              setChatHistories(prevHistory => ({
                ...prevHistory,
                [activeMatch.name]: [...(prevHistory[activeMatch.name] || []), leakedMsg]
              }));

              // Trigger the deep-white theme since Chad/Becky's text leaked into active chat!
              triggerDeepWhite();

              // The active partner blocks you for receiving texts from other matches!
              const partnerToBlock = activeMatch.name;
              setTimeout(() => {
                setBlockedMatches(prev => ({ ...prev, [partnerToBlock]: true }));
                toast.error(`❌ BLOCKED: ${partnerToBlock} blocked you because she saw you receiving messages from other people!`);
                
                // Trigger the FULL fake Blue Screen of Rejection crash!
                setTimeout(() => {
                  triggerBSOD();
                }, 1500);
              }, 1500);

              toast.error(
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>🚨 TORNADO LEAK!</span>
                  <span>You failed to catch ${m.senderName}'s message! It got sucked into your active chat with ${activeMatch.name}!</span>
                </div>,
                { autoClose: 6000 }
              );
            } else {
              toast.error(`💨 GONE! ${m.senderName}'s message blew away in the tornado!`);
            }
          });
        }

        return updated.filter(m => now - m.createdAt < 10000);
      });
    }, 30);

    return () => clearInterval(loop);
  }, [activeMatch]);

  // Background flying messages simulator - comes once every 15 seconds (15000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      triggerTornadoMessage();
    }, 15000);

    return () => clearInterval(timer);
  }, [matches, activeMatch]);

  // Heart Attack alarm simulator - comes automatically after 15 seconds (15000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      triggerHeartAttack();
    }, 15000);

    return () => clearInterval(timer);
  }, [matches]);

  // Fake Voice Note trap simulator - comes automatically after 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      triggerFakeVoiceNote();
    }, 20000);

    return () => clearInterval(timer);
  }, [matches, activeMatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistories, typingStatus, activeMatch]);

  const triggerFakeVoiceNote = () => {
    if (!activeMatch) return;
    
    // Don't send multiple to the same person
    if (chatHistories[activeMatch.name]?.some(m => m.text.includes('[VOICE_NOTE]'))) return;

    const names = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Chris', 'Riley'];
    const fakeName = names[Math.floor(Math.random() * names.length)];

    const voiceMsg = {
      id: Date.now() + Math.random(),
      text: `🎤 [VOICE_NOTE] ${fakeName}`,
      sender: 'them',
      time: 'Just now'
    };

    setChatHistories(prev => ({
      ...prev,
      [activeMatch.name]: [...(prev[activeMatch.name] || []), voiceMsg]
    }));
  };

  const triggerTornadoMessage = () => {
    if (matches.length <= 1) return;
    const inactive = matches.filter(m => activeMatch ? m.name !== activeMatch.name : true);
    if (inactive.length === 0) return;
    const sender = inactive[Math.floor(Math.random() * inactive.length)];

    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || { name: 'Dan', bio: 'Just swiping to feel something.' };

    const funnyTexts = [
      `Hey ${userProfile.name}, reply right now! 😤`,
      "are you texting Becky??",
      `i saw you online ${userProfile.name}...`,
      "reply within 10s or you're blocked.",
      "are you awake? 🙈",
      `hey ${userProfile.name}, why ignore me?`,
      "did you fall in a well? 💀",
      `Is it true your red flag is "${userProfile.bio.substring(0, 25)}..."? LMAO.`
    ];

    const text = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
    const newFlying = {
      id: Date.now() + Math.random(),
      text,
      senderName: sender.name,
      senderImg: sender.img,
      angle: Math.random() * Math.PI * 2,
      radius: 450 + Math.random() * 150,
      speed: 0.012 + Math.random() * 0.008, // slower swirl
      yOffset: Math.random() * 300 - 150,
      scale: 1,
      createdAt: Date.now()
    };

    playWindSound();
    triggerDeepWhite();
    setFlyingMessages(prev => [...prev, newFlying]);
  };

  // Dodge the Red Flags game loop engine
  useEffect(() => {
    if (!bossActive) return;

    let spawnInterval = setInterval(() => {
      const symbols = ['🚩', '💔', '⚠️', '💩'];
      const newBullet = {
        id: Date.now() + Math.random(),
        x: Math.random() * 260 + 20, // keep within container bounds
        y: 0,
        speed: Math.random() * 4 + 3.5,
        symbol: symbols[Math.floor(Math.random() * symbols.length)]
      };
      setBullets(prev => [...prev, newBullet]);
    }, 380);

    let gameInterval = setInterval(() => {
      // Update bullets
      setBullets(prev => {
        const moved = prev.map(b => ({ ...b, y: b.y + b.speed }));
        // Collision check
        const hit = moved.some(b => b.y >= 240 && b.y <= 275 && Math.abs(b.x - playerX) < 22);
        if (hit) {
          toast.error("💥 TOXIC COLLISION! You hit a red flag! Reseting timer...");
          setBossTimer(5.0);
          return [];
        }
        return moved.filter(b => b.y < 310);
      });

      // Decrease timer
      setBossTimer(prev => {
        const next = Math.max(0, prev - 0.05);
        if (next <= 0) {
          clearInterval(spawnInterval);
          clearInterval(gameInterval);
          setBossActive(false);
          
          if (pendingMessage) {
            setChatHistories(prevHist => ({
              ...prevHist,
              [activeMatch.name]: [...(prevHist[activeMatch.name] || []), pendingMessage]
            }));
            socket.emit('sendMessage', { text: pendingMessage.text, language });
            addTwitchComment(pendingMessage.text, 'user');
            
            // Random ex-spams
            const randomExMessage = exMessages[Math.floor(Math.random() * exMessages.length)];
            setShowExPopup(randomExMessage);
            setTimeout(() => setShowExPopup(''), 4000);
          }
          
          toast.success("🏆 TOXICITY SURVIVED! Message delivered safely!");
        }
        return next;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(gameInterval);
    };
  }, [bossActive, playerX, pendingMessage]);

  const triggerHeartAttack = () => {
    if (matches.length === 0) return;
    const sender = matches[Math.floor(Math.random() * matches.length)];
    setActiveReelMatch(sender.name);

    // Dynamic clean non-hardcoded viral video pool completely free of sheryians
    const viralVideoIds = [
      'jfKfPfyJRdk', // Lofi Girl study beats lofi
      'y6120QOlsfU', // Sandstorm lofi
      '9bZkp7q19f0', // Gangnam style cover
      'dQw4w9WgXcQ', // Rickroll timeless joke
      'QH2-TGUlwu4', // Nyan cat silly clip
      'J---aiyznGQ'  // Keyboard cat classic
    ];
    const pool = viralVideoIds.filter(id => id !== currentReelVideoId);
    const nextId = pool[Math.floor(Math.random() * pool.length)];
    setCurrentReelVideoId(nextId);

    playAlarmSound();
    setHeartAttackNotice(`🚨 they replied! ${sender.name} sent you a message! CLICK TO SECURE.`);
    setTimeout(() => {
      setHeartAttackNotice(null);
    }, 8000);
  };

  const catchMessage = (m) => {
    playCatchSound();
    const newMsg = {
      id: Date.now(),
      text: m.text,
      sender: 'them',
      time: 'Just now'
    };

    setChatHistories(prev => ({
      ...prev,
      [m.senderName]: [...(prev[m.senderName] || []), newMsg]
    }));

    // Find target profile and instantly switch active thread
    const targetMatch = matches.find(match => match.name === m.senderName);
    if (targetMatch) {
      setActiveMatch(targetMatch);
    }

    // Dynamic clean up: Clear all tornado elements instantly!
    setFlyingMessages([]);

    // Show matrix green secure safe banner
    setShowSafeBanner(true);
    setTimeout(() => {
      setShowSafeBanner(false);
    }, 4000);

    toast.success(`🎉 CAUGHT IT! Switched to chat with ${m.senderName}!`);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeMatch) return;

    // Reset to Dark mode when replying!
    setChatTheme('dark');

    // Trigger Homie Interruption on emotional messages or 35% chance randomly
    const emotionalKeywords = ['love', 'like', 'miss', 'pyar', 'pyaar', 'sweet', 'heart', 'favorite', 'fav', 'caring', 'dil', 'match'];
    const isEmotional = emotionalKeywords.some(w => input.toLowerCase().includes(w)) || Math.random() < 0.35;
    if (isEmotional) {
      const homiePhrases = [
        "you folding over THIS?? 💀",
        "bro stand up! don't fold so easily!",
        "is this the master rizzler? looks like folding fr 😭",
        "bro she lost interest 4 messages ago, stand proud! 🚩",
        "don't fold under pressure bro!"
      ];
      setHomieMessage(homiePhrases[Math.floor(Math.random() * homiePhrases.length)]);
      setShowHomieInterruption(true);
    }

    const newMsg = { id: Date.now() + Math.random(), text: input, sender: 'me', time: 'Just now' };
    
    // Intercept with the Red Flag Boss Battle
    setPendingMessage(newMsg);
    setBossTimer(5.0);
    setBullets([]);
    setBossActive(true);
    setInput('');
  };

  const handleDoubleTap = () => {
     setShowScreenshotWarning(true);
     setTimeout(() => setShowScreenshotWarning(false), 3000);
  };

  const getCompetitorPronoun = () => {
    const gender = localStorage.getItem('userGender') || 'boy';
    return gender === 'boy' ? 'she' : 'he';
  };

  let themeColor = 'var(--accent-pink)';
  let bgOverlay = 'transparent';
  if (mood === 'distanced') {
     themeColor = '#555';
     bgOverlay = 'rgba(0,0,0,0.5)';
  } else if (mood === 'annoyed') {
     themeColor = '#ff3333';
  }

  const activeMessages = activeMatch ? (chatHistories[activeMatch.name] || []) : [];

  return (
    <div className="chat-screen" onDoubleClick={handleDoubleTap} style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#050505',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Mood Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: bgOverlay, pointerEvents: 'none', transition: 'background 1s' }} />

      {/* Main Row: Matches Sidebar + Active chat panel */}
      <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', zIndex: 10 }}>
        
        {/* Left Sidebar Matches panel */}
        <div style={{
          width: '280px',
          background: 'rgba(10, 10, 10, 0.98)',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔥 Matches
            </h2>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '2px' }}>Click to select. Ignore at your own peril.</p>
            
            {/* Glowing RAM Telemetry Meter */}
            <div 
              onClick={() => setShowTaskManager(true)}
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                fontSize: '0.7rem'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 'bold', color: fakeRam >= 75 ? '#ff4d4d' : 'var(--text-dim)' }}>
                <span>💾 Emotional RAM</span>
                <span>{fakeRam > 0 ? `${fakeRam}%` : ''}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${fakeRam}%`, height: '100%', background: fakeRam >= 75 ? 'linear-gradient(90deg, #ef4444, #b91c1c)' : 'linear-gradient(90deg, #ff2d55, #ffcc00)', transition: 'width 0.4s ease' }} />
              </div>
              {fakeRam >= 75 && (
                <div style={{ color: '#ff4d4d', fontSize: '0.55rem', fontWeight: 'bold', marginTop: '4px', animation: 'pulse 1s infinite' }}>
                  ⚠️ DANGER: MEMORY OVERFLOW! CLICK TO END PROCESS!
                </div>
              )}
            </div>
          </div>


          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {matches.map(m => {
              const active = activeMatch && activeMatch.name === m.name;
              return (
                <div 
                  key={m.name} 
                  onClick={() => {
                    setActiveMatch(m);
                    toast.info(`Switched chat to ${m.name}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px 20px',
                    cursor: 'pointer',
                    background: active ? 'rgba(255, 45, 85, 0.12)' : 'transparent',
                    borderLeft: active ? '3px solid var(--accent-pink)' : '3px solid transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.2s'
                  }}
                >
                  <img src={m.img} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} alt={m.name} />
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', color: active ? 'white' : 'var(--text-dim)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{m.name}</span>
                      {blockedMatches[m.name] && <span style={{ color: 'var(--accent-pink)', fontSize: '0.65rem', fontWeight: 'bold' }}>🚫 Blocked</span>}
                    </h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{m.bio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Panel */}
        {activeMatch ? (
          <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
            
            {/* Main Active Chat Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
              
              {/* Dodge the Red Flags Bullet-Hell Boss Battle Overlay */}
              {bossActive && (
                <div 
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setPlayerX(Math.min(270, Math.max(20, x)));
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(5, 5, 5, 0.98)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    userSelect: 'none',
                    cursor: 'crosshair'
                  }}
                >
                  <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: '#ff4b4b', border: '1.5px solid #ff4b4b', padding: '4px 8px', borderRadius: '4px', letterSpacing: '2px', fontWeight: 'bold' }}>
                    🚨 TOXIC BOSS BATTLE DETECTED!
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white', marginTop: '15px', marginBottom: '4px' }}>
                    Dodge the Red Flags
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#aaa', margin: '0 0 20px', textAlign: 'center', maxWidth: '340px' }}>
                    Move your cursor Left/Right inside this window to dodge falling red flags! Survive for 5 seconds to deliver your message.
                  </p>

                  {/* retro game board canvas */}
                  <div 
                    style={{
                      position: 'relative',
                      width: '300px',
                      height: '300px',
                      background: '#09090b',
                      border: '2px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'crosshair'
                    }}
                  >
                    {/* falling bullet red flags */}
                    {bullets.map(b => (
                      <motion.div
                        key={b.id}
                        style={{
                          position: 'absolute',
                          left: `${b.x}px`,
                          top: `${b.y}px`,
                          fontSize: '1.4rem',
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'none'
                        }}
                      >
                        {b.symbol}
                      </motion.div>
                    ))}

                    {/* Player Heart */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        left: `${playerX}px`,
                        top: '265px',
                        fontSize: '1.7rem',
                        transform: 'translate(-50%, -50%)',
                        filter: 'drop-shadow(0 0 8px #ef4444)'
                      }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                      💖
                    </motion.div>

                    {/* Game overlay indicator timer */}
                    <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: '#ffcc00', fontWeight: 'bold' }}>
                      ⌛ {bossTimer.toFixed(1)}s
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Controls: Move Cursor Left & Right
                  </div>
                </div>
              )}
            
            {/* Header */}
            <div className="glass" style={{ padding: '20px', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, borderColor: themeColor }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
                <img src={activeMatch.img} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: `2px solid ${themeColor}` }} alt={activeMatch.name} />
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'white' }}>{activeMatch.name}{activeMatch.age ? `, ${activeMatch.age}` : ''}</h3>
                  {activeMatch.bio && <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeMatch.bio}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', position: 'relative', alignItems: 'center' }}>
                  <button 
                    onClick={() => {
                      toast.error("📹 Call declined! They saw you through the front camera and panicked.");
                      setChatHistories(prev => ({
                        ...prev,
                        [activeMatch.name]: [...(prev[activeMatch.name] || []), { id: Date.now(), text: "📹 Missed video call. Please never do that again.", sender: 'them', time: 'Just now' }]
                      }));
                    }} 
                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}
                    title="Video Call"
                  >
                    📹
                  </button>
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
                            onClick={() => { 
                              setLanguage(lang); 
                              setShowMenu(false); 
                              toast(`🌐 Language changed to ${lang.charAt(0).toUpperCase() + lang.slice(1)}`);
                              
                              if (lang === 'hindi') {
                                setTwitchChat([
                                  { id: 1, user: 'Sharma_Ji_Ki_Aunty', text: 'use chodd de beta, acha ladka nahi hai 🚩', tagColor: '#a855f7' },
                                  { id: 2, user: 'Pammi_Aunty', text: 'ye relation workout krega ya nahi... mujhe to doubt hai 💀', tagColor: '#ec4899' }
                                ]);
                              } else if (lang === 'bengali') {
                                setTwitchChat([
                                  { id: 1, user: 'Sharma_Ji_Ki_Aunty', text: 'o bhalo chele noi, chere de ok beta! 🚩', tagColor: '#a855f7' },
                                  { id: 2, user: 'Pammi_Aunty', text: 'ei relation ta cholbe na, blocked kore de!', tagColor: '#ec4899' }
                                ]);
                              } else {
                                setTwitchChat([
                                  { id: 1, user: 'Sharma_Ji_Ki_Aunty', text: 'he is bad, sis block him! 🚩', tagColor: '#a855f7' },
                                  { id: 2, user: 'Pammi_Aunty', text: 'he is not a good person fr, look at that text speed!', tagColor: '#ec4899' }
                                ]);
                              }
                            }}
                            style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span>{lang === 'english' ? '🇬🇧 English' : lang === 'bengali' ? '🇮🇳 বাংলা (Bengali)' : '🇮🇳 हिन्दी (Hindi)'}</span>
                            {language === lang && <span style={{ color: 'var(--accent-pink)' }}>✓</span>}
                          </div>
                        ))}
                        <div style={{ margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                        <div 
                          onClick={() => {
                            setShowMenu(false);
                            toast.error(`💔 Unmatched and blocked by ${activeMatch.name}!`);
                            setTimeout(() => {
                              triggerBSOD();
                            }, 1000);
                          }}
                          style={{ padding: '10px 15px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: '#ff4d4d', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span>💔 Unmatch & Block</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            </div>

            {/* Competitor Banner warning */}
            <div style={{ 
              background: 'rgba(255, 204, 0, 0.1)', 
              borderBottom: '1px solid rgba(255, 204, 0, 0.2)', 
              padding: '10px', 
              textAlign: 'center', 
              fontSize: '0.75rem', 
              color: '#ffcc00', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              zIndex: 10,
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
               ⚠️ Warning: 12 other users are actively sending messages to {activeMatch.name} right now. Speed counts!
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeMessages.map((m) => {
                const isLoveSong = m.text.includes('[LOVE_SONG]');
                const isFunnyJoke = m.text.includes('[FUNNY_JOKE]');
                const isCustomYoutube = m.text.includes('[CUSTOM_YOUTUBE]');
                const isSpecial = isLoveSong || isFunnyJoke || isCustomYoutube;

                // Reaction Tray Sub-Component helper
                const renderReactionDrawer = (msgId, isMyMsg) => {
                  const isTrayOpen = activeReactionTray === msgId;
                  return (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-26px',
                        right: isMyMsg ? '10px' : 'auto',
                        left: isMyMsg ? 'auto' : '10px',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setActiveReactionTray(isTrayOpen ? null : msgId); }}
                        style={{
                          background: 'rgba(0,0,0,0.75)',
                          border: '1.5px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.8,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          padding: 0
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                      >
                        😊
                      </button>

                      <AnimatePresence>
                        {isTrayOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                              background: 'rgba(15, 10, 10, 0.98)',
                              border: '1.5px solid var(--accent-pink)',
                              borderRadius: '20px',
                              padding: '5px 10px',
                              display: 'flex',
                              gap: '9px',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
                            }}
                          >
                            {['❤️', '😂', '😭', '💀', '🤡', '💩'].map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addReaction(msgId, emoji); setActiveReactionTray(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.15rem', padding: 0, transition: 'transform 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.35)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                };

                const isVoiceNote = m.text.includes('[VOICE_NOTE]');
                if (isVoiceNote) {
                  const wrongName = m.text.split(' ')[2] || 'Alex';
                  return (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', margin: '14px 0' }}>
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '20px 20px 20px 0',
                          background: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <button 
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(`I love you, ${wrongName}`);
                            // Pitch variation for fun
                            utterance.pitch = Math.random() * 0.5 + 0.8;
                            window.speechSynthesis.speak(utterance);
                            toast.error(`Wait... who is ${wrongName}?! 💀`);
                            
                            // Delete it after 3 seconds
                            setTimeout(() => {
                              setChatHistories(prev => {
                                const current = prev[activeMatch.name] || [];
                                return { ...prev, [activeMatch.name]: current.filter(msg => msg.id !== m.id) };
                              });
                              
                              // Send apology
                              const oopsMsg = {
                                id: Date.now(),
                                text: "OMG sorry wrong chat!! That was by mistake 😭 please ignore",
                                sender: 'them',
                                time: 'Just now'
                              };
                              setChatHistories(prev => ({
                                ...prev,
                                [activeMatch.name]: [...(prev[activeMatch.name] || []), oopsMsg]
                              }));
                            }, 3000);
                          }}
                          style={{
                            background: 'var(--accent-pink)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            fontSize: '1.2rem'
                          }}
                        >
                          ▶️
                        </button>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Voice Message</div>
                          <div style={{ fontSize: '0.7rem', color: '#888' }}>0:02</div>
                        </div>
                      </motion.div>
                    </div>
                  );
                }

                if (isSpecial) {
                  let cardBg = 'linear-gradient(135deg, rgba(255, 45, 85, 0.25), rgba(255, 100, 130, 0.1))';
                  let cardBorder = '1px solid rgba(255, 45, 85, 0.4)';
                  let cardTitle = '🎵 Current Love Song';
                  
                  if (isFunnyJoke) {
                    cardBg = 'linear-gradient(135deg, rgba(255, 204, 0, 0.25), rgba(255, 150, 0, 0.1))';
                    cardBorder = '1px solid rgba(255, 204, 0, 0.4)';
                    cardTitle = '😂 Funny Joke';
                  } else if (isCustomYoutube) {
                    cardBg = 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(10, 20, 40, 0.9))';
                    cardBorder = '1px solid rgba(56, 189, 248, 0.4)';
                    cardTitle = '📹 Custom Video Share';
                  }

                  // Strip prefixes and url from presentation text
                  const displayLabel = m.text
                    .replace(/^[🎵😂💻📹]\s*\[[A-Z_]+\]\s*/, '')
                    .split(' https://')[0]
                    .split(' http://')[0];

                  const msgReactions = reactions[m.id] || [];

                  return (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', position: 'relative', margin: '14px 0' }}>
                      {renderReactionDrawer(m.id, m.sender === 'me')}

                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{
                          maxWidth: '85%',
                          padding: '16px 20px',
                          borderRadius: '20px',
                          background: cardBg,
                          border: cardBorder,
                          position: 'relative',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          width: '320px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.9)' }}>
                            {cardTitle}
                          </span>
                          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)' }}>
                            {m.time}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'white', lineHeight: '1.4', margin: '0 0 12px' }}>
                          {displayLabel}
                        </p>
                        
                        {/* Embedded Youtube player with autoplay constraints bypassed */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYoutubeId(m.text)}?autoplay=0&mute=0`}
                            style={{ border: 'none', position: 'absolute', inset: 0 }}
                            title="Media Card Player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        {/* Interactive Like/Love Button for shared songs/jokes */}
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addReaction(m.id, '❤️');
                              toast.success(`🥰 ${activeMatch.name} loved the video card and liked it back!`);
                              
                              setTimeout(() => {
                                const responseTexts = {
                                  song: [
                                    "OMG I ABSOLUTELY LOVE THIS SONG! How did you know?? 😭💖",
                                    "Wait, this track is so beautiful! Added to my playlist immediately!",
                                    "AWW you are so sweet for sharing this! ❤️"
                                  ],
                                  joke: [
                                    "HAHAHA stop making me laugh, I'm trying to look mad! 😂",
                                    "OMG that screams my humor LMAO! 😭",
                                    "Actually funny! W RIZZ card played successfully."
                                  ],
                                  custom: [
                                    "Whoa this video is actually so interesting! Thanks for sharing!",
                                    "Wait, I've seen this before! Incredible taste 🤯",
                                    "Love it! That's a solid 10/10 video shared."
                                  ]
                                };
                                
                                let pool = responseTexts.custom;
                                if (isLoveSong) pool = responseTexts.song;
                                if (isFunnyJoke) pool = responseTexts.joke;
                                
                                const replyText = pool[Math.floor(Math.random() * pool.length)];
                                const matchReply = {
                                  id: Date.now() + Math.random(),
                                  text: replyText,
                                  sender: 'them',
                                  time: 'Just now'
                                };
                                
                                setChatHistories(prev => ({
                                  ...prev,
                                  [activeMatch.name]: [...(prev[activeMatch.name] || []), matchReply]
                                }));

                                addReaction(m.id, '❤️');
                              }, 1200);
                            }}
                            style={{
                              background: msgReactions.includes('❤️') ? 'rgba(255, 45, 85, 0.2)' : 'rgba(255,255,255,0.06)',
                              border: msgReactions.includes('❤️') ? '1px solid rgba(255, 45, 85, 0.6)' : '1px solid rgba(255,255,255,0.15)',
                              color: msgReactions.includes('❤️') ? '#ff2d55' : 'white',
                              borderRadius: '20px',
                              padding: '6px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span>❤️</span>
                            <span>{msgReactions.includes('❤️') ? 'Loved by Both!' : 'Like Video'}</span>
                          </button>
                        </div>
                      </motion.div>

                      {/* Active Badges Corner Overlay */}
                      {msgReactions.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-12px',
                          right: m.sender === 'me' ? '12px' : 'auto',
                          left: m.sender === 'me' ? 'auto' : '12px',
                          display: 'flex',
                          gap: '3px',
                          background: 'rgba(0,0,0,0.85)',
                          border: '1.5px solid rgba(255,255,255,0.25)',
                          borderRadius: '14px',
                          padding: '3px 8px',
                          zIndex: 20,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                        }}>
                          {msgReactions.map((emoji, idx) => (
                            <motion.span 
                              key={idx}
                              animate={{ y: [0, -3, 0] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.15 }}
                              style={{ fontSize: '0.85rem' }}
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const msgReactions = reactions[m.id] || [];

                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', position: 'relative', margin: '14px 0' }}>
                    {renderReactionDrawer(m.id, m.sender === 'me')}

                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      style={{
                        maxWidth: '100%',
                        padding: '12px 18px',
                        borderRadius: m.sender === 'me' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                        background: m.sender === 'me' ? themeColor : 'var(--glass-bg)',
                        border: m.sender === 'me' ? 'none' : '1px solid var(--glass-border)',
                        position: 'relative'
                      }}
                    >
                      {m.gifUrl ? (
                        <div style={{ marginTop: '5px' }}>
                          <PixiGif url={m.gifUrl} alt="GIF" />
                          <p style={{ fontSize: '0.75rem', fontStyle: 'italic', margin: '5px 0 0', opacity: 0.8 }}>{m.text}</p>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>{m.text}</p>
                      )}
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '5px', textAlign: 'right' }}>
                        {m.time}
                      </span>
                    </motion.div>

                    {/* Active Badges Corner Overlay */}
                    {msgReactions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-12px',
                        right: m.sender === 'me' ? '12px' : 'auto',
                        left: m.sender === 'me' ? 'auto' : '12px',
                        display: 'flex',
                        gap: '3px',
                        background: 'rgba(0,0,0,0.85)',
                        border: '1.5px solid rgba(255,255,255,0.25)',
                        borderRadius: '14px',
                        padding: '3px 8px',
                        zIndex: 20,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                      }}>
                        {msgReactions.map((emoji, idx) => (
                          <motion.span 
                            key={idx}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.15 }}
                            style={{ fontSize: '0.85rem' }}
                          >
                            {emoji}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {!blockedMatches[activeMatch.name] && (typingStatus || input.trim().length > 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    alignSelf: 'flex-start', 
                    background: 'rgba(255, 45, 85, 0.1)', 
                    padding: '12px 20px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    color: 'var(--accent-pink)',
                    border: '1px solid rgba(255, 45, 85, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    maxWidth: '90%'
                  }}
                >
                  <motion.span 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--accent-pink)',
                      boxShadow: '0 0 8px var(--accent-pink)',
                      display: 'inline-block'
                    }} 
                  />
                  <span>
                    {input.trim().length > 0 
                      ? `${activeMatch.name} is typing... (${getCompetitorPronoun()} is also actively chatting with 12 other people)`
                      : `${typingStatus}...`
                    }
                  </span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Dynamic visual non-hardcoded YouTube Drawer */}
            {showMediaSelector && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="glass"
                style={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '20px',
                  right: '20px',
                  padding: '20px',
                  zIndex: 2000,
                  border: '2.5px solid var(--accent-pink)',
                  background: 'rgba(10, 5, 5, 0.98)',
                  boxShadow: '0 8px 32px rgba(255, 45, 85, 0.25)',
                  borderRadius: '20px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, color: 'var(--accent-pink)', fontSize: '1rem', fontWeight: 'bold' }}>
                    {showMediaSelector === 'love_song' ? '🎵 Select a Romantic Love Song' : showMediaSelector === 'funny_joke' ? '😂 Select a Hilarious Joke' : '📹 Paste Custom YouTube Link'}
                  </h4>
                  <button 
                    onClick={() => { setShowMediaSelector(null); setCustomYoutubeUrl(''); }} 
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {showMediaSelector === 'love_song' && [
                    { id: 'jfKfPfyJRdk', title: 'Lofi Girl Coffee Beats (Lofi)', desc: 'Relaxing ambient study study beats' },
                    { id: 'y6120QOlsfU', title: 'Sandstorm (Sunset Lofi Edition)', desc: 'Chill acoustic sunset melody' },
                    { id: '9bZkp7q19f0', title: 'Gangnam Style (Acoustic Cover)', desc: 'Rhythmic cinematic acoustic cover' }
                  ].map(v => (
                    <div 
                      key={v.id}
                      onClick={() => sendMediaMessage('love_song', v.id, v.title, v.desc)}
                      style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 45, 85, 0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{v.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{v.desc}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-pink)' }}>Select →</span>
                    </div>
                  ))}

                  {showMediaSelector === 'funny_joke' && [
                    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', desc: 'The ultimate timeless internet meme joke' },
                    { id: 'QH2-TGUlwu4', title: 'Nyan Cat Official Clip', desc: 'Silly retro poptart cat space adventure' },
                    { id: 'J---aiyznGQ', title: 'Keyboard Cat Solo Clip', desc: 'Retro keyboard playing cat master' }
                  ].map(v => (
                    <div 
                      key={v.id}
                      onClick={() => sendMediaMessage('funny_joke', v.id, v.title, v.desc)}
                      style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 204, 0, 0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{v.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{v.desc}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-yellow)' }}>Select →</span>
                    </div>
                  ))}

                  {showMediaSelector === 'gif' && [
                    { id: 'rickroll', title: 'Rick Astley Dance', url: 'https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif' },
                    { id: 'crying', title: 'Melting Crying Emoji', url: 'https://media.giphy.com/media/2rtQMJvhzOnRe/giphy.gif' },
                    { id: 'clown', title: 'Putting on Clown Makeup', url: 'https://media.giphy.com/media/x0npYExCGOZeo/giphy.gif' },
                    { id: 'mindblown', title: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
                    { id: 'facepalm', title: 'Facepalm', url: 'https://media.giphy.com/media/3og0INyCmHlNylks9O/giphy.gif' },
                    { id: 'popcorn', title: 'Eating Popcorn', url: 'https://media.giphy.com/media/tFK8urY6XHj2w/giphy.gif' },
                    { id: 'thisisfine', title: 'This Is Fine', url: 'https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif' },
                    { id: 'laughing', title: 'Hysterically Laughing', url: 'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif' },
                    { id: 'confused', title: 'Confused Math', url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
                    { id: 'waiting', title: 'Waiting Skeleton', url: 'https://media.giphy.com/media/l2JhtKtDWYNKdRpoA/giphy.gif' }
                  ].map(v => (
                    <div 
                      key={v.id}
                      onClick={() => {
                        const newMsg = {
                          id: Date.now() + Math.random(),
                          text: `[GIF] ${v.title}`,
                          gifUrl: v.url,
                          sender: 'me',
                          time: 'Just now'
                        };
                        setChatHistories(prev => ({
                          ...prev,
                          [activeMatch.name]: [...(prev[activeMatch.name] || []), newMsg]
                        }));
                        setShowMediaSelector(false);
                        toast.success(`GIF sent to ${activeMatch.name}!`);
                      }}
                      style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={v.url} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} alt={v.title} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{v.title}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#a855f7' }}>Send GIF →</span>
                    </div>
                  ))}

                  {/* Input form to support custom pasting dynamic video urls! */}
                  {showMediaSelector === 'custom' && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '6px' }}>
                        🔗 Paste custom YouTube link or video ID:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text"
                          value={customYoutubeUrl}
                          onChange={e => setCustomYoutubeUrl(e.target.value)}
                          placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.8rem' }}
                        />
                        <button 
                          onClick={() => {
                            if (!customYoutubeUrl.trim()) {
                              toast.error("Please enter a valid YouTube link or Video ID first!");
                              return;
                            }
                            const videoId = getYoutubeId(customYoutubeUrl);
                            sendMediaMessage('custom', videoId, 'Custom YouTube Share', 'Shared by custom link');
                          }}
                          style={{ padding: '0 16px', borderRadius: '10px', background: 'var(--accent-pink)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Send Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quick Send Media shortcuts */}
            {!blockedMatches[activeMatch.name] && (
              <div style={{ display: 'flex', gap: '8px', padding: '0 20px 10px', overflowX: 'auto', zIndex: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowMediaSelector('love_song')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(255, 45, 85, 0.15)',
                    border: '1px solid rgba(255, 45, 85, 0.3)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 45, 85, 0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 45, 85, 0.15)'; }}
                >
                  🎵 Send Love Song
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaSelector('funny_joke')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(255, 204, 0, 0.15)',
                    border: '1px solid rgba(255, 204, 0, 0.3)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 204, 0, 0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 204, 0, 0.15)'; }}
                >
                  😂 Send Joke
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaSelector('custom')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'; }}
                >
                  🔗 Custom YouTube Link
                </button>
              </div>
            )}

            {/* Input */}
            {blockedMatches[activeMatch.name] ? (
              <div className="glass" style={{ 
                padding: '25px', 
                borderRadius: '20px 20px 0 0', 
                background: 'rgba(255, 45, 85, 0.1)', 
                borderTop: '2px solid var(--accent-pink)',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                gap: '8px',
                zIndex: 20
              }}>
                <span style={{ fontSize: '1.8rem' }}>🚫</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-pink)', letterSpacing: '1px' }}>
                  YOU HAVE BEEN BLOCKED
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.4' }}>
                  {activeMatch.name} blocked you because they saw you receiving background messages from other matches! Trust level is absolute zero.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="glass" style={{ padding: '20px', borderRadius: '20px 20px 0 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '5px 20px', display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                  <input 
                    type="text" 
                    placeholder="Type your disappointment..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ background: 'none', border: 'none', color: 'white', width: '100%', padding: '10px 0', outline: 'none' }}
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={() => setShowMediaSelector(showMediaSelector === 'gif' ? false : 'gif')} 
                  style={{ background: showMediaSelector === 'gif' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.05)', border: showMediaSelector === 'gif' ? '1px solid #a855f7' : '1px solid var(--glass-border)', borderRadius: '15px', padding: '0 15px', height: '50px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                  title="Select GIF"
                >
                  GIF
                </button>

                <button 
                  type="button" 
                  onClick={() => {
                    toast.error("🎙️ Microphone accessed... Sending your heavy breathing.");
                    setTimeout(() => {
                      setChatHistories(prev => ({
                        ...prev,
                        [activeMatch.name]: [...(prev[activeMatch.name] || []), { id: Date.now(), text: "🎤 [Audio: Heavy breathing for 4 seconds]", sender: 'me', time: 'Just now' }]
                      }));
                    }, 1000);
                  }} 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer' }}
                  title="Send Voice Note"
                >
                  🎙️
                </button>

                <button type="submit" className="btn-premium" style={{ background: themeColor, borderRadius: '50%', width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={20} />
                </button>
              </form>
            )}
            </div>

            {/* Twitch Streaming Live Audience sidebar Column */}
            <div style={{
              width: '240px',
              background: '#0e0e10',
              borderLeft: '1.5px solid #1f1f23',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              <div style={{ padding: '16px', borderBottom: '1.5px solid #1f1f23', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ff2d55', letterSpacing: '0.5px' }}>📢 MOHALLE KE LOG KYA BOL RHE HAI</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {twitchChat.map(item => (
                  <div key={item.id} style={{ fontSize: '0.75rem', lineHeight: '1.45', wordBreak: 'break-word', textAlign: 'left' }}>
                    <span style={{ color: item.tagColor || '#a855f7', fontWeight: 'bold', marginRight: '6px' }}>{item.user}:</span>
                    <span style={{ color: '#adadb8' }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1.5px solid #1f1f23', fontSize: '0.65rem', color: '#888', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontWeight: 'bold' }}>
                Aunty log rating your relation workout capacity ☕
              </div>
            </div>

          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '1.2rem' }}>
            Select a match to start suffering.
          </div>
        )}
      </div>

      {/* Tornado Messages Layer */}
      {flyingMessages.map((m) => {
        const xPos = `calc(50vw + ${Math.cos(m.angle) * m.radius}px - 100px)`;
        const yPos = `calc(50vh + ${Math.sin(m.angle) * m.radius}px + ${m.yOffset}px - 40px)`;
        
        return (
          <motion.div
            key={m.id}
            onClick={() => catchMessage(m)}
            style={{
              position: 'fixed',
              left: xPos,
              top: yPos,
              transform: `scale(${m.scale})`,
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#111',
              padding: '12px 15px',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              zIndex: 900,
              width: '200px',
              border: '2px solid var(--accent-pink)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              userSelect: 'none',
              transition: 'transform 0.05s'
            }}
            whileHover={{ scale: (m.scale || 1) * 1.1, border: '2px solid #10b981' }}
          >
            <img src={m.senderImg} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fff', objectFit: 'cover' }} alt={m.senderName} />
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--accent-pink)', margin: 0 }}>💬 UNREAD: {m.senderName}</p>
              <p style={{ fontSize: '0.75rem', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{m.text}</p>
            </div>
          </motion.div>
        );
      })}

      {/* Heart Attack Alarm Dropdown Notification */}
      <AnimatePresence>
        {heartAttackNotice && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            onClick={() => {
               const viralVideoIds = [
                 'jfKfPfyJRdk', // Lofi Girl study beats lofi
                 'y6120QOlsfU', // Sandstorm lofi
                 '9bZkp7q19f0', // Gangnam style cover
                 'dQw4w9WgXcQ', // Rickroll timeless joke
                 'QH2-TGUlwu4', // Nyan cat silly clip
                 'J---aiyznGQ'  // Keyboard cat classic
               ];
              const pool = viralVideoIds.filter(id => id !== currentReelVideoId);
              const nextId = pool[Math.floor(Math.random() * pool.length)];
              setCurrentReelVideoId(nextId);

              setHeartAttackNotice(null);
              setShowReelModal(true);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '15px',
              border: '2px solid white',
              boxShadow: '0 0 35px rgba(239, 68, 68, 0.75)',
              zIndex: 99999,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontWeight: '900',
              fontSize: '1rem',
              letterSpacing: '1px',
              boxSizing: 'border-box',
              minWidth: '320px',
              textAlign: 'center'
            }}
          >
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>🚨</motion.span>
            <span>{heartAttackNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real Reel Iframe Modal */}
      <AnimatePresence>
        {showReelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.95)',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              background: '#0a0a0a',
              border: '3px solid var(--accent-pink)',
              borderRadius: '25px',
              overflow: 'hidden',
              boxShadow: '0 0 50px rgba(255, 45, 85, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              aspectRatio: '9/16',
              height: '80vh'
            }}>
              {/* Header inside phone frame */}
              <div style={{ background: '#111', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-pink)', fontWeight: 'bold' }}>🔥 REEL FROM {activeReelMatch.toUpperCase()}</span>
                <button 
                  onClick={() => setShowReelModal(false)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>

              {/* Autoplaying Rickroll Troll Short Embedded Iframe */}
              <div style={{ flex: 1, background: '#000', position: 'relative' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentReelVideoId}?autoplay=1&mute=1&enablejsapi=1`}
                  title="Oops Real Reel"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                }}>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>🔊</motion.span>
                  <span>Click video screen to unmute & listen!</span>
                </div>
              </div>

              {/* Action bar mimic IG Reels */}
              <div style={{ background: '#111', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <span>🔥 {activeReelMatch}: "OMG this is literally you! 😭💀"</span>
                <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => toast.success("❤️ Added to your favorite cringe!")}>❤️ Like</span>
              </div>
            </div>
            <button 
              className="btn-premium" 
              style={{ marginTop: '20px', padding: '12px 30px', background: 'var(--accent-pink)', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}
              onClick={() => setShowReelModal(false)}
            >
              Close Cringe & Go Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Exit Popup */}
      <AnimatePresence>
        {showExitPopup && activeMatch && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}
          >
             <h2 style={{ color: 'var(--accent-pink)', marginBottom: '15px' }}>Ex: I told you no one can love you better than me.</h2>
             <img src={activeMatch.img} style={{ width: '100px', borderRadius: '50%', border: `4px solid ${themeColor}`, marginBottom: '15px', objectFit: 'cover', height: '100px' }} alt={activeMatch.name} />
             <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{activeMatch.name} says: Wait, don't go! Stop!</p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-premium" onClick={() => window.location.href = '/'}>Leave Anyway</button>
                <button className="btn-premium" style={{ background: '#333' }} onClick={() => setShowExitPopup(false)}>Stay and Suffer</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Love Popup */}
      <AnimatePresence>
        {showLovePopup && activeMatch && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}
          >
             <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: '5rem', marginBottom: '20px' }}>💀</motion.div>
             <h2 style={{ color: 'var(--accent-pink)', marginBottom: '10px', fontSize: '2rem' }}>YOU SAID THE L-WORD?!</h2>
             <p style={{ color: 'var(--text-dim)', marginBottom: '10px', fontSize: '1rem' }}>To someone you met on a CURSED dating app?!</p>
             <img src={activeMatch.img} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--accent-pink)', objectFit: 'cover', marginBottom: '15px' }} alt={activeMatch.name} />
             <p style={{ marginBottom: '5px' }}>{activeMatch.name} has screenshot this and sent it to 14 group chats.</p>
             <p style={{ color: 'var(--accent-pink)', fontStyle: 'italic', marginBottom: '25px', fontSize: '0.85rem' }}>"lmaooo this person just said they love me after 3 messages 💀"</p>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-premium" onClick={() => { setShowLovePopup(false); toast('🏆 Achievement Unlocked: Emotionally Reckless'); }}>I regret nothing</button>
                <button className="btn-premium" style={{ background: '#333' }} onClick={() => { setShowLovePopup(false); toast('😔 Achievement Unlocked: Backpedaling Expert'); }}>I meant it platonically</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && activeMatch && (
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
              <img src={activeMatch.img} style={{ width: '90px', height: '90px', borderRadius: '50%', border: `3px solid ${themeColor}`, display: 'block', margin: '0 auto 15px', objectFit: 'cover' }} alt={activeMatch.name} />
              <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>{activeMatch.name}{activeMatch.age ? `, ${activeMatch.age}` : ''}</h2>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '20px' }}>{activeMatch.bio}</p>
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

      {/* Dynamic safe secured screen confirmation overlay */}
      <AnimatePresence>
        {showSafeBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #10b981, #047857)',
              color: 'white',
              padding: '25px 50px',
              borderRadius: '25px',
              border: '3px solid #6ee7b7',
              boxShadow: '0 0 50px rgba(16, 185, 129, 0.8)',
              zIndex: 999999,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <motion.span 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              style={{ fontSize: '3rem' }}
            >
              🛡️
            </motion.span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>
              SYSTEM SECURED
            </h3>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 'bold' }}>
              "ohhh you ae safe now"
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              Tornado vortex cleared. All leaking signals neutralized.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* BSOD Rejection Crash */}
      <AnimatePresence>
        {showBSOD && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#0078d7',
              color: 'white',
              fontFamily: '"Segoe UI", -apple-system, sans-serif',
              padding: '10% 8%',
              zIndex: 9999999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ fontSize: '10rem', lineHeight: 1, marginBottom: '20px', fontWeight: 'light' }}>
              :(
            </div>
            
            <h1 style={{ fontSize: '2rem', fontWeight: '300', marginBottom: '30px', lineHeight: 1.4 }}>
              Your relationship ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
            </h1>

            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '40px' }}>
              {bsodPercentage}% complete
            </div>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ background: 'white', padding: '10px', borderRadius: '4px', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'repeating-conic-gradient(black 0% 25%, white 0% 50%) 50% / 10px 10px' }} />
              </div>
              
              <div style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.6 }}>
                For more information about this issue and possible fixes, visit:<br />
                <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>https://oops-cringe-rejection.windows.com/stopcode</span>
                <br /><br />
                If you call a support person, give them this info:<br />
                <span style={{ fontWeight: 'bold' }}>Stop Code: HEART_NOT_FOUND</span><br />
                <span style={{ fontWeight: 'bold' }}>Stop Code: CRINGE_OVERLOAD_EXCEPTION</span>
              </div>
            </div>

            {bsodPercentage >= 100 && (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                onClick={() => {
                  setShowBSOD(false);
                  setBlockedMatches({});
                  setFakeRam(12);
                  toast.success("💓 System rebooted! Heart rate stabilized.");
                }}
                style={{
                  marginTop: '50px',
                  alignSelf: 'flex-start',
                  background: 'white',
                  color: '#0078d7',
                  border: 'none',
                  padding: '14px 30px',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                Restart Relationship System & Try Again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Homie Interruption Overlay Popup */}
      <AnimatePresence>
        {showHomieInterruption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={{
                background: '#18181b',
                border: '3px solid #ffcc00',
                borderRadius: '24px',
                padding: '30px',
                width: '380px',
                textAlign: 'center',
                boxShadow: '0 0 40px rgba(255, 204, 0, 0.4)',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🕶️✊🏽</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffcc00', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px' }}>
                🚨 HOMIE INTERRUPTION!
              </h3>
              
              <div style={{
                background: 'white',
                color: 'black',
                padding: '15px 20px',
                borderRadius: '16px',
                position: 'relative',
                marginBottom: '25px',
                fontSize: '1.05rem',
                fontWeight: 'bold',
                lineHeight: 1.4
              }}>
                "{homieMessage}"
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid white'
                }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    setShowHomieInterruption(false);
                    toast.success("🤦‍♂️ Homie is extremely disappointed in your choices.");
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--accent-pink)',
                    border: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Ignore Homie Advice & Keep Simping 🤡
                </button>
                
                <button
                  onClick={() => {
                    setShowHomieInterruption(false);
                    toast.info("🔥 PROUD STAND ACTIVATED! Dodging in progress...");
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#27272a',
                    border: '1.5px solid rgba(255,255,255,0.15)',
                    color: '#ffcc00',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Stand Proud & Survive Red Flags 🛡️
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro Emotional Task Manager Modal */}
      <AnimatePresence>
        {showTaskManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 999998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                background: '#e0e0e0',
                color: 'black',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                width: '460px',
                borderRadius: '4px',
                border: '3px solid #fff',
                boxShadow: 'inset -2px -2px #555, inset 2px 2px #dfdfdf, 5px 5px 15px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
            >
              <div style={{
                background: 'linear-gradient(90deg, #000080, #1084d0)',
                color: 'white',
                padding: '6px 10px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>📁 Emotional Task Manager</span>
                <button
                  onClick={() => setShowTaskManager(false)}
                  style={{
                    background: '#e0e0e0',
                    color: 'black',
                    border: '1.5px solid #fff',
                    boxShadow: 'inset -1px -1px #555, inset 1px 1px #fff',
                    padding: '1px 5px',
                    fontSize: '0.65rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '8px', borderBottom: '1px solid #999', fontSize: '0.75rem', display: 'flex', gap: '15px' }}>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>File</span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Options</span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>View</span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Help</span>
              </div>

              <div style={{ padding: '15px' }}>
                <p style={{ margin: '0 0 12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  Select the emotional memory leak that is draining your sanity:
                </p>

                <div style={{
                  background: 'white',
                  border: '2px solid #555',
                  boxShadow: 'inset 1px 1px #888',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0', borderBottom: '1.5px solid #999' }}>
                        <th style={{ padding: '6px 8px', borderRight: '1px solid #ccc' }}>Process Name</th>
                        <th style={{ padding: '6px 8px', borderRight: '1px solid #ccc' }}>Memory</th>
                        <th style={{ padding: '6px 8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ background: 'rgba(255, 45, 85, 0.1)', fontWeight: 'bold' }}>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>⚠️ DatingApp.exe</td>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: '#ff2d55' }}>{fakeRam >= 75 ? '94%' : fakeRam}% emotional memory</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee', color: '#ff2d55' }}>Screaming Leaks 💔</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>🧠 Overthinking.exe</td>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>88% CPU capacity</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee', color: '#e0a800' }}>Running Wild 🏃‍♂️</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>🙄 Cringe_Factor.sys</td>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>100% capacity</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>Peak Cringe</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: '#555' }}> 😭 Hope_For_Future.exe</td>
                        <td style={{ padding: '6px 8px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', color: '#555' }}>1% (Critical Low)</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee', color: '#555' }}>Suspended</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '15px', border: '1px solid #999', padding: '10px', background: '#f0f0f0', borderRadius: '4px', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Emotional RAM Memory usage history:</div>
                  <div style={{ height: '35px', background: 'black', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                    <motion.div
                      animate={{ x: [-40, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '120%',
                        borderBottom: '3px solid #00ff00',
                        filter: 'drop-shadow(0 0 4px #00ff00)',
                        bottom: '20%'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    onClick={() => setShowTaskManager(false)}
                    style={{
                      background: '#e0e0e0',
                      border: '1.5px solid #fff',
                      boxShadow: 'inset -1.5px -1.5px #555, inset 1.5px 1.5px #fff',
                      padding: '6px 15px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setFakeRam(0);
                      setShowTaskManager(false);
                      toast.success("🩹 Emotional process terminated! Memory cleared, though structural trauma remains.");
                    }}
                    style={{
                      background: '#ff2d55',
                      color: 'white',
                      border: '1.5px solid #fff',
                      boxShadow: 'inset -1.5px -1.5px #555, inset 1.5px 1.5px #fff',
                      padding: '6px 15px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    End Emotional Process 💔
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'rgba(255,45,85,0.1)', padding: '5px', textAlign: 'center', fontSize: '0.6rem', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', zIndex: 10 }}>
        <Shield size={10} /> Heartbreak insurance is active. (Premium plan only)
      </div>
    </div>
  );
};

export default Chat;
