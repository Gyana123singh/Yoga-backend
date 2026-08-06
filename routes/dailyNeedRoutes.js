const express = require('express');
const router = express.Router();
const {
  getDailyNeedsConfig,
  createFeeling,
  updateFeeling,
  deleteFeeling,
  createFocusArea,
  updateFocusArea,
  deleteFocusArea,
  createDuration,
  updateDuration,
  deleteDuration,
  createSessionConfig,
  updateSessionConfig,
  deleteSessionConfig,
  resolvePersonalSession
} = require('../controllers/dailyNeedController');

// Public config & resolution
router.get('/config', getDailyNeedsConfig);
router.post('/resolve-session', resolvePersonalSession);

// Feelings CRUD
router.post('/feelings', createFeeling);
router.put('/feelings/:id', updateFeeling);
router.delete('/feelings/:id', deleteFeeling);

// Focus Areas CRUD
router.post('/focus-areas', createFocusArea);
router.put('/focus-areas/:id', updateFocusArea);
router.delete('/focus-areas/:id', deleteFocusArea);

// Durations CRUD
router.post('/durations', createDuration);
router.put('/durations/:id', updateDuration);
router.delete('/durations/:id', deleteDuration);

// Session Configurations CRUD
router.post('/sessions', createSessionConfig);
router.put('/sessions/:id', updateSessionConfig);
router.delete('/sessions/:id', deleteSessionConfig);

module.exports = router;
