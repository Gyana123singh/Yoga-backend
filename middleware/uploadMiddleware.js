const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure local uploads directories exist
const videoDir = path.join(__dirname, '../uploads/videos');
const mediaDir = path.join(__dirname, '../uploads/media');

if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

// Multer Disk Storage Config for Videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});

// Multer Disk Storage Config for General Media (Images, Frame SVGs, Music Audios)
const mediaStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `media-${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filters
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|mov|mkv|avi/;
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extMatch || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, WEBM, MOV) are allowed!'), false);
  }
};

const mediaFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp|svg|gif|mp3|wav|ogg|m4a|aac|mp4|webm/;
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extMatch || file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only valid images, SVG frames, and audio files are allowed!'), false);
  }
};

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: videoFilter
});

const uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: mediaFilter
});

// Multi-field upload middleware for Quick Practice (bgImage, frameDesign, bgMusic, voiceGuidance)
const uploadQuickPracticeMedia = uploadMedia.fields([
  { name: 'bgImage', maxCount: 1 },
  { name: 'frameDesign', maxCount: 1 },
  { name: 'bgMusic', maxCount: 1 },
  { name: 'voiceGuidance', maxCount: 1 }
]);

module.exports = {
  uploadVideo,
  uploadMedia,
  uploadQuickPracticeMedia
};
