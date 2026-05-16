import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const questions = [
    {
      q: "How do you handle a conversation lull?",
      options: [
        "Send 'hey' 14 times until they block me",
        "Delete the app and rethink my existence",
        "Wait 3 weeks to reply so I look 'busy'",
        "Ask if they like bread (the classic)"
      ]
    },
    {
      q: "Your ideal first date is...",
      options: [
        "An escape room where I leave them there",
        "Staring at our phones in silence at a Taco Bell",
        "A funeral of someone neither of us knew",
        "Just a zoom call with no camera on"
      ]
    },
    {
      q: "When someone ghosts you, you...",
      options: [
        "Check their LinkedIn for activity",
        "Assume they died and send flowers to their office",
        "Make a TikTok about it (POV: you're unlovable)",
        "Write a 12-page 'exit interview' email"
      ]
    },
    {
      q: "What is your biggest red flag?",
      options: [
        "I still use a Hotmail account",
        "I think I'm the main character",
        "I talk to my plants more than my parents",
        "All of the above (and then some)"
      ]
    }
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/rate');
    }
  };

  return (
    <div className="quiz-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px'
    }}>
      <div style={{ position: 'fixed', top: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-pink)', fontSize: '0.8rem', fontWeight: 'bold' }}>STEP 1 OF 23</p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Question {step + 1} of 47 (approx.)</p>
        <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '10px', borderRadius: '2px' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / 47) * 100}%` }}
            style={{ height: '100%', background: 'var(--accent-pink)', borderRadius: '2px' }}
          />
        </div>
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass" 
        style={{ width: '100%', maxWidth: '500px', padding: '40px', marginTop: '60px' }}
      >
        <h2 style={{ marginBottom: '30px', fontSize: '1.5rem' }}>{questions[step].q}</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {questions[step].options.map((opt, i) => (
            <button 
              key={i}
              className="cursed-input"
              style={{ textAlign: 'left', cursor: 'pointer', margin: 0, fontSize: '0.9rem' }}
              onClick={handleNext}
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>

      <p style={{ marginTop: '30px', color: 'var(--text-dim)', fontSize: '0.7rem', maxWidth: '300px', textAlign: 'center' }}>
        *Your answers are being recorded and will be used to mock you in the next screen.
      </p>
    </div>
  );
};

export default Quiz;
