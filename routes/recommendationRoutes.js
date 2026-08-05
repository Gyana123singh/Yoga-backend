const express = require('express');
const router = express.Router();
const {
  getRecommendationRules,
  createRecommendationRule,
  updateRecommendationRule,
  deleteRecommendationRule
} = require('../controllers/recommendationController');

router.route('/')
  .get(getRecommendationRules)
  .post(createRecommendationRule);

router.route('/:id')
  .put(updateRecommendationRule)
  .delete(deleteRecommendationRule);

module.exports = router;
