const mongoose = require('mongoose');

const storeOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  shippingAddress: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreProduct' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    selectedColor: { type: String, default: '' },
    selectedSize: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
  }],
  subtotal: { type: Number, required: true },
  couponCode: { type: String, default: '' },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Paid' },
  orderStatus: { type: String, enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Placed' }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoreOrder', storeOrderSchema);
