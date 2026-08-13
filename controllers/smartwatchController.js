const SmartwatchDevice = require('../models/SmartwatchDevice');
const SmartwatchLog = require('../models/SmartwatchLog');
const { getSocketIO } = require('../config/socket');

// Helper to extract clean string ID from authenticated req.user
const getUserId = (req) => {
  if (!req.user) return null;
  return req.user._id ? req.user._id.toString() : req.user.id;
};

/**
 * @route   POST /api/smartwatch/devices
 * @desc    Register a new smartwatch device for the authenticated user
 * @access  Private (JWT Protected)
 */
const registerDevice = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { deviceId, deviceName, manufacturer, model, platform, firmwareVersion, connectionType } = req.body;

    let device = await SmartwatchDevice.findOne({ deviceId });

    if (device) {
      // Ensure the device belongs to the authenticated user
      if (device.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Device is already registered to another user'
        });
      }

      // Update connection status and metadata
      device.deviceName = deviceName || device.deviceName;
      device.manufacturer = manufacturer || device.manufacturer;
      device.model = model || device.model;
      device.platform = platform || device.platform;
      device.firmwareVersion = firmwareVersion || device.firmwareVersion;
      device.connectionType = connectionType || device.connectionType;
      device.isConnected = true;
      device.lastSeenAt = new Date();
      await device.save();

      return res.status(200).json({
        success: true,
        message: 'Smartwatch device status updated',
        data: device
      });
    }

    // Register new device
    device = await SmartwatchDevice.create({
      userId,
      deviceId,
      deviceName,
      manufacturer: manufacturer || 'Samsung',
      model: model || 'Galaxy Watch 4',
      platform: platform || 'Wear OS',
      firmwareVersion: firmwareVersion || '1.0.0',
      connectionType: connectionType || 'wearable_data_layer',
      isConnected: true,
      lastSeenAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Smartwatch device registered successfully',
      data: device
    });
  } catch (error) {
    console.error('registerDevice Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register smartwatch device'
    });
  }
};

/**
 * @route   GET /api/smartwatch/devices
 * @desc    Get all smartwatch devices registered to the authenticated user
 * @access  Private (JWT Protected)
 */
const getUserDevices = async (req, res) => {
  try {
    const userId = getUserId(req);
    const devices = await SmartwatchDevice.find({ userId }).sort({ isConnected: -1, lastSeenAt: -1 });

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    console.error('getUserDevices Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve smartwatch devices'
    });
  }
};

/**
 * @route   GET /api/smartwatch/devices/:deviceId
 * @desc    Get specific smartwatch device details by deviceId (Enforces ownership)
 * @access  Private (JWT Protected)
 */
const getDeviceById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { deviceId } = req.params;

    const device = await SmartwatchDevice.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Smartwatch device not found'
      });
    }

    if (device.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied. Device belongs to another user'
      });
    }

    return res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('getDeviceById Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve device'
    });
  }
};

/**
 * @route   PATCH /api/smartwatch/devices/:deviceId/status
 * @desc    Update device connection status & lastSeenAt (Enforces ownership)
 * @access  Private (JWT Protected)
 */
const updateDeviceStatus = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { deviceId } = req.params;
    const { isConnected, connectionType } = req.body;

    const device = await SmartwatchDevice.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Smartwatch device not found'
      });
    }

    if (device.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Cannot update device owned by another user'
      });
    }

    if (isConnected !== undefined) device.isConnected = isConnected;
    if (connectionType) device.connectionType = connectionType;
    device.lastSeenAt = new Date();

    await device.save();

    return res.status(200).json({
      success: true,
      message: 'Smartwatch status updated',
      data: device
    });
  } catch (error) {
    console.error('updateDeviceStatus Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update device status'
    });
  }
};

/**
 * @route   DELETE /api/smartwatch/devices/:deviceId
 * @desc    Remove smartwatch device (Enforces ownership)
 * @access  Private (JWT Protected)
 */
