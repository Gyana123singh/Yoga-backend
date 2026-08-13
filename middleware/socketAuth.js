const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    if (!token) {
      // In development mode, allow anonymous socket connections with fallback ID
      if (process.env.NODE_ENV === 'development' || process.env.SMARTWATCH_SIMULATION === 'true') {
        socket.user = { id: 'dev_anonymous_user', _id: 'dev_anonymous_user' };
        socket.join('user:dev_anonymous_user');
        return next();
      }

      return next(new Error('Authentication error: Missing JWT token'));
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'aura_yoga_jwt_secret_key_2026';
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id) || await User.findOne({ id: decoded.id });
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    const userIdStr = user._id ? user._id.toString() : user.id;
    socket.join(`user:${userIdStr}`);
    
    console.log(`🔒 [Socket.io Auth] Socket ${socket.id} authenticated for User: ${userIdStr}`);
    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'development' || process.env.SMARTWATCH_SIMULATION === 'true') {
      socket.user = { id: 'dev_fallback_user', _id: 'dev_fallback_user' };
      socket.join('user:dev_fallback_user');
      return next();
    }
    return next(new Error('Authentication error: Invalid or expired token'));
  }
};

module.exports = socketAuth;
