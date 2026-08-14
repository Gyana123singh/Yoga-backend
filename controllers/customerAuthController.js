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
    let { idToken, token, fcmToken, primaryGoal, country, language, email, name, avatar, picture, uid, googleId } = req.body;

    let targetUid = uid || googleId || req.body.user?.uid || req.body.user?.id || req.body.profile?.id || req.body.data?.uid;
    let targetEmail = email || req.body.user?.email || req.body.profile?.email || req.body.data?.email;
    let targetName = name || req.body.user?.name || req.body.user?.displayName || req.body.profile?.name || req.body.data?.name;
    let targetPicture = avatar || picture || req.body.user?.photoURL || req.body.user?.picture || req.body.profile?.picture;

    const rawToken = idToken || token;

    if (rawToken) {
      try {
        const decodedToken = await verifyFirebaseIdToken(rawToken);
        if (decodedToken && (decodedToken.uid || decodedToken.email)) {
          targetUid = decodedToken.uid || targetUid;
          targetEmail = decodedToken.email || targetEmail;
          targetName = decodedToken.name || targetName;
          targetPicture = decodedToken.picture || targetPicture;
        }
      } catch (tokenErr) {
        console.warn('Firebase ID Token Verification Notice:', tokenErr.message);
      }
    }

    // Fallback to Bearer token in Authorization header if token not in body
    if (!targetEmail && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const bearerToken = req.headers.authorization.split(' ')[1];
      try {
        const decodedToken = await verifyFirebaseIdToken(bearerToken);
        if (decodedToken && (decodedToken.uid || decodedToken.email)) {
          targetUid = decodedToken.uid || targetUid;
          targetEmail = decodedToken.email || targetEmail;
          targetName = decodedToken.name || targetName;
          targetPicture = decodedToken.picture || targetPicture;
        }
      } catch (e) {}
    }

    if (!targetEmail) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address or Google authentication token is required'
      });
    }

    const cleanEmail = targetEmail.trim().toLowerCase();
    targetUid = targetUid || `google_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Search for existing user by firebaseUid or email
    let user = await User.findOne({
      $or: [
        { firebaseUid: targetUid },
        { email: cleanEmail }
      ]
    });

    let isNewUser = false;

    if (!user) {
      // Create new Customer User record in MongoDB
      isNewUser = true;
      const customId = `USR-${Math.floor(100000 + Math.random() * 900000)}`;

      user = new User({
        id: customId,
        firebaseUid: targetUid,
        name: targetName || cleanEmail.split('@')[0],
        email: cleanEmail,
        avatar: targetPicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        authProvider: 'google',
        isEmailVerified: true,
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
      user.firebaseUid = targetUid;
      user.authProvider = 'google';
      user.lastLoginAt = new Date();

      if (targetName && (!user.name || user.name.includes('User'))) {
        user.name = targetName;
      }
      if (targetPicture && (!user.avatar || user.avatar.includes('unsplash'))) {
        user.avatar = targetPicture;
      }
      if (fcmToken) {
        user.fcmToken = fcmToken;
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

    const sessionToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '30d' });

    return res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created and authenticated successfully' : 'Login successful',
      isNewUser,
      token: sessionToken,
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

