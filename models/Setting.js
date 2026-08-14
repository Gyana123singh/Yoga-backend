const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Yoga Fitness & Wellness Studio' },
  aiModelVersion: { type: String, default: 'v2.4-NeuralFlow' },
  razorpayKeyConfig: { type: String, default: 'rzp_test_51Pq349YogaKey2026' },
  healthKitEnabled: { type: Boolean, default: true },
  telemetrySyncInterval: { type: String, default: '15 mins' },
  maxAiTokensPerUser: { type: Number, default: 50000 },
  emailAlertsEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
