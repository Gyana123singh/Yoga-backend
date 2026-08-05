const express = require('express');
const router = express.Router();
const {
  generateAIPractice,
  getAICoaches,
  createAICoach
} = require('../controllers/aiGeneratorController');

router.post('/generate', generateAIPractice);
router.route('/coaches')
  .get(getAICoaches)
  .post(createAICoach);

module.exports = router;
