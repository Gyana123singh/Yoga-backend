const express = require('express');
const router = express.Router();
const {
  getSchedulesByDate,
  addSchedule,
  toggleScheduleStatus,
  deleteSchedule,
  getMonthStats,
  getWeekStats
} = require('../controllers/dailyScheduleController');
const { uploadMedia } = require('../middleware/uploadMiddleware');

const scheduleUpload = uploadMedia.fields([
  { name: 'bgImage', maxCount: 1 },
  { name: 'frameDesign', maxCount: 1 },
  { name: 'bgMusic', maxCount: 1 },
  { name: 'voiceGuidance', maxCount: 1 }
]);

router.get('/', getSchedulesByDate);
router.post('/', scheduleUpload, addSchedule);
router.put('/:id/toggle-complete', toggleScheduleStatus);
router.delete('/:id', deleteSchedule);
router.get('/month-stats', getMonthStats);
router.get('/week-stats', getWeekStats);

module.exports = router;
