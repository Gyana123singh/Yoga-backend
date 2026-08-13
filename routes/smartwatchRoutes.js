const express = require('express');
const router = express.Router();
const { getSocketIO } = require('../config/socket');

// Memory store for recent telemetry logs
let recentTelemetryLogs = [];

/**
 * @route   POST /api/smartwatch/sync
 * @desc    Receive real-time smartwatch telemetry batch (BPM, calories, HRV, stress) from web or watch client
 * @access  Public
 */
router.post('/sync', async (req, res) => {
  try {
    const { deviceId, deviceName, connectionType, avgBpm, caloriesBurned, hrvAvg, stressIndex, sessionTitle, durationMinutes, syncedAt } = req.body;

    const logEntry = {
      id: `SYNC-${Date.now()}`,
      deviceId: deviceId || 'UNKNOWN_WATCH',
      deviceName: deviceName || 'Smartwatch',
      connectionType: connectionType || 'simulated',
      avgBpm: avgBpm || 72,
      caloriesBurned: caloriesBurned || 0,
      hrvAvg: hrvAvg || 65,
      stressIndex: stressIndex || 25,
      sessionTitle: sessionTitle || 'Yoga Practice',
      durationMinutes: durationMinutes || 10,
      syncedAt: syncedAt || new Date().toISOString()
    };

    recentTelemetryLogs.unshift(logEntry);
    if (recentTelemetryLogs.length > 50) recentTelemetryLogs.pop();

    // Broadcast real-time telemetry via Socket.io if available
    try {
      const io = getSocketIO();
      if (io) {
        io.emit('smartwatch:telemetry', logEntry);
      }
    } catch (socketErr) {
      console.warn('Socket broadcast warning:', socketErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Biometric telemetry synced successfully',
      data: logEntry
    });
  } catch (error) {
    console.error('Smartwatch Sync API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync smartwatch telemetry',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/smartwatch/logs
 * @desc    Get recent biometric telemetry logs
 * @access  Public
 */
router.get('/logs', (req, res) => {
  res.status(200).json({
    success: true,
    count: recentTelemetryLogs.length,
    data: recentTelemetryLogs
  });
});

module.exports = router;
