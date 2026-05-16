const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { email, password, gender, displayName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required. Just like therapy." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "This email already exists. Just like your trust issues." });
    }

    const user = await User.create({ email, password, gender, displayName });
    res.status(201).json({ 
      message: "Account created. Your journey of disappointment begins now.",
      user: { id: user._id, email: user.email, gender: user.gender, displayName: user.displayName }
    });
  } catch (err) {
    res.status(500).json({ error: "Server crashed harder than your last relationship." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Fill in both fields. We know commitment is hard for you." });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Wrong credentials. Even your password doesn't want to be associated with you." });
    }

    res.json({ 
      message: "Welcome back to suffering.",
      user: { id: user._id, email: user.email, gender: user.gender, displayName: user.displayName, stats: user.stats, achievements: user.achievements }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error. At least something is consistent in your life." });
  }
};

module.exports = { register, login };
