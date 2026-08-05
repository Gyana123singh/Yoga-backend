const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'AURA Yoga & Wellness Studio' },
  aiModelVersion: { type: String, default: 'v2.4-NeuralFlow' },
  stripeKeyConfig: { type: String, default: 'pk_live_********************' },
  healthKitEnabled: { type: Boolean, default: true },
  telemetrySyncInterval: { type: String, default: '15 mins' },
  maxAiTokensPerUser: { type: Number, default: 50000 },
  emailAlertsEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
