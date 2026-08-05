const express = require('express');
const router = express.Router();
const {
  getHomeFeed,
  generatePersonalSession,
  toggleScheduleItem,
  logPracticeCompletion,
  searchHome
} = require('../controllers/customerHomeController');
const { protectCustomer } = require('../middleware/authMiddleware');

// Middleware to attach user if token present, but allow guest access
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protectCustomer(req, res, next);
  }
  next();
};

// Customer Home Section Routes
router.get('/', optionalAuth, getHomeFeed);
router.post('/personal-session', optionalAuth, generatePersonalSession);
router.put('/schedule/:itemId/toggle', optionalAuth, toggleScheduleItem);
router.post('/log-practice', optionalAuth, logPracticeCompletion);
router.get('/search', searchHome);

module.exports = router;
