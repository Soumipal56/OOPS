const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, enum: ['me', 'them'], required: true },
  time: { type: String, default: 'Just now' },
  createdAt: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  messages: [messageSchema],
  mood: { type: String, default: 'unstable' },
  attachmentLevel: { type: Number, default: 50 },
  achievements: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

chatSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
