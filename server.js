const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io Real-time WebSocket Server
initSocket(server);

// Enhanced CORS Middleware & Preflight Handler
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['*'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));



// Serve uploaded video files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/customerAuthRoutes'));
app.use('/api/customer/home', require('./routes/customerHomeRoutes'));
app.use('/api/daily-needs', require('./routes/dailyNeedRoutes'));
app.use('/api/daily-schedule', require('./routes/dailyScheduleRoutes'));
app.use('/api/quick-practices', require('./routes/quickPracticeRoutes'));
app.use('/api/yoga-programs', require('./routes/yogaProgramRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/asanas', require('./routes/asanaRoutes'));
app.use('/api/breathing', require('./routes/breathingRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/ai-generator', require('./routes/aiGeneratorRoutes'));
app.use('/api/practices', require('./routes/practiceRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/smartwatch', require('./routes/smartwatchRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

// Health check root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'AURA Yoga API with Socket.io Real-time & Video Upload Engine',
    version: '1.2.0',
    socketEnabled: true,
    endpoints: [
      'GET /api/daily-needs/config',
      'POST /api/daily-needs/resolve-session',
      'GET /api/videos',
      'POST /api/videos/upload',
      'POST /api/customer/home/log-practice'
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack || err);
  res.header('Access-Control-Allow-Origin', '*');
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File payload too large. Maximum file upload limit is 100MB.'
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server with Socket.io running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
