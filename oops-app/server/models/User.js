const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['boy', 'girl'], default: 'boy' },
  displayName: { type: String, default: 'Anonymous Disaster' },
  achievements: [{ 
    name: String, 
    unlockedAt: { type: Date, default: Date.now } 
  }],
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  stats: {
    timesGhosted: { type: Number, default: 0 },
    doubleTexts: { type: Number, default: 0 },
    loveConfessions: { type: Number, default: 0 },
    rejections: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
