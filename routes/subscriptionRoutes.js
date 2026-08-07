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
  handleStripeWebhook,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPaypalOrder,
  capturePaypalOrder
} = require('../controllers/subscriptionController');

router.get('/summary', getSubscriptionsSummary);
router.get('/plans', getPlans);
router.post('/apply-coupon', applyCoupon);
router.post('/subscribe', subscribeUser);

// Stripe Payment Gateway Routes
router.post('/create-payment-intent', createStripePaymentIntent);
router.post('/confirm-payment', confirmStripePayment);
router.post('/webhook', handleStripeWebhook);

// Razorpay Gateway Routes (UPI, NetBanking, Cards)
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-razorpay-signature', verifyRazorpayPayment);

// PayPal Gateway Routes
router.post('/create-paypal-order', createPaypalOrder);
router.post('/capture-paypal-order', capturePaypalOrder);

router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);
router.delete('/coupons/:code', deleteCoupon);

module.exports = router;
