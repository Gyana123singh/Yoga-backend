const express = require('express');
const router = express.Router();
const {
  getNotifications,
  sendRealtimeNotification,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

router.get('/', getNotifications);
router.post('/send-realtime', sendRealtimeNotification);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
