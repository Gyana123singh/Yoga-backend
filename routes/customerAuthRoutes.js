const express = require('express');
const router = express.Router();
const { googleLogin, getMe, updateProfile, logout } = require('../controllers/customerAuthController');
const { protectCustomer } = require('../middleware/authMiddleware');

// Public route: Google Auth with Firebase ID Token
router.post('/google-login', googleLogin);
router.post('/google', googleLogin); // Alias route

// Protected routes (Requires Authorization: Bearer <token>)
router.get('/me', protectCustomer, getMe);
router.put('/profile', protectCustomer, updateProfile);
router.post('/logout', protectCustomer, logout);

module.exports = router;
