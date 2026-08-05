const DailySchedule = require('../models/DailySchedule');
const UserPracticeLog = require('../models/UserPracticeLog');
const PracticeSequence = require('../models/PracticeSequence');
const Breathing = require('../models/Breathing');
const Asana = require('../models/Asana');
const RecommendationRule = require('../models/RecommendationRule');
const User = require('../models/User');

/**
 * @desc    Get Customer Home Feed (Fetches dynamic data from Admin-managed DB collections)
 * @route   GET /api/customer/home
 * @access  Public / Optional Auth
 */
const getHomeFeed = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id.toString()) : 'guest-user';
    const userName = req.user ? req.user.name : 'Anaya';
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Dynamic Greeting based on time of day
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17) timeGreeting = 'Good evening';

    // 2. Fetch Admin-created practice sequences & breathing techniques from DB
    const [adminSequences, adminBreathing, adminAsanas, activeRecommendations] = await Promise.all([
      PracticeSequence.find().limit(10),
      Breathing.find().limit(10),
      Asana.find().limit(10),
      RecommendationRule.find({ status: 'Active' }).sort({ priority: 1 }).limit(1)
    ]);

    // 3. Find or Create User's Daily Wellness Schedule
    let schedule = await DailySchedule.findOne({ userId, date: todayStr });
    if (!schedule) {
      // Map admin practice sequences to today's schedule plan if available
      const scheduleItems = adminSequences.length >= 3 
        ? adminSequences.slice(0, 3).map((seq, idx) => ({
            itemId: `sch-${idx + 1}`,
            title: seq.title,
            time: idx === 0 ? '07:15 AM' : idx === 1 ? '05:00 PM' : '10:00 PM',
            duration: seq.duration || '15 mins',
            durationMinutes: parseInt(seq.duration) || 15,
            icon: idx === 0 ? '☀️' : idx === 1 ? '🧘' : '😴',
            completed: false,
            category: seq.category || 'Yoga'
          }))
        : [
            { itemId: 'sch-1', title: 'Morning Mindful Breath', time: '07:15 AM', duration: '10 Minutes', durationMinutes: 10, icon: '☀️', completed: false },
            { itemId: 'sch-2', title: 'Core Yoga Flow', time: '05:00 PM', duration: '20 Minutes', durationMinutes: 20, icon: '🧘', completed: false },
            { itemId: 'sch-3', title: 'Sleep Journey Practice', time: '10:00 PM', duration: '15 Minutes', durationMinutes: 15, icon: '😴', completed: false }
          ];

      schedule = new DailySchedule({
        userId,
        date: todayStr,
        completedCount: 0,
        totalCount: scheduleItems.length,
        items: scheduleItems
      });
      await schedule.save();
    }

    // 4. Calculate 7-Day Weekly Stats from User Practice Logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await UserPracticeLog.find({
      userId,
      completedAt: { $gte: sevenDaysAgo }
    });

    const totalWeeklyMinutes = logs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
    const sessionsCompleted = logs.length;
    const activeDates = new Set(logs.map(log => log.date));
    const activeDays = activeDates.size;
    const goalPercentage = Math.min(100, Math.round((activeDays / 7) * 100));

    // 5. Select active personal session from Admin sequences or filters
    const activeMood = req.query.mood || 'Calm';
    const activeTarget = req.query.target || 'Belly / Core strength';
    
    // Find matching admin sequence if exists
    const matchingSeq = adminSequences.find(s => 
      (s.targetGoal && s.targetGoal.toLowerCase().includes(activeTarget.toLowerCase())) ||
      (s.title && s.title.toLowerCase().includes(activeTarget.toLowerCase()))
    ) || adminSequences[0];

    const personalSessionData = {
      badge: 'YOUR PERSONAL SESSION',
      title: matchingSeq ? matchingSeq.title : '20-Minute Belly & Calm',
      totalDurationMinutes: matchingSeq ? (parseInt(matchingSeq.duration) || 20) : 20,
      steps: matchingSeq && matchingSeq.poses && matchingSeq.poses.length > 0 
        ? matchingSeq.poses.map((pose, idx) => ({
            id: `step-${idx + 1}`,
            duration: pose.holdTime || '3 min',
            title: pose.name || 'Yoga Pose Flow',
            category: pose.breathingPattern || 'Breath',
            color: idx % 2 === 0 ? '#ECFDF5' : '#FFEDD5',
            icon: idx % 2 === 0 ? 'wind' : 'user'
          }))
        : [
            { id: 'step-1', duration: '4 min', title: `Breath preparation (${activeMood} reset)`, category: 'Breath', color: '#ECFDF5', icon: 'wind' },
            { id: 'step-2', duration: '11 min', title: `${activeTarget} flow`, category: 'Yoga Flow', color: '#FFEDD5', icon: 'user' },
            { id: 'step-3', duration: '3 min', title: 'Deep body relaxation', category: 'Relaxation', color: '#F3E8FF', icon: 'lotus' },
            { id: 'step-4', duration: '2 min', title: 'Cooling breath', category: 'Cooling', color: '#FFE4E6', icon: 'heart' }
          ]
    };

    // 6. Insights from Admin Recommendation Rules
    const activeRule = activeRecommendations[0];
    const insightData = {
      sectionTitle: 'INSIGHTS',
      summary: activeRule ? `Based on ${activeRule.triggerCondition}` : 'You slept less than usual last night.',
      recommendationTitle: "Today's recommendation",
      recommendation: activeRule ? (activeRule.recommendedSequence ? activeRule.recommendedSequence.join(' + ') : activeRule.userState) : 'Gentle Yoga + Relaxing Breath',
      recommendationIcon: 'moon'
    };

    // Construct response matching Home UI
    return res.json({
      success: true,
      data: {
        greeting: {
          text: `${timeGreeting}, ${userName} ✦`,
          headline: 'Breathe. Move. Thrive.',
          subtitle: 'Your personal space for breath, yoga and wellbeing.'
        },
        whatDoINeedToday: {
          moodSelected: activeMood,
          targetSelected: activeTarget
        },
        personalSession: personalSessionData,
        quickPractices: adminBreathing.slice(0, 4).map((b, idx) => ({
          id: b.id || `qp-${idx}`,
          duration: b.defaultDuration || '5 min',
          label: b.name,
          category: b.category,
          bg: idx % 2 === 0 ? '#ECFDF5' : '#EFF6FF'
        })),
        exploreLibraries: {
          programsCount: adminSequences.length,
          breathingCount: adminBreathing.length,
          asanasCount: adminAsanas.length
        },
        dailyWellnessSchedule: {
          completedSummary: `${schedule.completedCount} of ${schedule.totalCount} completed`,
          items: schedule.items
        },
        thisWeek: {
          totalMinutes: totalWeeklyMinutes,
          sessionsCompleted,
          activeDays,
          activeDaysGoal: 7,
          goalPercentage
        },
        insights: insightData
      }
    });

  } catch (error) {
    console.error('Customer Home Feed Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer home feed',
      error: error.message
    });
  }
};

