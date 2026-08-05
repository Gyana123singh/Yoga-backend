const express = require('express');
const router = express.Router();
const {
  getHealthStats,
  syncDeviceTelemetry
} = require('../controllers/healthController');

router.get('/', getHealthStats);
router.post('/sync', syncDeviceTelemetry);

module.exports = router;
