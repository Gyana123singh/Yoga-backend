const mongoose = require('mongoose');

const storeCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  badgeTag: { type: String, default: '' }, // e.g. 'NEW', 'HOT', 'BESTSELLER'
  imageUrl: { type: String, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoreCategory', storeCategorySchema);
