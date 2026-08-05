const express = require('express');
const router = express.Router();
const {
  getBreathingTechniques,
  createBreathingTechnique,
  updateBreathingTechnique,
  deleteBreathingTechnique
} = require('../controllers/breathingController');

router.route('/')
  .get(getBreathingTechniques)
  .post(createBreathingTechnique);

router.route('/:id')
  .put(updateBreathingTechnique)
  .delete(deleteBreathingTechnique);

module.exports = router;
