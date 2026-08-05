const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  validUntil: { type: String, required: true },
  maxRedemptions: { type: Number, default: 500 },
  redemptionsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
  planTier: { type: String, default: 'All Plans' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
