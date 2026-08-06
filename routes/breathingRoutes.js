const express = require('express');
const router = express.Router();
const {
  getBreathingTechniques,
  getBreathingTechniqueById,
  createBreathingTechnique,
  updateBreathingTechnique,
  deleteBreathingTechnique
} = require('../controllers/breathingController');
const { uploadMedia } = require('../middleware/uploadMiddleware');

const breathingUpload = uploadMedia.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'demoVideo', maxCount: 1 },
  { name: 'bgImage', maxCount: 1 },
  { name: 'frameDesign', maxCount: 1 },
  { name: 'bgMusic', maxCount: 1 }
]);

router.get('/', getBreathingTechniques);
router.get('/:id', getBreathingTechniqueById);
router.post('/', breathingUpload, createBreathingTechnique);
router.put('/:id', breathingUpload, updateBreathingTechnique);
router.delete('/:id', deleteBreathingTechnique);

module.exports = router;
