const mongoose = require('mongoose');

const storeProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreCategory', required: true },
  categorySlug: { type: String, default: '' },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  badgeTag: { type: String, default: '' }, // 'BESTSELLER', 'HOT', 'NEW', 'OFFERS'
  images: [{ type: String }],
  material: { type: String, default: 'Cotton' },
  tech: { type: String, default: 'Bio Wash' },
  colors: [{
    name: { type: String, default: 'Default' },
    imageUrl: { type: String, default: '' },
    hexCode: { type: String, default: '#000000' }
  }],
  sizes: [{ type: String, default: 'M' }], // ['S', 'M', 'L', 'XL', 'XXL']
  stockCount: { type: Number, default: 50 },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 12 },
  materialsCare: { type: String, default: '100% Premium Bio-Washed Cotton. Machine wash cold with like colors. Tumble dry low or line dry in shade. Do not bleach or dry clean.' },
  additionalInfo: { type: String, default: 'Country of Origin: India. Net Quantity: 1 N. Manufactured & Packed by YogaPrana Wellness Pvt. Ltd.' },
  reviews: [{
    userName: { type: String, required: true },
    isVerifiedBuyer: { type: Boolean, default: true },
    date: { type: String, default: 'Recently' },
    rating: { type: Number, default: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true }
  }],
  applicableCoupon: { type: String, default: 'YOGA10' },
  couponDiscountPrice: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Auto-calculate discount percentage before saving
storeProductSchema.pre('save', function () {
  if (this.mrp > 0 && this.price > 0 && this.mrp > this.price) {
    this.discountPercent = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
});

module.exports = mongoose.model('StoreProduct', storeProductSchema);