const deleteDevice = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { deviceId } = req.params;

    const device = await SmartwatchDevice.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Smartwatch device not found'
      });
    }

    if (device.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Cannot delete device owned by another user'
      });
    }

    await SmartwatchDevice.deleteOne({ _id: device._id });

    return res.status(200).json({
      success: true,
      message: 'Smartwatch device unregistered successfully'
    });
  } catch (error) {
    console.error('deleteDevice Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete device'
    });
  }
};

/**
 * @route   POST /api/smartwatch/sync
 * @desc    Persist completed session biometric summary (Idempotent, JWT Authenticated, Device Ownership Enforced)
 * @access  Private (JWT Protected)
 */
const syncCompletedSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { 
      deviceId, 
      sessionId, 
      sessionTitle, 
      durationMinutes, 
      avgBpm, 
      maxBpm, 
      minBpm, 
      caloriesBurned, 
      caloriesSource,
      hrvAvg, 
      hrvMetric, 
      stressIndex, 
      stressSource, 
      targetZone, 
      syncedAt 
    } = req.body;

    // 1. Idempotency Check: Prevent duplicate insertions if mobile retries network request
    const existingLog = await SmartwatchLog.findOne({ sessionId });
    if (existingLog) {
      if (existingLog.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Session belongs to another user'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Session summary already synchronized (Idempotent call)',
        data: existingLog
      });
    }

    // 2. Validate device ownership if device is registered
    const device = await SmartwatchDevice.findOne({ deviceId });
    if (device) {
      if (device.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Cannot submit telemetry for device registered to another user'
        });
      }
      // Update last seen timestamp
      device.lastSeenAt = new Date();
      device.isConnected = true;
      await device.save();
    }

    // 3. Create SmartwatchLog document in MongoDB
    const logPayload = {
      userId,
      deviceId,
      sessionId,
      sessionTitle,
      durationMinutes,
      avgBpm,
      maxBpm: maxBpm || avgBpm,
      minBpm: minBpm || 60,
      caloriesBurned,
      caloriesSource: caloriesSource || (process.env.NODE_ENV === 'development' ? 'simulated' : 'device'),
      hrvAvg: hrvAvg || 65,
      hrvMetric: hrvMetric || 'RMSSD',
      stressIndex: stressIndex !== undefined ? stressIndex : 25,
      stressSource: stressSource || (process.env.NODE_ENV === 'development' ? 'simulated' : 'device'),
      targetZone: targetZone || 'Flow Zone',
      syncedAt: syncedAt ? new Date(syncedAt) : new Date()
    };

    const savedLog = await SmartwatchLog.create(logPayload);

    // 4. Emit room-scoped Socket.io completion event to user:<userId> and device:<deviceId>
    try {
      const io = getSocketIO();
      if (io) {
        io.to(`user:${userId}`).emit('smartwatch:telemetry', savedLog);
        io.to(`device:${deviceId}`).emit('smartwatch:vibrate-completion', {
          deviceId,
          sessionId,
          sessionTitle,
          pattern: [300, 150, 300, 150, 600]
        });
      }
    } catch (socketErr) {
      console.warn('[Socket.io Scoped Broadcast Error]:', socketErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Completed session biometric summary persisted successfully',
      data: savedLog
    });
  } catch (error) {
    console.error('syncCompletedSession Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to persist smartwatch session summary'
    });
  }
};

/**
 * @route   GET /api/smartwatch/logs
 * @desc    Get session history logs for authenticated user
 * @access  Private (JWT Protected)
 */
const getSessionLogs = async (req, res) => {
  try {
    const userId = getUserId(req);
    const logs = await SmartwatchLog.find({ userId }).sort({ createdAt: -1 }).limit(100);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('getSessionLogs Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve smartwatch session logs'
    });
  }
};

/**
 * @route   GET /api/smartwatch/logs/:id
 * @desc    Get specific session log by Mongo ID (Enforces ownership)
 * @access  Private (JWT Protected)
 */
const getSessionLogById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const log = await SmartwatchLog.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Session log not found'
      });
    }

    if (log.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Access denied'
      });
    }

    return res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('getSessionLogById Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve session log'
    });
  }
};

module.exports = {
  registerDevice,
  getUserDevices,
  getDeviceById,
  updateDeviceStatus,
  deleteDevice,
  syncCompletedSession,
  getSessionLogs,
  getSessionLogById
};
