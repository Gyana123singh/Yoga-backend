const Breathing = require('../models/Breathing');

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
 * @desc    Get all active Breathing & Pranayama techniques
 * @route   GET /api/breathing
 * @access  Public
 */
const getBreathingTechniques = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { badgeTag: { $regex: search, $options: 'i' } }
      ];
    }

    const techniques = await Breathing.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: techniques
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single Breathing technique by ID
 * @route   GET /api/breathing/:id
 * @access  Public
 */
const getBreathingTechniqueById = async (req, res) => {
  try {
    const technique = await Breathing.findById(req.params.id);
    if (!technique) {
      return res.status(404).json({ success: false, message: 'Breathing technique not found' });
    }
    res.json({ success: true, data: technique });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new Breathing technique (Admin)
 * @route   POST /api/breathing
 * @access  Admin
 */
const createBreathingTechnique = async (req, res) => {
  try {
    const files = req.files || {};
    const {
      title,
      subtitle,
      badgeTag,
      category,
      totalRounds,
      durationMinutes,
      inhaleSeconds,
      holdSeconds,
      exhaleSeconds,
      whatIs,
      benefits,
      correctPosture,
      instructions,
      howToDo,
      whatItDoesntGuarantee,
      contraindications,
      originHistory,
      heroImageUrlCustom,
      demoVideoUrlCustom,
      bgImageUrlCustom,
      frameDesignUrlCustom,
      bgMusicUrlCustom
    } = req.body;

    const heroImageUrl = buildFileUrl(req, files.heroImage ? files.heroImage[0] : null) || heroImageUrlCustom || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop';
    const demoVideoUrl = buildFileUrl(req, files.demoVideo ? files.demoVideo[0] : null) || demoVideoUrlCustom || 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4';
    const bgImageUrl = buildFileUrl(req, files.bgImage ? files.bgImage[0] : null) || bgImageUrlCustom || 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop';
    const frameDesignUrl = buildFileUrl(req, files.frameDesign ? files.frameDesign[0] : null) || frameDesignUrlCustom || 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png';
    const bgMusicUrl = buildFileUrl(req, files.bgMusic ? files.bgMusic[0] : null) || bgMusicUrlCustom || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';

    const count = await Breathing.countDocuments();

    const newTechnique = new Breathing({
      title: title && title.trim() ? title.trim() : 'Mindful Breathing Technique',
      subtitle: subtitle || 'Purifying Breath • Energizing Mind',
      badgeTag: badgeTag || 'CLEANSE',
      category: category || 'Breathing',
      totalRounds: parseInt(totalRounds) || 3,
      durationMinutes: parseInt(durationMinutes) || 5,
      inhaleSeconds: parseInt(inhaleSeconds) || 4,
      holdSeconds: parseInt(holdSeconds) || 4,
      exhaleSeconds: parseInt(exhaleSeconds) || 4,
      whatIs: whatIs || 'Yogic breathing technique for mental clarity and energy.',
      benefits: benefits || 'Enhances lung capacity, detoxifies body, and sharpens focus.',
      correctPosture: correctPosture || 'Sit in a comfortable meditative posture such as Sukhasana with spine erect.',
      instructions: instructions || 'General instructions and important guidelines before practice.',
      howToDo: howToDo || 'Step-by-step method to practice correctly.',
      whatItDoesntGuarantee: whatItDoesntGuarantee || 'Effective for wellness but not a replacement for medical therapy.',
      contraindications: contraindications || 'Avoid if suffering from severe cardiovascular ailments.',
      originHistory: originHistory || 'Originated from ancient yogic traditions.',
      heroImageUrl,
      demoVideoUrl,
      bgImageUrl,
      frameDesignUrl,
      bgMusicUrl,
      order: count + 1,
      isActive: true
    });

    try {
      await newTechnique.save();
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        await Breathing.collection.dropIndex('id_1').catch(() => {});
        await newTechnique.save();
      } else {
        throw saveErr;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Breathing technique created successfully',
      data: newTechnique
    });
  } catch (error) {
    console.error('Error in createBreathingTechnique:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Breathing technique (Admin)
 * @route   PUT /api/breathing/:id
 * @access  Admin
 */
const updateBreathingTechnique = async (req, res) => {
  try {
    const files = req.files || {};
    const updateData = { ...req.body };

    if (files.heroImage) updateData.heroImageUrl = buildFileUrl(req, files.heroImage[0]);
    else if (req.body.heroImageUrlCustom) updateData.heroImageUrl = req.body.heroImageUrlCustom;

    if (files.demoVideo) updateData.demoVideoUrl = buildFileUrl(req, files.demoVideo[0]);
    else if (req.body.demoVideoUrlCustom) updateData.demoVideoUrl = req.body.demoVideoUrlCustom;

    if (files.bgImage) updateData.bgImageUrl = buildFileUrl(req, files.bgImage[0]);
    else if (req.body.bgImageUrlCustom) updateData.bgImageUrl = req.body.bgImageUrlCustom;

    if (files.frameDesign) updateData.frameDesignUrl = buildFileUrl(req, files.frameDesign[0]);
    else if (req.body.frameDesignUrlCustom) updateData.frameDesignUrl = req.body.frameDesignUrlCustom;

    if (files.bgMusic) updateData.bgMusicUrl = buildFileUrl(req, files.bgMusic[0]);
    else if (req.body.bgMusicUrlCustom) updateData.bgMusicUrl = req.body.bgMusicUrlCustom;

    const updated = await Breathing.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Breathing technique not found' });
    }

    res.json({
      success: true,
      message: 'Breathing technique updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Breathing technique (Admin)
 * @route   DELETE /api/breathing/:id
 * @access  Admin
 */
const deleteBreathingTechnique = async (req, res) => {
  try {
    const deleted = await Breathing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Breathing technique not found' });
    }
    res.json({ success: true, message: 'Breathing technique deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBreathingTechniques,
  getBreathingTechniqueById,
  createBreathingTechnique,
  updateBreathingTechnique,
  deleteBreathingTechnique
};
