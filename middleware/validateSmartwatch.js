/**
 * Middleware for validating smartwatch device registration, status updates, and session sync payloads.
 */

const validateDeviceRegister = (req, res, next) => {
  const { deviceId, deviceName } = req.body;
  const errors = [];

  if (!deviceId || typeof deviceId !== 'string' || deviceId.trim().length === 0) {
    errors.push('deviceId is required and must be a non-empty string');
  }
  if (!deviceName || typeof deviceName !== 'string' || deviceName.trim().length === 0) {
    errors.push('deviceName is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid smartwatch device registration data',
      errors
    });
  }

  next();
};

const validateSessionSync = (req, res, next) => {
  const { 
    deviceId, 
    sessionId, 
    sessionTitle, 
    durationMinutes, 
    avgBpm, 
    maxBpm, 
    minBpm, 
    caloriesBurned, 
    stressIndex 
  } = req.body;

  const errors = [];

  if (!deviceId || typeof deviceId !== 'string' || deviceId.trim().length === 0) {
    errors.push('deviceId is required and must be a valid string');
  }
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    errors.push('sessionId is required for idempotency');
  }
  if (!sessionTitle || typeof sessionTitle !== 'string') {
    errors.push('sessionTitle is required and must be a string');
  }

  if (typeof durationMinutes !== 'number' || isNaN(durationMinutes) || durationMinutes < 0) {
    errors.push('durationMinutes must be a non-negative number');
  }

  if (typeof avgBpm !== 'number' || isNaN(avgBpm) || avgBpm < 30 || avgBpm > 250) {
    errors.push('avgBpm must be a valid number between 30 and 250');
  }

  if (maxBpm !== undefined && (typeof maxBpm !== 'number' || isNaN(maxBpm) || maxBpm < 30 || maxBpm > 250)) {
    errors.push('maxBpm must be a valid number between 30 and 250');
  }

  if (minBpm !== undefined && (typeof minBpm !== 'number' || isNaN(minBpm) || minBpm < 30 || minBpm > 250)) {
    errors.push('minBpm must be a valid number between 30 and 250');
  }

  if (typeof caloriesBurned !== 'number' || isNaN(caloriesBurned) || caloriesBurned < 0) {
    errors.push('caloriesBurned must be a non-negative number');
  }

  if (stressIndex !== undefined && (typeof stressIndex !== 'number' || isNaN(stressIndex) || stressIndex < 0 || stressIndex > 100)) {
    errors.push('stressIndex must be a number between 0 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid smartwatch telemetry',
      errors
    });
  }

  next();
};

module.exports = {
  validateDeviceRegister,
  validateSessionSync
};
