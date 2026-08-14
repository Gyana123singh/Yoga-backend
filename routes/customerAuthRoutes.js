const express = require('express');
const router = express.Router();
const { googleLogin, adminLogin, getAdminMe, getMe, updateProfile, logout } = require('../controllers/customerAuthController');
const { protectCustomer, protectAdmin } = require('../middleware/authMiddleware');

// Public routes: Google Auth & Admin Login
router.post('/google-login', googleLogin);
router.post('/google', googleLogin); // Alias route
router.post('/admin-login', adminLogin);

// Protected Admin Session route
router.get('/admin-me', protectAdmin, getAdminMe);

// Protected Customer routes (Requires Authorization: Bearer <token>)
router.get('/me', protectCustomer, getMe);
router.put('/profile', protectCustomer, updateProfile);
router.post('/logout', protectCustomer, logout);

module.exports = router;

