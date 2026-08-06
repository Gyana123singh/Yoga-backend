const express = require('express');
const router = express.Router();
const {
  getYogaPrograms,
  getYogaProgramById,
  createYogaProgram,
  updateYogaProgram,
  deleteYogaProgram,
  logProgramDayCompletion
} = require('../controllers/yogaProgramController');
const { uploadMedia } = require('../middleware/uploadMiddleware');

const programUpload = uploadMedia.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'stepVideo', maxCount: 5 }
]);

router.get('/', getYogaPrograms);
router.get('/:id', getYogaProgramById);
router.post('/', programUpload, createYogaProgram);
router.put('/:id', programUpload, updateYogaProgram);
router.delete('/:id', deleteYogaProgram);
router.post('/:id/log-day', logProgramDayCompletion);

module.exports = router;
