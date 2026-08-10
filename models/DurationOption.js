const mongoose = require('mongoose');

const durationOptionSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. "20 min"
  minutes: { type: Number, required: true }, // e.g. 20
  relatedFeelings: [{ type: String }], // Array of Feeling names associated with this duration option
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('DurationOption', durationOptionSchema);
