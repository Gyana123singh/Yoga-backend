const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    if (!token) {
      // Allow guest socket connections for public store & real-time updates
      socket.user = { id: 'guest_user', _id: 'guest_user' };
      socket.join('user:guest_user');
      return next();
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
    socket.user = { id: 'guest_user', _id: 'guest_user' };
    socket.join('user:guest_user');
    return next();
  }
};

module.exports = socketAuth;
