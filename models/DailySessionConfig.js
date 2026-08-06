const mongoose = require('mongoose');

const sessionStepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  duration: { type: String, required: true }, // e.g. "4 min"
  durationMinutes: { type: Number, default: 4 },
  title: { type: String, required: true }, // e.g. "Breath preparation (Calm reset)"
  category: { type: String, default: 'Flow' },
  color: { type: String, default: '#ECFDF5' },
  icon: { type: String, default: 'wind' },
  description: { type: String, default: '' }
});

const dailySessionConfigSchema = new mongoose.Schema({
  feeling: { type: String, default: 'All' },
  focusArea: { type: String, default: 'All' },
  durationMinutes: { type: Number, default: 20 },
  title: { type: String, required: true }, // e.g. "20-Minute Belly & Calm"
  subtitle: { type: String, default: 'Your personal session' },
  badge: { type: String, default: 'YOUR PERSONAL SESSION' },
  steps: [sessionStepSchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailySessionConfig', dailySessionConfigSchema);
