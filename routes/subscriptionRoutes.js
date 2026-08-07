const express = require('express');
const router = express.Router();
const {
  getSubscriptionsSummary,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getPlans,
  applyCoupon,
  subscribeUser
} = require('../controllers/subscriptionController');

router.get('/summary', getSubscriptionsSummary);
router.get('/plans', getPlans);
router.post('/apply-coupon', applyCoupon);
router.post('/subscribe', subscribeUser);

router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);
router.delete('/coupons/:code', deleteCoupon);

module.exports = router;
