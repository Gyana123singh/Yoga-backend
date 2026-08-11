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

const { getMediaUrl } = require('../utils/cloudinaryHelper');

router.get('/', getYogaPrograms);
router.get('/:id', getYogaProgramById);
router.post('/upload', uploadMedia.single('media'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = await getMediaUrl(req, req.file, 'media');
  return res.json({ success: true, url: fileUrl });
});
router.post('/', programUpload, createYogaProgram);
router.put('/:id', programUpload, updateYogaProgram);
router.delete('/:id', deleteYogaProgram);
router.post('/:id/log-day', logProgramDayCompletion);

module.exports = router;
