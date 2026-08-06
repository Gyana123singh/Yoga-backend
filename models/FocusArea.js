const mongoose = require('mongoose');

const focusAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: 'target' },
  // Array of Feeling names associated with this focus area for dynamic filtering
  relatedFeelings: [{ type: String }],
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('FocusArea', focusAreaSchema);
