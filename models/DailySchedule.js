const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  title: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, default: '10 Minutes' },
  durationMinutes: { type: Number, default: 10 },
  icon: { type: String, default: '🧘' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  category: { type: String, default: 'General' }
});

const dailyScheduleSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
  completedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 3 },
  items: [scheduleItemSchema]
}, {
  timestamps: true
});

// Ensure a single schedule document per user per day
dailyScheduleSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailySchedule', dailyScheduleSchema);
