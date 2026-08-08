const DailySchedule = require('../models/DailySchedule');

/**
 * Helper to format date as YYYY-MM-DD
 */
const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Helper to build static URL for uploaded files
 */
const buildFileUrl = (req, file) => {
  if (!file) return null;
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  return `${protocol}://${host}/uploads/media/${file.filename}`;
};

/**
 * @desc    Get schedules for specific date
 * @route   GET /api/daily-schedule
 * @access  Public
 */
const getSchedulesByDate = async (req, res) => {
  try {
    const targetDate = req.query.date || getTodayDateString();
    const schedules = await DailySchedule.find({ scheduledDate: targetDate }).sort({ order: 1, createdAt: 1 });

    const total = schedules.length;
    const completedCount = schedules.filter(s => s.status === 'Completed').length;

    res.json({
      success: true,
      data: schedules,
      meta: {
        date: targetDate,
        total,
        completedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add new Practice Routine to Calendar
 * @route   POST /api/daily-schedule
 * @access  Public
 */
const addSchedule = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      title,
      category,
      scheduledDate,
      scheduledTime,
      durationMinutes,
      icon,
      bgImageUrlCustom,
      frameDesignUrlCustom,
      bgMusicUrlCustom
    } = body;

    const files = req.files || {};
    const targetDate = scheduledDate || getTodayDateString();

    const bgImageUrl = buildFileUrl(req, files.bgImage ? files.bgImage[0] : null) || bgImageUrlCustom || 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop';
    const frameDesignUrl = buildFileUrl(req, files.frameDesign ? files.frameDesign[0] : null) || frameDesignUrlCustom || 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png';
    const bgMusicUrl = buildFileUrl(req, files.bgMusic ? files.bgMusic[0] : null) || bgMusicUrlCustom || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';

    // Safely drop legacy Mongo unique index if present
    try {
      await DailySchedule.collection.dropIndex('userId_1_date_1');
    } catch (dropErr) {
      // Ignore error if index doesn't exist
    }

    const count = await DailySchedule.countDocuments({ scheduledDate: targetDate }).catch(() => 0);

    const ALLOWED_CATEGORIES = ['Breathing', 'Yoga', 'Meditation', 'Relaxation', 'Sleep'];
    const sanitizedCategory = ALLOWED_CATEGORIES.includes(category) ? category : 'Breathing';

    const newSchedule = new DailySchedule({
      title: title || 'Mindful Routine',
      category: sanitizedCategory,
      scheduledDate: targetDate,
      date: `${targetDate}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      scheduledTime: scheduledTime || '07:00 AM',
      durationMinutes: parseInt(durationMinutes) || 10,
      status: 'Pending',
      icon: icon || (sanitizedCategory === 'Yoga' ? 'yoga' : sanitizedCategory === 'Meditation' ? 'brain' : sanitizedCategory === 'Sleep' ? 'moon' : 'sun'),
      bgImageUrl,
      frameDesignUrl,
      bgMusicUrl,
      order: count + 1
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: 'Practice routine added to calendar!',
      data: newSchedule
    });
  } catch (error) {
    console.error('[AddSchedule Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating schedule' });
  }
};

const mongoose = require('mongoose');

/**
 * Helper to safely find schedule by Mongo ObjectId, custom ID, or numeric order
 */
const findScheduleByIdOrOrder = async (id) => {
  if (!id) return null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    const found = await DailySchedule.findById(id);
    if (found) return found;
  }

  const queryOr = [{ date: id }];
  if (!isNaN(id)) {
    queryOr.push({ order: Number(id) });
  }

  let found = await DailySchedule.findOne({ $or: queryOr });
  if (found) return found;

  if (!isNaN(id)) {
    const all = await DailySchedule.find().sort({ order: 1, createdAt: 1 });
    const idx = Math.max(0, parseInt(id, 10) - 1);
    if (all[idx]) return all[idx];
  }

  return null;
};

/**
 * @desc    Toggle Schedule Completion Status (Pending <-> Completed)
 * @route   PUT /api/daily-schedule/:id/toggle-complete
 * @access  Public
 */
const toggleScheduleStatus = async (req, res) => {
  try {
    const schedule = await findScheduleByIdOrOrder(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }

    schedule.status = schedule.status === 'Completed' ? 'Pending' : 'Completed';
    await schedule.save();

    res.json({
      success: true,
      message: `Routine marked as ${schedule.status}!`,
      data: schedule
    });
  } catch (error) {
    console.error('[toggleScheduleStatus Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Schedule Item
 * @route   DELETE /api/daily-schedule/:id
 * @access  Public
 */
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await findScheduleByIdOrOrder(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }
    await DailySchedule.findByIdAndDelete(schedule._id);
    res.json({ success: true, message: 'Routine deleted from calendar' });
  } catch (error) {
    console.error('[deleteSchedule Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Month Stats Summary (Completed, Partially Completed, Missed)
 * @route   GET /api/daily-schedule/month-stats
 * @access  Public
 */
const getMonthStats = async (req, res) => {
  try {
    const { year = 2026, month = 7 } = req.query;
    const prefix = `${year}-${String(month).padStart(2, '0')}`;

    const monthSchedules = await DailySchedule.find({
      scheduledDate: { $regex: `^${prefix}` }
    });

    // Group by date
    const dateMap = {};
    monthSchedules.forEach(item => {
      if (!dateMap[item.scheduledDate]) {
        dateMap[item.scheduledDate] = { total: 0, completed: 0 };
      }
      dateMap[item.scheduledDate].total += 1;
      if (item.status === 'Completed') {
        dateMap[item.scheduledDate].completed += 1;
      }
    });

    let completedDays = 0;
    let partiallyCompleted = 0;
    const activeDatesWithStatus = {};

    Object.keys(dateMap).forEach(d => {
      const { total, completed } = dateMap[d];
      if (completed === total && total > 0) {
        completedDays += 1;
        activeDatesWithStatus[d] = 'completed';
      } else if (completed > 0 && completed < total) {
        partiallyCompleted += 1;
        activeDatesWithStatus[d] = 'partially';
      } else {
        activeDatesWithStatus[d] = 'not_completed';
      }
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const missedDays = daysInMonth - (completedDays + partiallyCompleted);

    res.json({
      success: true,
      data: {
        completedDays,
        partiallyCompleted,
        missedDays: Math.max(0, missedDays),
        activeDatesWithStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Weekly Stats & Insights for Flutter Home Screen (This Week Card)
 * @route   GET /api/daily-schedule/week-stats
 * @access  Public
 */
const getWeekStats = async (req, res) => {
  try {
    // Calculate start and end of current week (Monday to Sunday)
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      weekDates.push(`${yyyy}-${mm}-${dd}`);
    }

    // Query schedules for this week
    const weekSchedules = await DailySchedule.find({
      scheduledDate: { $in: weekDates }
    });

    let totalMinutes = 0;
    let completedSessions = 0;
    const activeDaysSet = new Set();

    weekSchedules.forEach((item) => {
      if (item.status === 'Completed') {
        completedSessions += 1;
        totalMinutes += item.durationMinutes || 10;
        activeDaysSet.add(item.scheduledDate);
      }
    });

    const activeDays = activeDaysSet.size;
    const goalPercentage = Math.min(100, Math.round((activeDays / 7) * 100));

    // Get today's plan
    const todayStr = getTodayDateString();
    const todaySchedules = await DailySchedule.find({ scheduledDate: todayStr }).sort({ order: 1 });
    const todayCompletedCount = todaySchedules.filter(s => s.status === 'Completed').length;

    res.json({
      success: true,
      data: {
        thisWeek: {
          minutes: totalMinutes,
          sessions: completedSessions,
          activeDays,
          totalDays: 7,
          goalPercentage
        },
        todayPlan: {
          total: todaySchedules.length,
          completedCount: todayCompletedCount,
          items: todaySchedules
        },
        insights: {
          biometricHeadline: "You slept less than usual last night.",
          recommendedCategory: "Today's recommendation",
          recommendedTitle: "Gentle Yoga + Relaxing Breath",
          recommendationIcon: "moon"
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSchedulesByDate,
  addSchedule,
  toggleScheduleStatus,
  deleteSchedule,
  getMonthStats,
  getWeekStats
};
