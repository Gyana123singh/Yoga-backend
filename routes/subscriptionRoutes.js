const express = require('express');
const router = express.Router();
const {
  getSubscriptionsSummary,
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/subscriptionController');

router.get('/summary', getSubscriptionsSummary);
router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);
router.delete('/coupons/:code', deleteCoupon);

module.exports = router;
