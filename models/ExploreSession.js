const mongoose = require('mongoose');

const SessionVideoClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  durationTag: { type: String, default: '30 MINS' },
  durationCategory: { type: String, default: '30 Mins' },
  subtitle: { type: String, default: 'HD 1080p Video • Voice Guided' },
  description: { type: String, default: 'Quick & effective guided video class designed to awaken your body and sharpen mental focus in 30 minutes.' },
  includesText: { type: String, default: 'Includes: Sun Salutation, Child Pose, Downward Dog, Cobra' },
  thumbnailUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  buttonText: { type: String, default: 'Start 30 Mins Class' },
  durationMinutes: { type: Number, default: 30 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const ExploreSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  badgeTag: { type: String, default: 'BREATH' },
  subtitle: { type: String, default: 'Energize your body and mind with refreshing breathing techniques • 12:45' },
  totalDurationText: { type: String, default: '12:45' },
  heroImageUrl: { type: String, default: '' },
  bgImageUrl: { type: String, default: '' },
  videoClasses: [SessionVideoClassSchema],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ExploreSession', ExploreSessionSchema);
