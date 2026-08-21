const ExploreSession = require('../models/ExploreSession');
const { getMediaUrl } = require('../utils/cloudinaryHelper');
const { getSocketIO } = require('../config/socket');

/**
 * @desc    Get all explore sessions
 * @route   GET /api/explore-sessions
 * @access  Public
 */
const getAllSessions = async (req, res) => {
  try {
    const sessions = await ExploreSession.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    console.error('getAllSessions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single session by ID
 * @route   GET /api/explore-sessions/:id
 * @access  Public
 */
const getSessionById = async (req, res) => {
  try {
    const session = await ExploreSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new explore session
 * @route   POST /api/explore-sessions
 * @access  Admin
 */
const createSession = async (req, res) => {
  try {
    const {
      title,
      badgeTag,
      subtitle,
      totalDurationText,
      heroImageUrlCustom,
      bgImageUrlCustom,
      order,
      isActive,
      videoClasses
    } = req.body;

    let heroImageUrl = heroImageUrlCustom || '';
    let bgImageUrl = bgImageUrlCustom || '';

    if (req.files) {
      if (req.files.heroImage && req.files.heroImage[0]) {
        heroImageUrl = await getMediaUrl(req, req.files.heroImage[0], 'explore_sessions');
      }
      if (req.files.bgImage && req.files.bgImage[0]) {
        bgImageUrl = await getMediaUrl(req, req.files.bgImage[0], 'explore_sessions');
      }
    }

    if (!heroImageUrl) {
      heroImageUrl = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop';
    }

    let parsedClasses = [];
    if (videoClasses) {
      try {
        parsedClasses = typeof videoClasses === 'string' ? JSON.parse(videoClasses) : videoClasses;
      } catch (e) {
        parsedClasses = [];
      }
    }

    const session = new ExploreSession({
      title: title || 'New Explore Session',
      badgeTag: badgeTag || 'BREATH',
      subtitle: subtitle || 'Energize your body and mind with refreshing breathing techniques • 12:45',
      totalDurationText: totalDurationText || '12:45',
      heroImageUrl,
      bgImageUrl,
      videoClasses: parsedClasses,
      order: parseInt(order) || 0,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
    });

    await session.save();

    const io = getSocketIO();
    if (io) {
      io.emit('explore_session_created', session);
    }

    res.status(201).json({ success: true, message: 'Session created successfully', data: session });
  } catch (error) {
    console.error('createSession Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update explore session
 * @route   PUT /api/explore-sessions/:id
 * @access  Admin
 */
const updateSession = async (req, res) => {
  try {
    const session = await ExploreSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const {
      title,
      badgeTag,
      subtitle,
      totalDurationText,
      heroImageUrlCustom,
      bgImageUrlCustom,
      order,
      isActive,
      videoClasses
    } = req.body;

    if (title) session.title = title;
    if (badgeTag) session.badgeTag = badgeTag;
    if (subtitle) session.subtitle = subtitle;
    if (totalDurationText) session.totalDurationText = totalDurationText;
    if (order !== undefined) session.order = parseInt(order) || 0;
    if (isActive !== undefined) session.isActive = (isActive === 'true' || isActive === true);

    if (heroImageUrlCustom) session.heroImageUrl = heroImageUrlCustom;
    if (bgImageUrlCustom) session.bgImageUrl = bgImageUrlCustom;

    if (req.files) {
      if (req.files.heroImage && req.files.heroImage[0]) {
        const url = await getMediaUrl(req, req.files.heroImage[0], 'explore_sessions');
        if (url) session.heroImageUrl = url;
      }
      if (req.files.bgImage && req.files.bgImage[0]) {
        const url = await getMediaUrl(req, req.files.bgImage[0], 'explore_sessions');
        if (url) session.bgImageUrl = url;
      }
    }

    if (videoClasses) {
      try {
        const parsed = typeof videoClasses === 'string' ? JSON.parse(videoClasses) : videoClasses;
        if (Array.isArray(parsed)) session.videoClasses = parsed;
      } catch (e) {
        console.warn('Invalid videoClasses JSON:', e);
      }
    }

    await session.save();

    const io = getSocketIO();
    if (io) {
      io.emit('explore_session_updated', session);
    }

    res.json({ success: true, message: 'Session updated successfully', data: session });
  } catch (error) {
    console.error('updateSession Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete explore session
 * @route   DELETE /api/explore-sessions/:id
 * @access  Admin
 */
const deleteSession = async (req, res) => {
  try {
    const session = await ExploreSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const io = getSocketIO();
    if (io) {
      io.emit('explore_session_deleted', { id: req.params.id });
    }

    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add a Video Class to a Session
 * @route   POST /api/explore-sessions/:id/video-classes
 * @access  Admin
 */
const addVideoClass = async (req, res) => {
  try {
    const session = await ExploreSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const {
      title,
      durationTag,
      durationCategory,
      subtitle,
      description,
      includesText,
      buttonText,
      durationMinutes,
      videoUrlCustom,
      thumbnailUrlCustom
    } = req.body;

    let videoUrl = videoUrlCustom || '';
    let thumbnailUrl = thumbnailUrlCustom || '';

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        videoUrl = await getMediaUrl(req, req.files.video[0], 'session_videos');
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = await getMediaUrl(req, req.files.thumbnail[0], 'session_thumbnails');
      }
    }

    if (!videoUrl) {
      videoUrl = 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4';
    }
    if (!thumbnailUrl) {
      thumbnailUrl = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000&auto=format&fit=crop';
    }

    const newClass = {
      title: title || 'New Video Class',
      durationTag: durationTag || '30 MINS',
      durationCategory: durationCategory || '30 Mins',
      subtitle: subtitle || 'HD 1080p Video • Voice Guided',
      description: description || 'Quick & effective guided video class designed to awaken your body.',
      includesText: includesText || 'Includes: Sun Salutation, Child Pose, Downward Dog, Cobra',
      thumbnailUrl,
      videoUrl,
      buttonText: buttonText || `Start ${durationTag || '30 Mins'} Class`,
      durationMinutes: parseInt(durationMinutes) || 30,
      order: session.videoClasses.length + 1
    };

    session.videoClasses.push(newClass);
    await session.save();

    const io = getSocketIO();
    if (io) {
      io.emit('explore_session_updated', session);
    }

    res.status(201).json({
      success: true,
      message: 'Video class added successfully',
      data: session
    });
  } catch (error) {
    console.error('addVideoClass Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a Video Class in a Session
 * @route   PUT /api/explore-sessions/:id/video-classes/:classId
 * @access  Admin
 */
const updateVideoClass = async (req, res) => {
  try {
    const session = await ExploreSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const videoClass = session.videoClasses.id(req.params.classId);
    if (!videoClass) {
      return res.status(404).json({ success: false, message: 'Video class not found' });
    }

    const {
      title,
      durationTag,
      durationCategory,
      subtitle,
      description,
      includesText,
      buttonText,
      durationMinutes,
      videoUrlCustom,
      thumbnailUrlCustom
    } = req.body;

    if (title) videoClass.title = title;
    if (durationTag) videoClass.durationTag = durationTag;
    if (durationCategory) videoClass.durationCategory = durationCategory;
    if (subtitle) videoClass.subtitle = subtitle;
    if (description) videoClass.description = description;
    if (includesText) videoClass.includesText = includesText;
    if (buttonText) videoClass.buttonText = buttonText;
    if (durationMinutes) videoClass.durationMinutes = parseInt(durationMinutes) || 30;
    if (videoUrlCustom) videoClass.videoUrl = videoUrlCustom;
    if (thumbnailUrlCustom) videoClass.thumbnailUrl = thumbnailUrlCustom;

    if (req.files) {
      if (req.files.video && req.files.video[0]) {
        const url = await getMediaUrl(req, req.files.video[0], 'session_videos');
        if (url) videoClass.videoUrl = url;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const url = await getMediaUrl(req, req.files.thumbnail[0], 'session_thumbnails');
        if (url) videoClass.thumbnailUrl = url;
      }
    }

    await session.save();

    const io = getSocketIO();
    if (io) {
      io.emit('explore_session_updated', session);
    }

    res.json({ success: true, message: 'Video class updated successfully', data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a Video Class from a Session
 * @route   DELETE /api/explore-sessions/:id/video-classes/:classId
 * @access  Admin
 */
const deleteVideoClass = async (req, res) => {
  try {
    const session = await ExploreSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.videoClasses = session.videoClasses.filter(c => c._id.toString() !== req.params.classId);
    await session.save();

    const io = getSocketIO();
    if (io) {
      io.emit('explore_session_updated', session);
    }

    res.json({ success: true, message: 'Video class deleted successfully', data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  addVideoClass,
  updateVideoClass,
  deleteVideoClass
};
