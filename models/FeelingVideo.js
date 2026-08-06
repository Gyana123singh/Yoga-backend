const mongoose = require('mongoose');

const feelingVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  feeling: { type: String, required: true }, // e.g. "Calm", "Stressed"
  focusArea: { type: String, default: 'General' }, // e.g. "Belly / Core strength", "Flexibility"
  stepTitle: { type: String, default: 'Practice Flow' }, // e.g. "Breath Preparation", "Core-Focused Yoga"
  videoUrl: { type: String, required: true },
  cloudinaryId: { type: String, default: '' },
  durationSeconds: { type: Number, default: 180 },
  durationText: { type: String, default: '03:00' },
  instructionText: { type: String, default: 'Focus on your breath. Inhale... Hold... Exhale...' },
  audioOnlyUrl: { type: String, default: '' },
  caloriesBurnRate: { type: Number, default: 38 }, // kcal
  intensityLevel: { type: String, default: 'Moderate' }, // "Low", "Moderate", "High"
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeelingVideo', feelingVideoSchema);
