const FeelingVideo = require('../models/FeelingVideo');
const { getSocketIO } = require('../config/socket');
const { getMediaUrl } = require('../utils/cloudinaryHelper');

/**
 * @desc    Get videos by Feeling and Focus Area (for Customer Active Practice Player)
 * @route   GET /api/videos
 * @access  Public
 */
const getVideosByFeeling = async (req, res) => {
  try {
    const { feeling, focusArea } = req.query;
    let query = { isActive: true };

    if (feeling && feeling !== 'undefined' && feeling !== 'null' && feeling !== 'Not available') {
      const safeFeeling = feeling.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.feeling = new RegExp(safeFeeling, 'i');
    }

    if (focusArea && focusArea !== 'undefined' && focusArea !== 'null' && focusArea !== 'Not available') {
      const parts = focusArea.split('/').map(p => p.trim()).filter(Boolean);
      const patterns = [
        focusArea.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        ...parts.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      ];

      query.$or = [
        ...patterns.map(pat => ({ focusArea: new RegExp(pat, 'i') })),
        { focusArea: 'General' },
        { focusArea: { $exists: false } }
      ];
    }

    // Strictly fetch videos matching the selected feeling and focus area
    const videos = await FeelingVideo.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: videos });
  } catch (error) {
    console.error('getVideosByFeeling Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Upload video file (Multer / Cloudinary) & emit Socket.io real-time event
 * @route   POST /api/videos/upload
 * @access  Admin
 */
const uploadFeelingVideo = async (req, res) => {
  try {
    const { title, feeling, focusArea, stepTitle, videoUrlCustom, durationSeconds, instructionText, caloriesBurnRate, intensityLevel } = req.body;

    let videoUrl = videoUrlCustom || '';

    if (req.file) {
      // Served statically from /uploads/videos/
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      videoUrl = `${protocol}://${host}/uploads/videos/${req.file.filename}`;
    }

    if (!videoUrl) {
      // Default fallback demo yoga video URL
      videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    }

    const durSec = parseInt(durationSeconds) || 180;
    const minutes = Math.floor(durSec / 60);
    const secs = (durSec % 60).toString().padStart(2, '0');
    const durationText = `${minutes.toString().padStart(2, '0')}:${secs}`;

    const video = new FeelingVideo({
      title: title || `${feeling || 'Calm'} Flow Video`,
      feeling: feeling || 'Calm',
      focusArea: focusArea || 'Belly / Core strength',
      stepTitle: stepTitle || '1. Breath Preparation',
      videoUrl,
      durationSeconds: durSec,
      durationText,
      instructionText: instructionText || 'Focus on your breath. Inhale... Hold... Exhale...',
      caloriesBurnRate: parseInt(caloriesBurnRate) || 38,
      intensityLevel: intensityLevel || 'Moderate',
      isActive: true
    });

    await video.save();

    // Broadcast Real-time event to clients via Socket.io
    const io = getSocketIO();
    if (io) {
      io.emit('video_uploaded', video);
      io.to(`feeling_${video.feeling}`).emit('feeling_video_updated', video);
      console.log(`📡 [Socket.io Emitted] feeling_video_updated for ${video.feeling}`);
    }

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully and Socket.io event emitted!',
      data: video
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete video & emit Socket event
 * @route   DELETE /api/videos/:id
 * @access  Admin
 */
const deleteVideo = async (req, res) => {
  try {
    const video = await FeelingVideo.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const io = getSocketIO();
    if (io) {
      io.emit('video_deleted', { id: req.params.id, feeling: video.feeling });
    }

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVideosByFeeling,
  uploadFeelingVideo,
  deleteVideo
};
