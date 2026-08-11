const mongoose = require('mongoose');

const calendarCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Breathing", "Yoga", "Meditation", "Relaxation", "Sleep"
  icon: { type: String, default: '☀️' },
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
  order: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('CalendarCategory', calendarCategorySchema);