/**
 * @desc    Generate dynamic personal routine session from Admin data
 * @route   POST /api/customer/home/personal-session
 * @access  Public / Optional Auth
 */
const generatePersonalSession = async (req, res) => {
  try {
    const { mood, targetArea } = req.body;
    
    // Find matching admin practice sequence in database
    const matchingSeq = await PracticeSequence.findOne({
      $or: [
        { targetGoal: { $regex: targetArea || '', $options: 'i' } },
        { title: { $regex: targetArea || '', $options: 'i' } }
      ]
    });

    if (matchingSeq) {
      return res.json({
        success: true,
        data: matchingSeq
      });
    }

    res.json({
      success: true,
      data: {
        title: `Dynamic ${targetArea || 'Core'} & ${mood || 'Calm'} Flow`,
        targetGoal: targetArea || 'Belly / Core strength',
        duration: '20 mins'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle completion of a daily schedule item
 * @route   PUT /api/customer/home/schedule/:itemId/toggle
 * @access  Public / Optional Auth
 */
const toggleScheduleItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user ? (req.user.id || req.user._id.toString()) : 'guest-user';
    const todayStr = new Date().toISOString().split('T')[0];

    let schedule = await DailySchedule.findOne({ userId, date: todayStr });
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found for today' });
    }

    const item = schedule.items.find(i => i.itemId === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }

    item.completed = !item.completed;
    item.completedAt = item.completed ? new Date() : null;

    schedule.completedCount = schedule.items.filter(i => i.completed).length;
    await schedule.save();

    if (item.completed) {
      await UserPracticeLog.create({
        userId,
        practiceType: 'Daily Schedule',
        title: item.title,
        durationMinutes: item.durationMinutes || 10,
        date: todayStr
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Log a completed practice session
 * @route   POST /api/customer/home/log-practice
 * @access  Public / Optional Auth
 */
const logPracticeCompletion = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user._id.toString()) : 'guest-user';
    const { practiceType, title, durationMinutes, moodBefore, moodAfter, targetArea } = req.body;

    const log = new UserPracticeLog({
      userId,
      practiceType: practiceType || 'Personal Session',
      title: title || 'Session Practice',
      durationMinutes: durationMinutes || 15,
      moodBefore: moodBefore || 'Calm',
      moodAfter: moodAfter || 'Relaxed',
      targetArea: targetArea || 'General',
      date: new Date().toISOString().split('T')[0]
    });

    await log.save();

    if (req.user) {
      req.user.totalMinutes = (req.user.totalMinutes || 0) + (durationMinutes || 15);
      req.user.streak = (req.user.streak || 0) + 1;
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Practice logged successfully',
      data: log
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Search Yoga Asanas, Breathing, and Sequences in DB
 * @route   GET /api/customer/home/search
 * @access  Public
 */
const searchHome = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: { asanas: [], breathing: [], sequences: [] } });
    }

    const regex = new RegExp(q, 'i');

    const [asanas, breathing, sequences] = await Promise.all([
      Asana.find({ $or: [{ englishName: regex }, { sanskritName: regex }, { targetMuscles: regex }, { benefits: regex }] }).limit(5),
      Breathing.find({ $or: [{ name: regex }, { category: regex }, { benefits: regex }] }).limit(5),
      PracticeSequence.find({ $or: [{ title: regex }, { targetGoal: regex }, { category: regex }] }).limit(5)
    ]);

    res.json({
      success: true,
      query: q,
      data: {
        asanas,
        breathing,
        sequences
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHomeFeed,
  generatePersonalSession,
  toggleScheduleItem,
  logPracticeCompletion,
  searchHome
};
