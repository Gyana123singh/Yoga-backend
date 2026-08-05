const HealthSync = require('../models/HealthSync');
const { MOCK_SMARTWATCH_STATS } = require('../utils/seedData');

const getHealthStats = async (req, res) => {
  try {
    let devices = await HealthSync.find().sort({ users: -1 });
    if (devices.length === 0) {
      devices = MOCK_SMARTWATCH_STATS;
    }

    const telemetryMetrics = {
      totalWearablesConnected: 61000,
      activeSyncRate: '98.9%',
      avgHeartRateMonitored: '64 BPM',
      hrvStressDetectionsToday: 14250,
      supportedPlatforms: ['Apple HealthKit', 'Google Health Connect', 'Garmin Connect API', 'Oura Cloud API']
    };

    res.json({ success: true, devices, telemetryMetrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const syncDeviceTelemetry = async (req, res) => {
  try {
    const { device, syncRate, usersCount } = req.body;
    let item = await HealthSync.findOne({ device });
    if (!item) {
      item = new HealthSync({ device, users: usersCount || 100, syncRate: syncRate || '99.0%' });
    } else {
      if (usersCount) item.users = usersCount;
      if (syncRate) item.syncRate = syncRate;
    }
    const saved = await item.save();
    res.json({ success: true, message: 'Telemetry updated', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHealthStats,
  syncDeviceTelemetry
};
