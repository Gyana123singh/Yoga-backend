const mongoose = require('mongoose');

const breathingSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Kapalbhati Pranayama"
  subtitle: { type: String, default: 'Purifying Breath • Energizing Mind' },
  badgeTag: { type: String, default: 'CLEANSE' }, // "CLEANSE", "VITALITY", "DEEP RELAXATION"
  category: { type: String, default: 'Breathing' }, // "Breathing", "Exercises"
  totalRounds: { type: Number, default: 3 },
  durationMinutes: { type: Number, default: 5 },
  heroImageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop'
  },
  demoVideoUrl: {
    type: String,
    default: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4'
  },
  bgImageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop'
  },
  frameDesignUrl: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png'
  },
  bgMusicUrl: {
    type: String,
    default: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
  },
  voiceGuidanceUrl: { type: String, default: '' },
  inhaleSeconds: { type: Number, default: 4 },
  holdSeconds: { type: Number, default: 4 },
  exhaleSeconds: { type: Number, default: 4 },

  // 8 Accordion Instructions matching Screenshots 2 & 3
  whatIs: {
    type: String,
    default: 'Kapalbhati is a powerful yogic breathing technique that involves rapid, forceful exhalations and passive inhalations.'
  },
  benefits: {
    type: String,
    default: 'Improves digestion, boosts energy, detoxifies body, enhances lung capacity, and sharpens mental focus.'
  },
  correctPosture: {
    type: String,
    default: 'Sit in a comfortable meditative posture such as Sukhasana or Padmasana with spine erect and shoulders relaxed.'
  },
  instructions: {
    type: String,
    default: 'General instructions and important guidelines you should know before starting your practice.'
  },
  howToDo: {
    type: String,
    default: 'Step-by-step method to practice correctly for maximum benefit. Take a deep inhale and exhale forcefully pulling navel inward.'
  },
  whatItDoesntGuarantee: {
    type: String,
    default: 'Kapalbhati is effective for many conditions but it is not a cure for all chronic ailments without medical guidance.'
  },
  contraindications: {
    type: String,
    default: 'Certain health conditions where Kapalbhati should be avoided: pregnancy, high blood pressure, heart diseases, hernia, and recent abdominal surgery.'
  },
  originHistory: {
    type: String,
    default: 'Kapalbhati originated from ancient yogic texts in India (Hatha Yoga Pradipika). The word comes from Kapal (skull) and Bhati (shining).'
  },
  order: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Breathing = mongoose.model('Breathing', breathingSchema);

// Auto-drop stale legacy index 'id_1' if present in MongoDB
Breathing.collection.dropIndex('id_1').catch(() => {});

module.exports = Breathing;
