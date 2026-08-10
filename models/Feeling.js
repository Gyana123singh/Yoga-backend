const mongoose = require('mongoose');

const feelingSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  emoji: { type: String, default: '😊' },
  description: { type: String, default: '' },
  relatedDurations: [{ type: Number }], // Array of duration minutes (e.g. [5, 10, 15, 20, 30]) associated with this feeling
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feeling', feelingSchema);
