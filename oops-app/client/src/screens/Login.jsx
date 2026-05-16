import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('boy');
  const [errors, setErrors] = useState([]);
  const controls = useAnimation();
  const navigate = useNavigate();

  const [validations, setValidations] = useState({
    noE: false,
    nickname: false,
    weather: false
  });

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

      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <label style={{ display: 'block', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '10px' }}>EMAIL</label>
        <input 
          type="email" 
          className="cursed-input" 
          placeholder="youresoalone@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={{ display: 'block', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '10px' }}>PASSWORD</label>
        <input 
          type="password" 
          className="cursed-input" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            localStorage.setItem('userGender', gender);
            navigate('/quiz');
          }}
        >
          ENTER THE VOID →
        </motion.button>
        
        <p style={{ marginTop: '20px', fontSize: '0.6rem', color: 'var(--text-dim)' }}>
          By clicking, you agree to be ghosted within 48 hours.
        </p>
      </div>
    </div>
  );
};

export default Login;
