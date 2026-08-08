const User = require('../models/User');
const Asana = require('../models/Asana');
const Breathing = require('../models/Breathing');
const RecommendationRule = require('../models/RecommendationRule');
const LiveClass = require('../models/LiveClass');
const HealthSync = require('../models/HealthSync');
const Coupon = require('../models/Coupon');
const Setting = require('../models/Setting');
const Feeling = require('../models/Feeling');
const FocusArea = require('../models/FocusArea');
const DurationOption = require('../models/DurationOption');
const DailySessionConfig = require('../models/DailySessionConfig');
const QuickPractice = require('../models/QuickPractice');
const YogaProgram = require('../models/YogaProgram');
const DailySchedule = require('../models/DailySchedule');
const Exercise = require('../models/Exercise');
const Ticket = require('../models/Ticket');
const {
  MOCK_USERS,
  MOCK_ASANAS,
  MOCK_BREATHING_TECHNIQUES,
  MOCK_RECOMMENDATIONS_RULES,
  MOCK_LIVE_CLASSES,
  MOCK_SMARTWATCH_STATS,
  MOCK_COUPONS,
  MOCK_FEELINGS,
  MOCK_FOCUS_AREAS,
  MOCK_DURATIONS,
  MOCK_SESSION_CONFIGS,
  MOCK_QUICK_PRACTICES,
  MOCK_YOGA_PROGRAMS,
  MOCK_DAILY_SCHEDULES,
  MOCK_EXERCISES,
  MOCK_TICKETS
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
  await Feeling.deleteMany({});
  await FocusArea.deleteMany({});
  await DurationOption.deleteMany({});
  await DailySessionConfig.deleteMany({});
  await QuickPractice.deleteMany({});
  await YogaProgram.deleteMany({});
  await DailySchedule.deleteMany({});
  await Exercise.deleteMany({});
  await Ticket.deleteMany({});

  await User.insertMany(MOCK_USERS);
  await Asana.insertMany(MOCK_ASANAS);
  await Breathing.insertMany(MOCK_BREATHING_TECHNIQUES);
  await RecommendationRule.insertMany(MOCK_RECOMMENDATIONS_RULES);
  await LiveClass.insertMany(MOCK_LIVE_CLASSES);
  await HealthSync.insertMany(MOCK_SMARTWATCH_STATS);
  await Coupon.insertMany(MOCK_COUPONS);
  await Feeling.insertMany(MOCK_FEELINGS);
  await FocusArea.insertMany(MOCK_FOCUS_AREAS);
  await DurationOption.insertMany(MOCK_DURATIONS);
  await DailySessionConfig.insertMany(MOCK_SESSION_CONFIGS);
  await QuickPractice.insertMany(MOCK_QUICK_PRACTICES);
  await YogaProgram.insertMany(MOCK_YOGA_PROGRAMS);
  await DailySchedule.insertMany(MOCK_DAILY_SCHEDULES);
  await Exercise.insertMany(MOCK_EXERCISES);
  await Ticket.insertMany(MOCK_TICKETS);
  await DailySchedule.insertMany(MOCK_DAILY_SCHEDULES);
  await Exercise.insertMany(MOCK_EXERCISES);

  await Setting.create({
    siteName: 'AURA Yoga & Mindfulness Platform',
    aiModelVersion: 'v2.4-NeuralFlow',
    razorpayKeyConfig: 'rzp_test_51Pq349YogaKey2026',
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
