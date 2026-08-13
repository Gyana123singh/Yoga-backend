const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const SmartwatchDevice = require('../models/SmartwatchDevice');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  // Attach JWT Authentication & Room Join Middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    const userIdStr = socket.user?._id ? socket.user._id.toString() : (socket.user?.id || 'dev_user');
    console.log(`⚡ [Socket.io] Client connected: ${socket.id} (User Room: user:${userIdStr})`);

    // Automatically join authenticated user room
    socket.join(`user:${userIdStr}`);

    // Join feeling / session room
    socket.on('join_feeling_room', (feeling) => {
      socket.join(`feeling_${feeling}`);
    });

    // Join device room for device-specific commands (Wear OS / watch app)
    socket.on('smartwatch:join-device-room', (deviceId) => {
      if (deviceId) {
        socket.join(`device:${deviceId}`);
        console.log(`⌚ [Socket.io] Socket ${socket.id} joined device room: device:${deviceId}`);
      }
    });

    // Handle live heart-rate / telemetry tick (Broadcast ONLY to user room, do NOT persist each tick to DB)
    socket.on('smartwatch:telemetry', (payload) => {
      const { deviceId, bpm, ibi, targetZone, timestamp } = payload || {};
      
      const liveTick = {
        userId: userIdStr,
        deviceId: deviceId || 'UNKNOWN_WATCH',
        bpm: bpm || 72,
        ibi: ibi || 750,
        targetZone: targetZone || 'Flow Zone',
        timestamp: timestamp || new Date().toISOString()
      };

      // Emit strictly to authenticated user's room
      io.to(`user:${userIdStr}`).emit('smartwatch:telemetry', liveTick);
    });

    // Handle session completion vibration trigger (Scoped to device room)
    socket.on('smartwatch:vibrate-completion', (data) => {
      const { deviceId, sessionId, sessionTitle, pattern } = data || {};
      if (deviceId) {
        io.to(`device:${deviceId}`).emit('smartwatch:vibrate-completion', {
          deviceId,
          sessionId,
          sessionTitle: sessionTitle || 'Yoga Practice',
          pattern: pattern || [300, 150, 300, 150, 600]
        });
      } else {
        io.to(`user:${userIdStr}`).emit('smartwatch:vibrate-completion', data);
      }
    });

    // Handle Yoga Pose Guidance instructions pushed to watch screen
    socket.on('smartwatch:pose-guidance', (poseData) => {
      const { deviceId, pose, instruction, durationSeconds } = poseData || {};
      if (deviceId) {
        io.to(`device:${deviceId}`).emit('smartwatch:pose-guidance', {
          deviceId,
          pose,
          instruction,
          durationSeconds
        });
      }
    });

    // Connection Heartbeat Handler from Flutter/Wear OS app
    socket.on('smartwatch:heartbeat', async (data) => {
      const { deviceId } = data || {};
      if (deviceId) {
        socket.join(`device:${deviceId}`);
        try {
          await SmartwatchDevice.findOneAndUpdate(
            { deviceId, userId: socket.user._id || socket.user.id },
            { isConnected: true, lastSeenAt: new Date() }
          );
        } catch (dbErr) {
          console.warn('[Smartwatch Heartbeat Error]:', dbErr.message);
        }
      }
    });

    socket.on('disconnect', async () => {
      console.log(`⚡ [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getSocketIO = () => {
  if (!io) {
    console.warn('[Socket.io] Socket.io not initialized yet!');
  }
  return io;
};

module.exports = { initSocket, getSocketIO };
