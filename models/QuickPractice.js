const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  phase: { type: String, required: true }, // "INHALE", "HOLD", "EXHALE"
  durationSeconds: { type: Number, required: true, default: 4 },
  instruction: { type: String, default: 'Breathe In Deeply' },
  frameImageOverride: { type: String, default: '' }
}, { _id: false });

const quickPracticeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "2 Min Quick Reset", "Calm Me (Box Breathing 4-4-4-4)"
  subtitle: { type: String, default: 'Mindful Breath • Inner Balance' },
  category: { type: String, enum: ['quick_timer', 'sos_moment', 'library'], required: true, default: 'quick_timer' },
  filterCategory: { type: String, default: 'Calm' }, // "Calm", "Focus", "Sleep", "Energy"
  patternTag: { type: String, default: 'Pattern: 4-4-4' },
  icon: { type: String, default: 'wind' }, // "clock", "heart", "leaf", "wind"
  durationMinutes: { type: Number, default: 2 },
  badgeText: { type: String, default: 'Quick Practice Session' },
  
  // Extra detailed attributes for Breathing Pattern Library (Image 3)
  benefits: {
    type: [String],
    default: [
      'Lowers cortisol stress hormone',
      'Enhances mental clarity',
      'Balances autonomic nervous system'
    ]
  },
  safetyCaution: {
    type: String,
    default: 'If pregnant or experiencing high blood pressure, reduce hold phase to comfortable level.'
  },
  
  // Custom Media Assets managed by Admin
  bgImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop' },
  frameDesignUrl: { type: String, default: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png' },
  bgMusicUrl: { type: String, default: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' },
  voiceGuidanceUrl: { type: String, default: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14f4e.mp3' },
  
  phases: {
    type: [phaseSchema],
    default: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
      { phase: 'EXHALE', durationSeconds: 4, instruction: 'Release Slowly' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Rest & Pause' }
    ]
  },
  
  order: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuickPractice', quickPracticeSchema);
