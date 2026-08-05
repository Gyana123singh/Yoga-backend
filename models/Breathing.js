const mongoose = require('mongoose');

const breathingSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Relaxation & Calm' },
  pattern: { type: String, required: true },
  benefits: { type: String, required: true },
  audioGuide: { type: String, default: 'Voice 01 (Calm Female - Maya)' },
  defaultDuration: { type: String, default: '5 Minutes' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  iconColor: { type: String, default: 'from-indigo-500 to-cyan-500' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Breathing', breathingSchema);
