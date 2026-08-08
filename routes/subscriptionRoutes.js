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
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  createPaypalOrder,
  capturePaypalOrder
} = require('../controllers/subscriptionController');

router.get('/summary', getSubscriptionsSummary);
router.get('/plans', getPlans);
router.post('/apply-coupon', applyCoupon);
router.post('/subscribe', subscribeUser);

// Razorpay Payment Gateway Routes (UPI, Cards, NetBanking, Wallets)
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-razorpay-signature', verifyRazorpayPayment);
router.post('/razorpay-webhook', handleRazorpayWebhook);

// PayPal Gateway Routes
router.post('/create-paypal-order', createPaypalOrder);
router.post('/capture-paypal-order', capturePaypalOrder);

router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);
router.delete('/coupons/:code', deleteCoupon);

module.exports = router;
