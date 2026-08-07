const express = require('express');
const router = express.Router();
const {
  getSubscriptionsSummary,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getPlans,
  applyCoupon,
  subscribeUser,
  createStripePaymentIntent,
  confirmStripePayment,
  handleStripeWebhook
} = require('../controllers/subscriptionController');

router.get('/summary', getSubscriptionsSummary);
router.get('/plans', getPlans);
router.post('/apply-coupon', applyCoupon);
router.post('/subscribe', subscribeUser);

// Stripe Payment Gateway Routes
router.post('/create-payment-intent', createStripePaymentIntent);
router.post('/confirm-payment', confirmStripePayment);
router.post('/webhook', handleStripeWebhook);

router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);
router.delete('/coupons/:code', deleteCoupon);

module.exports = router;
