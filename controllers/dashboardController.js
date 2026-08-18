const User = require('../models/User');
const Asana = require('../models/Asana');
const Breathing = require('../models/Breathing');
const RecommendationRule = require('../models/RecommendationRule');
const LiveClass = require('../models/LiveClass');
const HealthSync = require('../models/HealthSync');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsersCount = await User.countDocuments({ authProvider: { $ne: 'admin' }, id: { $ne: 'USR-ADMIN-01' } }) || 148520;
    const premiumUsersCount = await User.countDocuments({ planType: 'Premium', authProvider: { $ne: 'admin' }, id: { $ne: 'USR-ADMIN-01' } }) || 48910;
    const asanaCount = await Asana.countDocuments() || 250;
    const breathingCount = await Breathing.countDocuments() || 45;
    const activeRulesCount = await RecommendationRule.countDocuments({ status: 'Active' }) || 18;
    const liveClasses = await LiveClass.find() || [];
    const healthSyncs = await HealthSync.find() || [];
    const rawRecentUsers = await User.find({ authProvider: { $ne: 'admin' }, id: { $ne: 'USR-ADMIN-01' } }).sort({ createdAt: -1 }).limit(5);
    const recentUsers = rawRecentUsers.map(u => {
      const uObj = u.toObject();
      if (!uObj.avatar || typeof uObj.avatar !== 'string' || uObj.avatar.trim() === '' || uObj.avatar.includes('null')) {
        uObj.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(uObj.name || 'User')}&background=6366f1&color=fff&bold=true`;
      }
      return uObj;
    });

    const stats = {
      totalUsers: totalUsersCount,
      userGrowth: 14.8,
      premiumUsers: premiumUsersCount,
      premiumGrowth: 22.4,
      activeUsersToday: 34210,
      dailySessions: 68420,
      meditationMinutesToday: 894500,
      breathingMinutesToday: 412300,
      yogaSessionsToday: 45290,
      aiGeneratedPracticesToday: 18450,
      monthlyRevenue: 348900,
      mrrGrowth: 18.5,
      retentionRate: 88.6,
      avgStreakDays: 14.2,
      serverUptime: 99.98,
      watchSyncActive: 74.3,
      counts: {
        asanas: asanaCount,
        breathing: breathingCount,
        activeRules: activeRulesCount,
        liveClasses: liveClasses.length
      }
    };

    const revenueRetentionSeries = [
      { month: 'Jan', revenue: 210000, mrr: 195000, premiumUsers: 34000, retention: 84 },
      { month: 'Feb', revenue: 235000, mrr: 215000, premiumUsers: 37200, retention: 85 },
      { month: 'Mar', revenue: 260000, mrr: 240000, premiumUsers: 40500, retention: 86 },
      { month: 'Apr', revenue: 289000, mrr: 268000, premiumUsers: 43100, retention: 87 },
      { month: 'May', revenue: 312000, mrr: 295000, premiumUsers: 45800, retention: 87.5 },
      { month: 'Jun', revenue: 348900, mrr: 322000, premiumUsers: 48910, retention: 88.6 },
    ];

    const dailyPracticeDistribution = [
      { name: 'Vinyasa Flow', percentage: 32, count: 21890, fill: '#4F46E5' },
      { name: 'Box Breathing', percentage: 24, count: 16420, fill: '#06B6D4' },
      { name: 'Mindful Meditation', percentage: 20, count: 13680, fill: '#10B981' },
      { name: 'Yin Yoga', percentage: 14, count: 9580, fill: '#818CF8' },
      { name: 'Sleep Nidra', percentage: 10, count: 6850, fill: '#F59E0B' },
    ];

    const countryAnalytics = [
      { country: 'United States', code: 'US', users: '62,400', percentage: 42, flag: '🇺🇸' },
      { country: 'United Kingdom', code: 'GB', users: '21,800', percentage: 15, flag: '🇬🇧' },
      { country: 'Germany', code: 'DE', users: '14,300', percentage: 10, flag: '🇩🇪' },
      { country: 'Canada', code: 'CA', users: '11,200', percentage: 8, flag: '🇨🇦' },
      { country: 'Australia', code: 'AU', users: '9,800', percentage: 7, flag: '🇦🇺' },
      { country: 'Japan', code: 'JP', users: '7,500', percentage: 5, flag: '🇯🇵' },
    ];

    const recentNotifications = [
      { id: 1, title: 'AI Model v2.4 Updated', desc: 'Recommendation latency decreased by 34ms', time: '10m ago', type: 'system' },
      { id: 2, title: 'Apple Health Sync Spike', desc: '+4,200 new Watch telemetry streams detected', time: '35m ago', type: 'health' },
      { id: 3, title: 'New Pro Subscription', desc: 'Elena Rostova upgraded to Annual Pro ($149)', time: '1h ago', type: 'revenue' },
      { id: 4, title: 'High Cortisol Alert', desc: '142 users triggered rule "Stressed / High Cortisol"', time: '2h ago', type: 'alert' },
    ];

    res.json({
      success: true,
      stats,
      revenueRetentionSeries,
      dailyPracticeDistribution,
      countryAnalytics,
      recentNotifications,
      liveClasses,
      healthSyncs,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
