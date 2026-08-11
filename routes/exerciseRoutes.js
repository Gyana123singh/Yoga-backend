const express = require('express');
const router = express.Router();
const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} = require('../controllers/exerciseController');
const { uploadMedia } = require('../middleware/uploadMiddleware');

const exerciseUpload = uploadMedia.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'demoVideo', maxCount: 1 },
  { name: 'bgImage', maxCount: 1 },
  { name: 'frameDesign', maxCount: 1 },
  { name: 'bgMusic', maxCount: 1 },
  { name: 'voiceGuidance', maxCount: 1 }
]);

router.get('/', getExercises);
router.get('/:id', getExerciseById);
router.post('/', exerciseUpload, createExercise);
router.put('/:id', exerciseUpload, updateExercise);
router.delete('/:id', deleteExercise);

module.exports = router;
