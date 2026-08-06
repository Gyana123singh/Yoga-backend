const mongoose = require('mongoose');

const dailyScheduleSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Morning Mindful Breath", "Core Yoga Flow", "Sleep Journey Practice"
  category: {
    type: String,
    enum: ['Breathing', 'Yoga', 'Meditation', 'Relaxation', 'Sleep'],
    default: 'Breathing'
  },
  scheduledDate: { type: String, required: true }, // "YYYY-MM-DD" format, e.g. "2026-07-04"
  scheduledTime: { type: String, default: '07:15 AM' },
  durationMinutes: { type: Number, default: 10 },
  status: { type: String, enum: ['Pending', 'Completed', 'Missed'], default: 'Pending' },
  icon: { type: String, default: 'sun' },
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
  userId: { type: String, default: 'guest' },
  order: { type: Number, default: 1 }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailySchedule', dailyScheduleSchema);
