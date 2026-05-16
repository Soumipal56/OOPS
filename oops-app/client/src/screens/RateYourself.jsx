import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const RateYourself = () => {
  const [rating, setRating] = useState(5);
  const [isRoasting, setIsRoasting] = useState(false);
  const [roast, setRoast] = useState('');
  const [prediction, setPrediction] = useState('');
  const navigate = useNavigate();

  const roasts = [
    "A 5? Even the AI model thinking you're a 5 is a hallucination.",
    "Interesting choice. My sensors detect a distinct smell of desperation and old pizza.",
    "You have the charisma of a damp cardboard box in a thunderstorm.",
    "I've seen better profiles on Craigslist under the 'Missed Connections: I stole your wallet' section.",
    "Your percentile rank is 'Bottom 2%'. Even the bots are filtering you out."
  ];

  const predictions = [
    "You will become 'The Ghost' in every relationship you start.",
    "Your future holds many 'read at 2:34 AM' receipts and zero replies.",
    "You will eventually marry your air fryer.",
    "You will spend the next 4 valentines days explaining your 'complex' personality to a cat.",
    "You will be the one who 'likes' back 4 months later and says 'sorry just saw this'."
  ];

  const handleRate = () => {
    setIsRoasting(true);
    setTimeout(() => {
      setRoast(roasts[Math.floor(Math.random() * roasts.length)]);
      setPrediction(predictions[Math.floor(Math.random() * predictions.length)]);
      setIsRoasting(false);
    }, 2000);
  };

  return (
    <div className="rate-screen" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>EGO DESTRUCTION</h2>
      <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>How would you rate your own existence?</p>

      {!roast ? (
        <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s}
                size={40}
                fill={s <= rating ? 'var(--accent-pink)' : 'none'}
                color={s <= rating ? 'var(--accent-pink)' : 'var(--text-dim)'}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => setRating(s)}
                className={s <= rating ? 'shake' : ''}
              />
            ))}
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>{rating}/5 Stars</p>
          
          <button 
            className="btn-premium" 
            style={{ width: '100%' }}
            onClick={handleRate}
            disabled={isRoasting}
          >
            {isRoasting ? 'ANALYZING YOUR FLAWS...' : 'SUBMIT FOR JUDGMENT'}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass" 
          style={{ width: '100%', maxWidth: '500px', padding: '40px', borderColor: 'var(--accent-pink)' }}
        >
          <div style={{ color: 'var(--accent-pink)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px' }}>
            AI JUDGMENT: DOWNGRADED TO 1.2 STARS
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>"{roast}"</h3>
          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '20px 0' }} />
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Future Prediction: {prediction}
          </p>
          
          <button 
            className="btn-premium" 
            style={{ width: '100%', marginTop: '30px' }}
            onClick={() => navigate('/swipe')}
          >
            I ACCEPT MY FATE →
          </button>
        </motion.div>
      )}

      {isRoasting && (
        <div style={{ marginTop: '20px', color: 'var(--accent-pink)', fontSize: '0.7rem' }}>
          Consulting the Council of Exes...
        </div>
      )}
    </div>
  );
};

export default RateYourself;
