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

router.get('/', getQuickPractices);
router.get('/:id', getQuickPracticeById);
router.post('/upload', uploadMedia.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  const fileUrl = `${protocol}://${host}/uploads/media/${req.file.filename}`;
  return res.json({ success: true, url: fileUrl });
});
router.post('/', uploadQuickPracticeMedia, createQuickPractice);
router.put('/:id', uploadQuickPracticeMedia, updateQuickPractice);
router.delete('/:id', deleteQuickPractice);

module.exports = router;
