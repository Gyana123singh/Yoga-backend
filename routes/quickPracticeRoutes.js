const express = require('express');
const router = express.Router();
const {
  getQuickPractices,
  getQuickPracticeById,
  createQuickPractice,
  updateQuickPractice,
  deleteQuickPractice
} = require('../controllers/quickPracticeController');
const { uploadQuickPracticeMedia, uploadMedia } = require('../middleware/uploadMiddleware');

const { getMediaUrl } = require('../utils/cloudinaryHelper');

router.get('/', getQuickPractices);
router.get('/:id', getQuickPracticeById);
router.post('/upload', uploadMedia.single('media'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = await getMediaUrl(req, req.file, 'media');
  return res.json({ success: true, url: fileUrl });
});
router.post('/', uploadQuickPracticeMedia, createQuickPractice);
router.put('/:id', uploadQuickPracticeMedia, updateQuickPractice);
router.delete('/:id', deleteQuickPractice);

module.exports = router;
