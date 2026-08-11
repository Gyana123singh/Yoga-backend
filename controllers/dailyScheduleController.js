const DailySchedule = require('../models/DailySchedule');
const CalendarCategory = require('../models/CalendarCategory');
const { getMediaUrl } = require('../utils/cloudinaryHelper');

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
  const protocol = req ? (req.headers['x-forwarded-proto'] || req.protocol || 'http') : 'http';
  const host = req ? req.get('host') : (process.env.HOST || 'localhost:5000');
  return `${protocol}://${host}/uploads/media/${file.filename}`;
};

const DEFAULT_CATEGORIES = [
  {
    name: 'Breathing',
    icon: '☀️',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 1
  },
  {
    name: 'Yoga',
    icon: '🧘',
    bgImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 2
  },
  {
    name: 'Meditation',
    icon: '🧠',
    bgImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 3
  },
  {
    name: 'Relaxation',
    icon: '🌙',
    bgImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 4
  },
  {
    name: 'Sleep',
    icon: '😴',
    bgImageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 5
  }
];

/**
 * @desc    Get Admin-Configured Calendar Practice Categories
 * @route   GET /api/daily-schedule/categories
 * @access  Public
 */
const getCalendarCategories = async (req, res) => {
  try {
    let categories = await CalendarCategory.find({ isActive: true }).sort({ order: 1 });
    if (!categories || categories.length === 0) {
      // Seed default categories
      await CalendarCategory.insertMany(DEFAULT_CATEGORIES).catch(() => {});
      categories = await CalendarCategory.find({ isActive: true }).sort({ order: 1 });
    }
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin Add or Update Calendar Practice Category with Media (Background Image, Mandala Frame, Ambient Music)
 * @route   POST /api/daily-schedule/categories
 * @access  Public / Admin
 */
const addOrUpdateCalendarCategory = async (req, res) => {
  try {
    const {
      id,
      name,
      icon,
      bgImageUrlCustom,
      frameDesignUrlCustom,
      bgMusicUrlCustom,
      voiceGuidanceUrlCustom
    } = req.body || {};

    const files = req.files || {};

    let bgImageUrl = bgImageUrlCustom || '';
    if (files.bgImage && files.bgImage[0]) {
      bgImageUrl = (await getMediaUrl(req, files.bgImage[0], 'category_bg')) || buildFileUrl(req, files.bgImage[0]);
    }

    let frameDesignUrl = frameDesignUrlCustom || '';
    if (files.frameDesign && files.frameDesign[0]) {
      frameDesignUrl = (await getMediaUrl(req, files.frameDesign[0], 'category_frame')) || buildFileUrl(req, files.frameDesign[0]);
    }

    let bgMusicUrl = bgMusicUrlCustom || '';
    if (files.bgMusic && files.bgMusic[0]) {
      bgMusicUrl = (await getMediaUrl(req, files.bgMusic[0], 'category_music')) || buildFileUrl(req, files.bgMusic[0]);
    }

    let voiceGuidanceUrl = voiceGuidanceUrlCustom || '';
    if (files.voiceGuidance && files.voiceGuidance[0]) {
      voiceGuidanceUrl = (await getMediaUrl(req, files.voiceGuidance[0], 'category_voice')) || buildFileUrl(req, files.voiceGuidance[0]);
    }

    const catName = (name || 'Breathing').trim();
    let existingCat = null;

    if (id) {
      existingCat = await CalendarCategory.findById(id);
    }
    if (!existingCat) {
      existingCat = await CalendarCategory.findOne({ name: { $regex: new RegExp(`^${catName}$`, 'i') } });
    }

    if (existingCat) {
      if (name) existingCat.name = catName;
      if (icon) existingCat.icon = icon;
      if (bgImageUrl) existingCat.bgImageUrl = bgImageUrl;
      if (frameDesignUrl) existingCat.frameDesignUrl = frameDesignUrl;
      if (bgMusicUrl) existingCat.bgMusicUrl = bgMusicUrl;
      if (voiceGuidanceUrl) existingCat.voiceGuidanceUrl = voiceGuidanceUrl;
      await existingCat.save();

      return res.json({
        success: true,
        message: `Practice Category "${existingCat.name}" updated successfully!`,
        data: existingCat
      });
    }

    const count = await CalendarCategory.countDocuments().catch(() => 0);
    const newCat = new CalendarCategory({
      name: catName,
      icon: icon || (catName === 'Yoga' ? '🧘' : catName === 'Meditation' ? '🧠' : catName === 'Sleep' ? '😴' : '☀️'),
      bgImageUrl: bgImageUrl || 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
      frameDesignUrl: frameDesignUrl || 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
      bgMusicUrl: bgMusicUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      voiceGuidanceUrl: voiceGuidanceUrl || '',
      order: count + 1
    });

    await newCat.save();

    res.status(201).json({
      success: true,
      message: `Practice Category "${newCat.name}" created successfully!`,
      data: newCat
    });
  } catch (error) {
    console.error('[addOrUpdateCalendarCategory Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin Delete Practice Category
 * @route   DELETE /api/daily-schedule/categories/:id
 * @access  Public / Admin
 */
const deleteCalendarCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CalendarCategory.findByIdAndDelete(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
      bgMusicUrlCustom,
      voiceGuidanceUrlCustom
    } = body;

    const files = req.files || {};
    const targetDate = scheduledDate || getTodayDateString();

    // Look up Admin-configured category media assets
    const reqCategory = (category || 'Breathing').trim();
    const categoryConfig = await CalendarCategory.findOne({
      name: { $regex: new RegExp(`^${reqCategory}$`, 'i') }
    }).catch(() => null);

    let bgImageUrl = buildFileUrl(req, files.bgImage ? files.bgImage[0] : null) || bgImageUrlCustom;
    if (!bgImageUrl && categoryConfig) bgImageUrl = categoryConfig.bgImageUrl;
    if (!bgImageUrl) bgImageUrl = 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop';

    let frameDesignUrl = buildFileUrl(req, files.frameDesign ? files.frameDesign[0] : null) || frameDesignUrlCustom;
    if (!frameDesignUrl && categoryConfig) frameDesignUrl = categoryConfig.frameDesignUrl;
    if (!frameDesignUrl) frameDesignUrl = 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png';

    let bgMusicUrl = buildFileUrl(req, files.bgMusic ? files.bgMusic[0] : null) || bgMusicUrlCustom;
    if (!bgMusicUrl && categoryConfig) bgMusicUrl = categoryConfig.bgMusicUrl;
    if (!bgMusicUrl) bgMusicUrl = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';

    let voiceGuidanceUrl = buildFileUrl(req, files.voiceGuidance ? files.voiceGuidance[0] : null) || voiceGuidanceUrlCustom;
    if (!voiceGuidanceUrl && categoryConfig) voiceGuidanceUrl = categoryConfig.voiceGuidanceUrl;

    let categoryIcon = icon;
    if (!categoryIcon && categoryConfig) categoryIcon = categoryConfig.icon;

    // Safely drop legacy Mongo unique index if present
    try {
      await DailySchedule.collection.dropIndex('userId_1_date_1');
    } catch (dropErr) {
      // Ignore error if index doesn't exist
    }

    const count = await DailySchedule.countDocuments({ scheduledDate: targetDate }).catch(() => 0);

    const newSchedule = new DailySchedule({
      title: title || `${reqCategory} Routine`,
      category: reqCategory,
      scheduledDate: targetDate,
      date: `${targetDate}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      scheduledTime: scheduledTime || '07:00 AM',
      durationMinutes: parseInt(durationMinutes) || 10,
      status: 'Pending',
      icon: categoryIcon || (reqCategory === 'Yoga' ? 'yoga' : reqCategory === 'Meditation' ? 'brain' : reqCategory === 'Sleep' ? 'moon' : 'sun'),
      bgImageUrl,
      frameDesignUrl,
      bgMusicUrl,
      voiceGuidanceUrl: voiceGuidanceUrl || '',
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
  getCalendarCategories,
  addOrUpdateCalendarCategory,
  deleteCalendarCategory,
  getSchedulesByDate,
  addSchedule,
  toggleScheduleStatus,
  deleteSchedule,
  getMonthStats,
  getWeekStats
};
