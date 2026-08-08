const Setting = require('../models/Setting');

const DEFAULT_SETTINGS = {
  siteName: 'AURA Yoga & Mindfulness Platform',
  aiModelVersion: 'v2.4-NeuralFlow',
  razorpayKeyConfig: 'rzp_test_51Pq349YogaKey2026',
  healthKitEnabled: true,
  telemetrySyncInterval: '15 mins',
  maxAiTokensPerUser: 50000,
  emailAlertsEnabled: true,
  maintenanceMode: false
};

const getSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = DEFAULT_SETTINGS;
    }
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting(req.body);
    } else {
      Object.assign(setting, req.body);
    }
    const updated = await setting.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
