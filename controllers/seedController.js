const User = require('../models/User');
const Asana = require('../models/Asana');
const Breathing = require('../models/Breathing');
const RecommendationRule = require('../models/RecommendationRule');
const LiveClass = require('../models/LiveClass');
const HealthSync = require('../models/HealthSync');
const Coupon = require('../models/Coupon');
const Setting = require('../models/Setting');
const {
  MOCK_USERS,
  MOCK_ASANAS,
  MOCK_BREATHING_TECHNIQUES,
  MOCK_RECOMMENDATIONS_RULES,
  MOCK_LIVE_CLASSES,
  MOCK_SMARTWATCH_STATS,
  MOCK_COUPONS
} = require('../utils/seedData');

const runSeeder = async () => {
  await User.deleteMany({});
  await Asana.deleteMany({});
  await Breathing.deleteMany({});
  await RecommendationRule.deleteMany({});
  await LiveClass.deleteMany({});
  await HealthSync.deleteMany({});
  await Coupon.deleteMany({});
  await Setting.deleteMany({});

  await User.insertMany(MOCK_USERS);
  await Asana.insertMany(MOCK_ASANAS);
  await Breathing.insertMany(MOCK_BREATHING_TECHNIQUES);
  await RecommendationRule.insertMany(MOCK_RECOMMENDATIONS_RULES);
  await LiveClass.insertMany(MOCK_LIVE_CLASSES);
  await HealthSync.insertMany(MOCK_SMARTWATCH_STATS);
  await Coupon.insertMany(MOCK_COUPONS);
  await Setting.create({
    siteName: 'AURA Yoga & Mindfulness Platform',
    aiModelVersion: 'v2.4-NeuralFlow',
    stripeKeyConfig: 'pk_live_51M**********************',
    healthKitEnabled: true,
    telemetrySyncInterval: '15 mins',
    maxAiTokensPerUser: 50000,
    emailAlertsEnabled: true,
    maintenanceMode: false
  });
};

const seedDatabase = async (req, res) => {
  try {
    await runSeeder();
    res.json({ success: true, message: 'Database successfully seeded with initial mock data!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { seedDatabase, runSeeder };
