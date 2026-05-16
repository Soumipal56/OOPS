const getForecast = (req, res) => {
  const forecasts = [
    "Today you will confuse attention with affection.",
    "Mercury enters ghosting season.",
    "An emotionally unavailable person approaches.",
    "You will send a risky text and immediately regret it.",
    "Someone will screenshot your story but not reply.",
    "Your ex will post a thirst trap today. Do not engage."
  ];
  res.json({ forecast: forecasts[Math.floor(Math.random() * forecasts.length)] });
};

const getProfiles = (req, res) => {
  const gender = req.query.gender || 'boy';
  const boyProfiles = [
    { id: 2, name: "Stacy", age: 22, bio: "My last 4 boyfriends are still 'missing'. I love true crime and sharp objects.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stacy" },
    { id: 4, name: "Becky", age: 24, bio: "I literally cannot even. Looking for someone to fund my iced coffee addiction.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Becky" },
    { id: 5, name: "Karen", age: 31, bio: "I will ask to speak to your manager. Live, Laugh, Lawsuit.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karen" }
  ];
  const girlProfiles = [
    { id: 1, name: "Chad", age: 24, bio: "I 'forget' my wallet on every first date. Looking for someone to bankroll my crypto habit.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chad" },
    { id: 3, name: "Gary", age: 38, bio: "Living in my mom's basement. I haven't showered since the 2016 election. No drama pls.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gary" },
    { id: 6, name: "Brad", age: 27, bio: "Just looking for a gym bro who can occasionally cuddle. Not gay though.", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brad" }
  ];
  res.json({ profiles: gender === 'boy' ? boyProfiles : girlProfiles });
};

const getExMessage = (req, res) => {
  const exMessages = [
    "i miss you. can we talk?",
    "i know i ruined everything but i still think about you",
    "you were literally the best thing that happened to me",
    "i shouldn't be texting you rn",
    "do you ever think about us anymore?",
    "i still have your photos archived",
    "i heard our song today. i'm blaming you for the emotional damage",
    "i know you hate me but i miss you",
    "i'm not asking for another chance... unless?",
    "you ever miss me or should i embarrass myself elsewhere",
    "i'm trying to move on but spotify keeps snitching",
    "you were my favorite notification",
    "i almost called you last night",
    "i saw your story and my entire mood collapsed",
    "i'm still emotionally subscribed to you",
    "part of me still thinks we'll find our way back",
    "i just wanted to hear from you one more time"
  ];
  res.json({ from: "Your Ex 💔", message: exMessages[Math.floor(Math.random() * exMessages.length)] });
};

const getRedFlags = (req, res) => {
  const flags = [
    { flag: "Replies instantly", severity: "CRITICAL", note: "Either unemployed or obsessed. Both are red flags." },
    { flag: "Says 'I'm not like other guys/girls'", severity: "HIGH", note: "They are exactly like other guys/girls." },
    { flag: "Has a crypto wallet in bio", severity: "EXTREME", note: "Will ask you to invest in a rug pull within 48 hours." },
    { flag: "Uses 'lol' as punctuation", severity: "MEDIUM", note: "Emotionally unavailable lol." },
    { flag: "Profile says 'looking for something real'", severity: "HIGH", note: "They will ghost you in 3 days." },
    { flag: "Only has group photos", severity: "CRITICAL", note: "You will never know which one they are." }
  ];
  res.json({ redFlags: flags });
};

const validatePassword = (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password is required, just like emotional stability." });

  const results = {
    noE: !/e/i.test(password),
    hasNickname: /[A-Z][a-z]{2,}/.test(password),
    hasWeather: /sunny|rain|cloud|snow|storm|wind/i.test(password),
    allPassed: false
  };
  results.allPassed = results.noE && results.hasNickname && results.hasWeather;

  res.json({
    password_strength: results.allPassed ? "Somehow you did it. Impressive." : "Pathetic. Try again.",
    rules: results
  });
};

module.exports = {
  getForecast,
  getProfiles,
  getExMessage,
  getRedFlags,
  validatePassword
};
