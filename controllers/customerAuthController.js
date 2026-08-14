const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyFirebaseIdToken } = require('../config/firebaseAdmin');

const JWT_SECRET = process.env.JWT_SECRET || 'aura_yoga_jwt_secret_key_2026';

/**
 * @desc    Authenticate customer via Google Firebase ID Token (Mobile Application)
 * @route   POST /api/auth/google-login
 * @access  Public
 */
const googleLogin = async (req, res) => {
  try {
    let { idToken, fcmToken, primaryGoal, country, language } = req.body;

    // Check if token was provided in Authorization header instead of body
    if (!idToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      idToken = req.headers.authorization.split(' ')[1];
    }

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'idToken is required for Google Firebase authentication'
      });
    }

    // Verify Firebase ID Token
    const decodedToken = await verifyFirebaseIdToken(idToken);
    
    if (!decodedToken || (!decodedToken.uid && !decodedToken.email)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase ID token'
      });
    }

    const { uid, email, name, picture, email_verified } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Firebase user account does not contain a valid email address'
      });
    }

    // Search for existing user by firebaseUid or email
    let user = await User.findOne({
      $or: [
        { firebaseUid: uid },
        { email: email.toLowerCase() }
      ]
    });

    let isNewUser = false;

    if (!user) {
      // Create new Customer User record in MongoDB
      isNewUser = true;
      const customId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

      user = new User({
        id: customId,
        firebaseUid: uid,
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        avatar: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        authProvider: 'google',
        isEmailVerified: email_verified ?? true,
        planType: 'Free',
        plan: 'Starter Free',
        status: 'Active',
        primaryGoal: primaryGoal || 'General Wellness & Mindfulness',
        country: country || 'United States',
        language: language || 'English',
        fcmToken: fcmToken || null,
        streak: 1,
        totalMinutes: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastLoginAt: new Date()
      });

      await user.save();
    } else {
      // Update existing user details
      user.firebaseUid = uid;
      user.authProvider = 'google';
      user.lastLoginAt = new Date();

      if (picture && (!user.avatar || user.avatar.includes('unsplash'))) {
        user.avatar = picture;
      }
      if (fcmToken) {
        user.fcmToken = fcmToken;
      }
      if (email_verified !== undefined) {
        user.isEmailVerified = email_verified;
      }

      await user.save();
    }

    // Emit Real-Time Socket.io event to Admin Dashboard
    try {
      const { getSocketIO } = require('../config/socket');
      const io = getSocketIO();
      if (io) {
        io.emit('user:new', user);
        io.emit('user_registered', user);
      }
    } catch (e) {
      console.warn('Socket emit on googleLogin warning:', e.message);
    }

    // Generate Mobile App Session JWT
    const tokenPayload = {
      id: user.id,
      mongoId: user._id,
      email: user.email,
      firebaseUid: user.firebaseUid
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '30d' });

    return res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created and authenticated successfully' : 'Login successful',
      isNewUser,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        planType: user.planType,
        plan: user.plan,
        primaryGoal: user.primaryGoal,
        streak: user.streak,
        totalMinutes: user.totalMinutes,
        country: user.country,
        language: user.language,
        fcmToken: user.fcmToken,
        joinedDate: user.joinedDate,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Google Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate Google user',
      error: error.message
    });
  }
};

/**
 * @desc    Get currently logged in customer profile
 * @route   GET /api/auth/me
 * @access  Private (Customer)
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update customer mobile profile
 * @route   PUT /api/auth/profile
 * @access  Private (Customer)
 */
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, primaryGoal, country, language, avatar, fcmToken, devicesConnected } = req.body;

    if (name) user.name = name;
    if (primaryGoal) user.primaryGoal = primaryGoal;
    if (country) user.country = country;
    if (language) user.language = language;
    if (avatar) user.avatar = avatar;
    if (fcmToken !== undefined) user.fcmToken = fcmToken;
    if (devicesConnected) user.devicesConnected = devicesConnected;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * @desc    Logout customer user session / unregister FCM token
 * @route   POST /api/auth/logout
 * @access  Private (Customer)
 */
const logout = async (req, res) => {
  try {
    const user = req.user;
    user.fcmToken = null;
    await user.save();

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate Admin via Email & Password (Dashboard)
 * @route   POST /api/auth/admin-login
 * @access  Public
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Fetch credentials from .env with fallback defaults
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@aura.io').trim().toLowerCase();
    const envAdminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();

    // Verify provided credentials against environment configuration
    if (cleanEmail !== envAdminEmail || cleanPassword !== envAdminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin email or password. Access denied.'
      });
    }

    // Credentials verified! Search for existing Admin or create default admin record
    let adminUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { authProvider: 'admin' },
        { id: 'USR-ADMIN-01' }
      ]
    });

    if (!adminUser) {
      adminUser = new User({
        id: 'USR-ADMIN-01',
        name: 'Yoga Fitness Admin',
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        authProvider: 'admin',
        planType: 'Premium',
        plan: 'Executive Unlimited',
        status: 'Active',
        primaryGoal: 'Executive Studio Operations',
        isEmailVerified: true
      });
      await adminUser.save();
    } else {
      adminUser.lastLoginAt = new Date();
      adminUser.status = 'Active';
      await adminUser.save();
    }

    // Generate Admin Session JWT
    const token = jwt.sign(
      { id: adminUser.id, mongoId: adminUser._id, email: adminUser.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      data: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        avatar: adminUser.avatar,
        role: 'Super Administrator',
        status: adminUser.status
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin authentication',
      error: error.message
    });
  }
};

/**
 * @desc    Get currently logged in admin session profile
 * @route   GET /api/auth/admin-me
 * @access  Private (Admin)
 */
const getAdminMe = async (req, res) => {
  try {
    const adminUser = req.admin || req.user;
    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'No authenticated admin session found'
      });
    }

    res.json({
      success: true,
      data: {
        id: adminUser.id || 'USR-ADMIN-01',
        name: adminUser.name || 'Yoga Fitness Admin',
        email: adminUser.email,
        avatar: adminUser.avatar,
        role: 'Super Administrator',
        status: adminUser.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      error: error.message
    });
  }
};

module.exports = {
  googleLogin,
  adminLogin,
  getAdminMe,
  getMe,
  updateProfile,
  logout
};

