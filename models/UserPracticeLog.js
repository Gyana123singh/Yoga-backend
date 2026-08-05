const mongoose = require('mongoose');

const userPracticeLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  practiceType: {
    type: String,
    enum: ['Quick Practice', 'Personal Session', 'Daily Schedule', 'Breathing', 'Program', 'SOS'],
    default: 'Personal Session'
  },
  title: { type: String, required: true },
  durationMinutes: { type: Number, required: true, default: 10 },
  moodBefore: { type: String, default: 'Calm' },
  moodAfter: { type: String, default: 'Relaxed' },
  targetArea: { type: String, default: 'Belly / Core strength' },
  date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPracticeLog', userPracticeLogSchema);
