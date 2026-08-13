const express = require('express');
const router = express.Router();
const { protectCustomer } = require('../middleware/authMiddleware');
const { validateDeviceRegister, validateSessionSync } = require('../middleware/validateSmartwatch');
const {
  registerDevice,
  getUserDevices,
  getDeviceById,
  updateDeviceStatus,
  deleteDevice,
  syncCompletedSession,
  getSessionLogs,
  getSessionLogById
} = require('../controllers/smartwatchController');

// All smartwatch routes require JWT authentication
router.use(protectCustomer);

// --- Device Management REST Endpoints ---
router.post('/devices', validateDeviceRegister, registerDevice);
router.get('/devices', getUserDevices);
router.get('/devices/:deviceId', getDeviceById);
router.patch('/devices/:deviceId/status', updateDeviceStatus);
router.delete('/devices/:deviceId', deleteDevice);

// --- Session Log Telemetry Persistence Endpoints ---
router.post('/sync', validateSessionSync, syncCompletedSession);
router.get('/logs', getSessionLogs);
router.get('/logs/:id', getSessionLogById);

module.exports = router;
