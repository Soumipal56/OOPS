const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['boy', 'girl'], required: true },
  bio: { type: String, required: true },
  img: { type: String, required: true },
  redFlags: [String],
  toxicTraits: [String],
  responseRate: { type: String, default: '0.001%' },
  avgGhostingTime: { type: String, default: '14 seconds' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
