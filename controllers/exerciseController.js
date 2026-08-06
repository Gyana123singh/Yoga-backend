const Exercise = require('../models/Exercise');

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
 * @desc    Get all active Exercises
 * @route   GET /api/exercises
 * @access  Public
 */
const getExercises = async (req, res) => {
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

    const exercises = await Exercise.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single Exercise by ID
 * @route   GET /api/exercises/:id
 * @access  Public
 */
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    res.json({ success: true, data: exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new Exercise (Admin)
 * @route   POST /api/exercises
 * @access  Admin
 */
const createExercise = async (req, res) => {
  try {
    const files = req.files || {};
    const {
      title,
      subtitle,
      badgeTag,
      category,
      durationMinutes,
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

    const heroImageUrl = buildFileUrl(req, files.heroImage ? files.heroImage[0] : null) || heroImageUrlCustom || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop';
    const demoVideoUrl = buildFileUrl(req, files.demoVideo ? files.demoVideo[0] : null) || demoVideoUrlCustom || 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4';
    const bgImageUrl = buildFileUrl(req, files.bgImage ? files.bgImage[0] : null) || bgImageUrlCustom || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop';
    const frameDesignUrl = buildFileUrl(req, files.frameDesign ? files.frameDesign[0] : null) || frameDesignUrlCustom || 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png';
    const bgMusicUrl = buildFileUrl(req, files.bgMusic ? files.bgMusic[0] : null) || bgMusicUrlCustom || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';

    const count = await Exercise.countDocuments();

    const newExercise = new Exercise({
      title: title && title.trim() ? title.trim() : 'Yoga Exercise Flow',
      subtitle: subtitle || 'Restorative Decompression • Spine Length',
      badgeTag: badgeTag || 'REST',
      category: category || 'Exercises',
      durationMinutes: parseInt(durationMinutes) || 10,
      whatIs: whatIs || 'Restorative yoga posture that lengthens the spine.',
      benefits: benefits || 'Stretches hips, thighs, and relieves lower back strain.',
      correctPosture: correctPosture || 'Sit in a comfortable posture with spine erect.',
      instructions: instructions || 'General guidelines before beginning your practice.',
      howToDo: howToDo || 'Step-by-step instructions for performing the movement.',
      whatItDoesntGuarantee: whatItDoesntGuarantee || 'Effective for tension relief but not a medical substitute.',
      contraindications: contraindications || 'Avoid if suffering from acute knee injury.',
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
      await newExercise.save();
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        await Exercise.collection.dropIndex('id_1').catch(() => {});
        await newExercise.save();
      } else {
        throw saveErr;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: newExercise
    });
  } catch (error) {
    console.error('Error in createExercise:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Exercise (Admin)
 * @route   PUT /api/exercises/:id
 * @access  Admin
 */
const updateExercise = async (req, res) => {
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

    const updated = await Exercise.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }

    res.json({
      success: true,
      message: 'Exercise updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Exercise (Admin)
 * @route   DELETE /api/exercises/:id
 * @access  Admin
 */
const deleteExercise = async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    res.json({ success: true, message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
};
