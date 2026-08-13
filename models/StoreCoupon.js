const mongoose = require('mongoose');

const storeCouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true }, // e.g. 10 for 10% or 100 for ₹100
  minOrderAmount: { type: Number, default: 0 },
  validUntil: { type: Date, default: null },
  maxRedemptions: { type: Number, default: 1000 },
  redemptionsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Expired', 'Disabled'], default: 'Active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoreCoupon', storeCouponSchema);
