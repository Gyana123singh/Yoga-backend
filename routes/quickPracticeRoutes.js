const express = require('express');
const router = express.Router();
const {
  getQuickPractices,
  getQuickPracticeById,
  createQuickPractice,
  updateQuickPractice,
  deleteQuickPractice
} = require('../controllers/quickPracticeController');
const { uploadQuickPracticeMedia } = require('../middleware/uploadMiddleware');

router.get('/', getQuickPractices);
router.get('/:id', getQuickPracticeById);
router.post('/', uploadQuickPracticeMedia, createQuickPractice);
router.put('/:id', uploadQuickPracticeMedia, updateQuickPractice);
router.delete('/:id', deleteQuickPractice);

module.exports = router;
