const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Balasana", "Padmasana"
  subtitle: { type: String, default: 'Restorative Decompression • Inner Focus' },
  badgeTag: { type: String, default: 'REST' }, // "REST", "MEDITATION", "FULL BODY", "STRENGTH"
  category: { type: String, default: 'Exercises' },
  durationMinutes: { type: Number, default: 10 },
  heroImageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'
  },
  demoVideoUrl: {
    type: String,
    default: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4'
  },
  bgImageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop'
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

  // 8 Accordion Instructions matching Screenshots 2 & 3
  whatIs: {
    type: String,
    default: 'Balasana (Child Pose) is a gentle, restorative yoga posture that lengthens the spine and calms the central nervous system.'
  },
  benefits: {
    type: String,
    default: 'Gently stretches hips, thighs, and ankles. Relieves back and neck strain while promoting deep mental relaxation.'
  },
  correctPosture: {
    type: String,
    default: 'Kneel on the mat, bring big toes together, sit on heels, and fold torso forward extending arms out long.'
  },
  instructions: {
    type: String,
    default: 'General instructions and alignment guidelines before beginning your movement flow.'
  },
  howToDo: {
    type: String,
    default: 'Step-by-step method to practice Balasana correctly. Rest forehead on mat and breathe deeply into lower back.'
  },
  whatItDoesntGuarantee: {
    type: String,
    default: 'Provides immediate tension relief but is not a permanent substitute for professional orthopedic care.'
  },
  contraindications: {
    type: String,
    default: 'Avoid or use support if suffering from severe knee joint injury, ankle sprain, or late-stage pregnancy.'
  },
  originHistory: {
    type: String,
    default: 'Originated from traditional Hatha Yoga. Bala in Sanskrit means Child and Asana means Posture.'
  },
  order: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

// Auto-drop legacy id_1 index if present
Exercise.collection.dropIndex('id_1').catch(() => {});

module.exports = Exercise;
