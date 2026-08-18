const multer = require('multer');
const path = require('path');

// Multer Memory Storage (No files stored on local disk, direct Cloudinary stream)
const memoryStorage = multer.memoryStorage();

// Video filter
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|mov|mkv|avi/;
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extMatch || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, WEBM, MOV) are allowed!'), false);
  }
};

// Media filter (Images, Audio, SVG)
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
  storage: memoryStorage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
  fileFilter: videoFilter
});

const uploadMedia = multer({
  storage: memoryStorage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB limit
  fileFilter: mediaFilter
});

// Multi-field upload middleware for Quick Practice
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
