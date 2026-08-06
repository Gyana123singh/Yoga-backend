const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: {
    type: String,
    enum: ['PRACTICE_REMINDER', 'NEW_PROGRAM', 'ANNOUNCEMENT', 'GOAL_ACHIEVED'],
    default: 'PRACTICE_REMINDER'
  },
  recipientType: {
    type: String,
    enum: ['ALL_CUSTOMERS', 'SINGLE_CUSTOMER'],
    default: 'ALL_CUSTOMERS'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop'
  },
  actionRoute: { type: String, default: '/explore' },
  isRead: { type: Boolean, default: false },
  deliveryStatus: { type: String, default: 'DELIVERED_VIA_WEBSOCKETS' }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

// Auto-drop stale id_1 index if present
Notification.collection.dropIndex('id_1').catch(() => {});

module.exports = Notification;
