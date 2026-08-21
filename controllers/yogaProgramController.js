const YogaProgram = require('../models/YogaProgram');
const UserPracticeLog = require('../models/UserPracticeLog');
const { getMediaUrl } = require('../utils/cloudinaryHelper');

/**
 * @desc    Get all active Goal-Based Yoga Programs
 * @route   GET /api/yoga-programs
 * @access  Public
 */
const getYogaPrograms = async (req, res) => {
  try {
    const { goalCategory } = req.query;
    let query = { isActive: true };

    if (goalCategory && goalCategory !== 'All Goals' && goalCategory !== 'All') {
      query.goalCategory = goalCategory;
    }

    const programs = await YogaProgram.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: programs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single Goal-Based Yoga Program by ID
 * @route   GET /api/yoga-programs/:id
 * @access  Public
 */
const getYogaProgramById = async (req, res) => {
  try {
    const program = await YogaProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Yoga program not found' });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Helper to build URL for uploaded files (Multer local + Cloudinary)
 */
const buildFileUrl = async (req, file) => {
  if (!file) return null;
  return await getMediaUrl(req, file, 'media');
};

/**
 * @desc    Create new Goal-Based Yoga Program (Admin)
 * @route   POST /api/yoga-programs
 * @access  Admin
 */
const createYogaProgram = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      goalCategory,
      totalDays,
      difficultyLevel,
      enrolledCount,
      heroImageUrlCustom,
      tags,
      improvements,
      freeDaysCount,
      dailySchedules
    } = req.body;

    const files = req.files || {};
    const heroImageUrl = (await buildFileUrl(req, files.heroImage ? files.heroImage[0] : null)) || heroImageUrlCustom || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop';

    function sanitizeTags(input) {
      if (!input) return [];
      let result = [];
      let current = input;
      if (typeof current === 'string') {
        try {
          current = JSON.parse(current);
        } catch (e) {
          result = current.split(',').map(t => t.trim());
        }
      }
      if (Array.isArray(current)) {
        for (const item of current) {
          result = result.concat(sanitizeTags(item));
        }
      } else if (typeof current === 'string') {
        result.push(current.trim());
      }
      return result
        .map(t => typeof t === 'string' ? t.replace(/^[\[\"'\s]+|[\]\"'\s]+$/g, '').replace(/\\+/g, '').trim() : '')
        .filter(t => t.length > 0 && t.length < 35 && !t.startsWith('[') && !t.startsWith('{'));
    }

    let parsedTags = sanitizeTags(tags);

    let parsedSchedules = [];
    if (dailySchedules) {
      try {
        parsedSchedules = typeof dailySchedules === 'string' ? JSON.parse(dailySchedules) : dailySchedules;
      } catch (e) {
        parsedSchedules = [];
      }
    }

    const count = await YogaProgram.countDocuments();

    const newProgram = new YogaProgram({
      title,
      subtitle: subtitle || 'Build strength, mobility, and body awareness step-by-step.',
      goalCategory: goalCategory || 'Strength',
      totalDays: parseInt(totalDays) || 30,
      difficultyLevel: difficultyLevel || 'Intermediate',
      enrolledCount: enrolledCount || '8.5K+',
      heroImageUrl,
      tags: parsedTags.length > 0 ? parsedTags : ['Core Activation', 'Abdominal Strength'],
      freeDaysCount: parseInt(freeDaysCount) || 2,
      dailySchedules: parsedSchedules,
      order: count + 1,
      isActive: true
    });

    await newProgram.save();

    res.status(201).json({
      success: true,
      message: 'Yoga program created successfully',
      data: newProgram
    });
  } catch (error) {
    console.error('Create Program Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Goal-Based Yoga Program (Admin)
 * @route   PUT /api/yoga-programs/:id
 * @access  Admin
 */
const updateYogaProgram = async (req, res) => {
  try {
    const files = req.files || {};
    const updateData = { ...req.body };

    if (files.heroImage) {
      updateData.heroImageUrl = await buildFileUrl(req, files.heroImage[0]);
    } else if (req.body.heroImageUrlCustom) {
      updateData.heroImageUrl = req.body.heroImageUrlCustom;
    }

    if (req.body.dailySchedules && typeof req.body.dailySchedules === 'string') {
      try {
        updateData.dailySchedules = JSON.parse(req.body.dailySchedules);
      } catch (e) {}
    }

    const updated = await YogaProgram.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({
      success: true,
      message: 'Program updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Goal-Based Yoga Program (Admin)
 * @route   DELETE /api/yoga-programs/:id
 * @access  Admin
 */
const deleteYogaProgram = async (req, res) => {
  try {
    const deleted = await YogaProgram.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Log Day Completion for User
 * @route   POST /api/yoga-programs/:id/log-day
 * @access  Public
 */
const logProgramDayCompletion = async (req, res) => {
  try {
    const { dayNumber } = req.body;
    const programId = req.params.id;

    const program = await YogaProgram.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Create user practice log
    const log = new UserPracticeLog({
      title: `${program.title} - Day ${dayNumber}`,
      durationMinutes: 15,
      practiceType: 'Goal Program',
      notes: `Completed Day ${dayNumber} of ${program.title}`
    });

    await log.save();

    res.json({
      success: true,
      message: `🎉 Day ${dayNumber} of "${program.title}" marked as completed!`,
      data: {
        programId,
        dayNumber,
        completedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getYogaPrograms,
  getYogaProgramById,
  createYogaProgram,
  updateYogaProgram,
  deleteYogaProgram,
  logProgramDayCompletion
};
