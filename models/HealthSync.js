const mongoose = require('mongoose');

const healthSyncSchema = new mongoose.Schema({
  device: { type: String, required: true },
  users: { type: Number, default: 0 },
  syncRate: { type: String, default: '98.5%' },
  color: { type: String, default: '#6366F1' },
  status: { type: String, default: 'Optimal' }
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthSync', healthSyncSchema);
