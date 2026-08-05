const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { MOCK_COUPONS } = require('../utils/seedData');

const getSubscriptionsSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments() || 148520;
    const premiumUsers = await User.countDocuments({ planType: 'Premium' }) || 48910;
    const freeUsers = totalUsers - premiumUsers;

    const summary = {
      mrr: '$348,900',
      arr: '$4.18M',
      activeSubscribers: premiumUsers,
      freeTrialUsers: freeUsers,
      churnRate: '1.4%',
      conversionRate: '32.9%',
      avgRevenuePerUser: '$7.13',
      plansBreakdown: [
        { name: 'Pro Annual ($149/yr)', subscribers: 31200, percentage: 64, revenue: '$260,000/mo eq.' },
        { name: 'Monthly Pro ($14.99/mo)', subscribers: 17710, percentage: 36, revenue: '$88,900/mo' },
      ]
    };

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    let coupons = await Coupon.find().sort({ createdAt: -1 });
    if (coupons.length === 0) {
      coupons = MOCK_COUPONS;
    }
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, validUntil, maxRedemptions, planTier } = req.body;
    const coupon = new Coupon({
      code: code ? code.toUpperCase() : `YOGA${Math.floor(100 + Math.random() * 900)}`,
      discountPercent: Number(discountPercent),
      validUntil: validUntil || '2026-12-31',
      maxRedemptions: Number(maxRedemptions) || 500,
      planTier: planTier || 'All Plans',
      status: 'Active'
    });

    const saved = await coupon.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({ code: req.params.code }) || await Coupon.findByIdAndDelete(req.params.code);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, message: 'Coupon removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubscriptionsSummary,
  getCoupons,
  createCoupon,
  deleteCoupon
};
