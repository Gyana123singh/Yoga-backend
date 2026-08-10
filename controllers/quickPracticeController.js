const QuickPractice = require('../models/QuickPractice');

/**
 * @desc    Get all active Quick Practices & SOS Breathing items
 * @route   GET /api/quick-practices
 * @access  Public
 */
const getQuickPractices = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const items = await QuickPractice.find(query).sort({ order: 1, createdAt: -1 });

    const quickTimers = items.filter(i => i.category === 'quick_timer');
    const sosMoments = items.filter(i => i.category === 'sos_moment');
    const libraryItems = items.filter(i => i.category === 'library');

    res.json({
      success: true,
      data: {
        all: items,
        quickTimers,
        sosMoments,
        libraryItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single Quick Practice by ID
 * @route   GET /api/quick-practices/:id
 * @access  Public
 */
const getQuickPracticeById = async (req, res) => {
  try {
    const item = await QuickPractice.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Quick practice item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Helper to construct local static file URL
 */
const buildFileUrl = (req, file) => {
  if (!file) return null;
  const protocol = req.protocol || 'https';
  let host = req.get('host') || 'apiyoga.hirehand.co.in';
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    host = process.env.PUBLIC_HOST || 'apiyoga.hirehand.co.in';
  }
  const scheme = host.includes('localhost') ? 'http' : 'https';
  return `${scheme}://${host}/uploads/media/${file.filename}`;
};

/**
 * @desc    Create new Quick Practice / SOS item (Admin - Multer/Cloudinary + URL option)
 * @route   POST /api/quick-practices
 * @access  Admin
 */
const createQuickPractice = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      filterCategory,
      patternTag,
      benefits,
      safetyCaution,
      icon,
      durationMinutes,
      badgeText,
      bgImageUrlCustom,
      frameDesignUrlCustom,
      bgMusicUrlCustom,
      voiceGuidanceUrlCustom,
      phases
    } = req.body;

    const files = req.files || {};

    const bgImageUrl = buildFileUrl(req, files.bgImage ? files.bgImage[0] : null) || bgImageUrlCustom || 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop';
    const frameDesignUrl = buildFileUrl(req, files.frameDesign ? files.frameDesign[0] : null) || frameDesignUrlCustom || 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png';
    const bgMusicUrl = buildFileUrl(req, files.bgMusic ? files.bgMusic[0] : null) || bgMusicUrlCustom || '';
    const voiceGuidanceUrl = buildFileUrl(req, files.voiceGuidance ? files.voiceGuidance[0] : null) || voiceGuidanceUrlCustom || '';

    let parsedPhases = [];
    if (phases) {
      try {
        parsedPhases = typeof phases === 'string' ? JSON.parse(phases) : phases;
      } catch (e) {
        parsedPhases = [];
      }
    }

    let parsedBenefits = [];
    if (benefits) {
      try {
        parsedBenefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
      } catch (e) {
        parsedBenefits = Array.isArray(benefits) ? benefits : [benefits];
      }
    }

    const count = await QuickPractice.countDocuments();

    const newPractice = new QuickPractice({
      title,
      subtitle: subtitle || 'Mindful Breath • Inner Balance',
      category: category || 'quick_timer',
      filterCategory: filterCategory || 'Calm',
      patternTag: patternTag || 'Pattern: 4-4-4-4',
      benefits: parsedBenefits.length > 0 ? parsedBenefits : [
        'Lowers cortisol stress hormone',
        'Enhances mental clarity',
        'Balances autonomic nervous system'
      ],
      safetyCaution: safetyCaution || 'If pregnant or experiencing high blood pressure, reduce hold phase to comfortable level.',
      icon: icon || 'clock',
      durationMinutes: parseInt(durationMinutes) || 2,
      badgeText: badgeText || 'Quick Practice Session',
      bgImageUrl,
      frameDesignUrl,
      bgMusicUrl,
      voiceGuidanceUrl,
      phases: parsedPhases.length > 0 ? parsedPhases : [
        { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
        { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
        { phase: 'EXHALE', durationSeconds: 4, instruction: 'Release Slowly' },
        { phase: 'HOLD', durationSeconds: 4, instruction: 'Rest & Pause' }
      ],
      order: count + 1,
      isActive: true
    });

    await newPractice.save();

    res.status(201).json({
      success: true,
      message: 'Quick practice created successfully',
      data: newPractice
    });
  } catch (error) {
    console.error('Create Quick Practice Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Quick Practice / SOS item (Admin - Multer/Cloudinary + URL option)
 * @route   PUT /api/quick-practices/:id
 * @access  Admin
 */
const updateQuickPractice = async (req, res) => {
  try {
    const files = req.files || {};
    const updateData = { ...req.body };

    if (files.bgImage) {
      updateData.bgImageUrl = buildFileUrl(req, files.bgImage[0]);
    } else if (req.body.bgImageUrlCustom) {
      updateData.bgImageUrl = req.body.bgImageUrlCustom;
    }

    if (files.frameDesign) {
      updateData.frameDesignUrl = buildFileUrl(req, files.frameDesign[0]);
    } else if (req.body.frameDesignUrlCustom) {
      updateData.frameDesignUrl = req.body.frameDesignUrlCustom;
    }

    if (files.bgMusic) {
      updateData.bgMusicUrl = buildFileUrl(req, files.bgMusic[0]);
    } else if (req.body.bgMusicUrlCustom) {
      updateData.bgMusicUrl = req.body.bgMusicUrlCustom;
    }

    if (files.voiceGuidance) {
      updateData.voiceGuidanceUrl = buildFileUrl(req, files.voiceGuidance[0]);
    } else if (req.body.voiceGuidanceUrlCustom) {
      updateData.voiceGuidanceUrl = req.body.voiceGuidanceUrlCustom;
    }

    if (req.body.phases && typeof req.body.phases === 'string') {
      try {
        updateData.phases = JSON.parse(req.body.phases);
      } catch (e) {}
    }

    if (req.body.benefits && typeof req.body.benefits === 'string') {
      try {
        updateData.benefits = JSON.parse(req.body.benefits);
      } catch (e) {}
    }

    const updated = await QuickPractice.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Quick practice not found' });
    }

    res.json({
      success: true,
      message: 'Quick practice updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Quick Practice / SOS item (Admin)
 * @route   DELETE /api/quick-practices/:id
 * @access  Admin
 */
const deleteQuickPractice = async (req, res) => {
  try {
    const deleted = await QuickPractice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Quick practice not found' });
    }
    res.json({ success: true, message: 'Quick practice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQuickPractices,
  getQuickPracticeById,
  createQuickPractice,
  updateQuickPractice,
  deleteQuickPractice
};
