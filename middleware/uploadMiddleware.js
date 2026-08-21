const multer = require('multer');
const path = require('path');

// Multer Memory Storage (No files stored on local disk, direct Cloudinary stream)
const memoryStorage = multer.memoryStorage();

// Video filter (MP4, WEBM, MOV, MKV, AVI)
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|mov|mkv|avi/i;
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extMatch || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, WEBM, MOV, MKV, AVI) are allowed!'), false);
  }
};

// Media filter (Images: JPG, PNG, WEBP, SVG, GIF, AVIF; Audio: MP3, WAV, OGG, M4A, AAC; Video: MP4, WEBM, MOV)
const mediaFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp|svg|gif|avif|mp3|wav|ogg|m4a|aac|mp4|webm|mov|mkv|avi/i;
  const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extMatch || file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only valid image, GIF, audio, or video files are allowed!'), false);
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

// Multi-field upload middleware for Explore Session
const uploadSessionMedia = uploadMedia.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'bgImage', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

module.exports = {
  uploadVideo,
  uploadMedia,
  uploadQuickPracticeMedia,
  uploadSessionMedia
};
