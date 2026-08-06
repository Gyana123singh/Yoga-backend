const { Server } = require('socket.io');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ [Socket.io] Client connected: ${socket.id}`);

    // Join room for feelings / session updates
    socket.on('join_feeling_room', (feeling) => {
      socket.join(`feeling_${feeling}`);
      console.log(`[Socket.io] Socket ${socket.id} joined room: feeling_${feeling}`);
    });

    socket.on('disconnect', () => {
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
