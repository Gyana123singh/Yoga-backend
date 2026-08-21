const path = require('path');
const cloudinary = require('../config/cloudinary');

/**
 * Determine Cloudinary resource_type based on file extension and mimetype.
 * Cloudinary classifies video and audio under resource_type 'video'.
 */
const getResourceType = (originalName = '', mimetype = '') => {
  const ext = path.extname(originalName || '').toLowerCase();
  const mime = (mimetype || '').toLowerCase();

  if (
    mime.startsWith('video/') ||
    mime.startsWith('audio/') ||
    /\.(mp4|webm|mov|mkv|avi|mp3|wav|ogg|m4a|aac)$/i.test(ext)
  ) {
    return 'video';
  }

  if (
    mime.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(ext)
  ) {
    return 'image';
  }

  return 'auto';
};

/**
 * Uploads an in-memory Buffer directly to Cloudinary via stream.
 */
const uploadBufferToCloudinary = (fileBuffer, folder = 'yoga_uploads', originalName = '', mimetype = '') => {
  return new Promise((resolve) => {
    const cleanFolder = folder || 'yoga_uploads';
    const resourceType = getResourceType(originalName, mimetype);

    const uploadOptions = {
      resource_type: resourceType,
      folder: cleanFolder
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('☁️ [Cloudinary Upload Error]:', error.message || error);
          return resolve(null);
        }
        if (result && result.secure_url) {
          console.log(`☁️ [Cloudinary Upload Success] URL (${resourceType}): ${result.secure_url}`);
          return resolve(result.secure_url);
        }
        resolve(null);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Helper to process Multer memory file and return Cloudinary secure_url.
 * Storing files locally on disk or VPS server is completely disabled.
 */
const getMediaUrl = async (req, file, subfolder = 'media') => {
  if (!file) return null;

  if (file.buffer) {
    const cloudUrl = await uploadBufferToCloudinary(
      file.buffer,
      `yoga_${subfolder}`,
      file.originalname,
      file.mimetype
    );

    if (cloudUrl) return cloudUrl;

    console.error(`❌ [Media Upload Failed] Cloudinary upload failed for file: ${file.originalname || 'unknown'}`);
    return null;
  }

  return null;
};

module.exports = {
  uploadBufferToCloudinary,
  getMediaUrl,
  getResourceType
};
