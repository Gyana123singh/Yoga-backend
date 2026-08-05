const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/asanas', require('./routes/asanaRoutes'));
app.use('/api/breathing', require('./routes/breathingRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/ai-generator', require('./routes/aiGeneratorRoutes'));
app.use('/api/practices', require('./routes/practiceRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

// Health check root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'AURA Yoga Admin Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/dashboard/stats',
      '/api/users',
      '/api/asanas',
      '/api/breathing',
      '/api/recommendations',
      '/api/ai-generator/generate',
      '/api/ai-generator/coaches',
      '/api/practices',
      '/api/subscriptions/summary',
      '/api/subscriptions/coupons',
      '/api/health',
      '/api/settings',
      '/api/seed'
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
