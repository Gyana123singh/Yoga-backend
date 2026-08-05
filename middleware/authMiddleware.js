const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyFirebaseIdToken } = require('../config/firebaseAdmin');

const protectCustomer = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No bearer token provided.'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'aura_yoga_jwt_secret_key_2026';
    let decodedUser = null;

    // 1. Try verifying as Session JWT token
    try {
      const decodedJwt = jwt.verify(token, JWT_SECRET);
      if (decodedJwt && decodedJwt.id) {
        decodedUser = await User.findOne({ id: decodedJwt.id }) || await User.findById(decodedJwt.id);
      }
    } catch (jwtErr) {
      // Token is not a session JWT, try verifying as Firebase ID token next
    }

    // 2. If session JWT didn't match, verify as Firebase ID token
    if (!decodedUser) {
      try {
        const decodedFirebase = await verifyFirebaseIdToken(token);
        if (decodedFirebase) {
          decodedUser = await User.findOne({
            $or: [
              { firebaseUid: decodedFirebase.uid },
              { email: decodedFirebase.email }
            ]
          });
          req.firebasePayload = decodedFirebase;
        }
      } catch (firebaseErr) {
        console.error('Firebase token verification error in middleware:', firebaseErr.message);
      }
    }

    if (!decodedUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid, expired, or unauthenticated session token.'
      });
    }

    if (decodedUser.status === 'Suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Please contact support.'
      });
    }

    req.user = decodedUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message
    });
  }
};

module.exports = {
  protectCustomer
};
