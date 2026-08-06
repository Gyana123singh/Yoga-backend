const Notification = require('../models/Notification');
const { getSocketIO } = require('../config/socket');

/**
 * @desc    Get all notifications for Customer
 * @route   GET /api/notifications
 * @access  Public / Customer
 */
const getNotifications = async (req, res) => {
  try {
    const { recipientType, userId } = req.query;
    let query = {};

    if (recipientType) {
      query.recipientType = recipientType;
    }

    if (userId) {
      query.$or = [{ recipientType: 'ALL_CUSTOMERS' }, { userId }];
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Send Real-Time Notification Broadcast to Mobile Apps (Admin)
 * @route   POST /api/notifications/send-realtime
 * @access  Admin
 */
const sendRealtimeNotification = async (req, res) => {
  try {
    const {
      title,
      body,
      type,
      recipientType,
      userId,
      imageUrl,
      actionRoute
    } = req.body;

    const newNotification = new Notification({
      title: title || 'Practice Reminder',
      body: body || 'Time for your daily mindfulness flow!',
      type: type || 'PRACTICE_REMINDER',
      recipientType: recipientType || 'ALL_CUSTOMERS',
      userId: userId || null,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
      actionRoute: actionRoute || '/explore',
      isRead: false,
      deliveryStatus: 'DELIVERED_VIA_WEBSOCKETS'
    });

    try {
      await newNotification.save();
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        await Notification.collection.dropIndex('id_1').catch(() => {});
        await newNotification.save();
      } else {
        throw saveErr;
      }
    }

    // Broadcast Real-Time Event to connected Flutter Mobile App Clients via Socket.io
    const io = getSocketIO();
    if (io) {
      io.emit('customer_notification', {
        id: newNotification._id,
        title: newNotification.title,
        body: newNotification.body,
        type: newNotification.type,
        recipientType: newNotification.recipientType,
        imageUrl: newNotification.imageUrl,
        actionRoute: newNotification.actionRoute,
        timestamp: newNotification.createdAt
      });
      console.log(`⚡ [Socket.io] Emitted customer_notification real-time broadcast: "${newNotification.title}"`);
    }

    res.status(201).json({
      success: true,
      message: 'Real-Time Notification broadcasted to connected mobile apps!',
      data: newNotification
    });
  } catch (error) {
    console.error('Error in sendRealtimeNotification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Mark Notification as Read
 * @route   PUT /api/notifications/:id/read
 * @access  Public / Customer
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Notification (Admin)
 * @route   DELETE /api/notifications/:id
 * @access  Admin
 */
const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  sendRealtimeNotification,
  markAsRead,
  deleteNotification
};
