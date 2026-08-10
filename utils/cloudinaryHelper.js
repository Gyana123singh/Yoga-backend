const cloudinary = require('../config/cloudinary');
const fs = require('fs');

/**
 * Uploads a local file (from Multer e.g. /uploads/videos or /uploads/media) to Cloudinary.
 * Returns Cloudinary secure_url if available, or falls back to null if Cloudinary is unconfigured.
 */
const uploadToCloudinary = async (filePath, folder = 'yoga_uploads') => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && cloudName !== 'aura-yoga-cloud') {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
        folder: folder
      });
      if (result && result.secure_url) {
        console.log(`☁️ [Cloudinary Upload Success] ${result.secure_url}`);
        return result.secure_url;
      }
    }
  } catch (err) {
    console.warn(`[Cloudinary Warning] Upload to Cloudinary skipped/failed (${err.message}). Using local upload file.`);
  }
  return null;
};

/**
 * Helper to build local static URL and attempt Cloudinary upload
 */
const getMediaUrl = async (req, file, subfolder = 'media') => {
  if (!file) return null;
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  const localUrl = `${protocol}://${host}/uploads/${subfolder}/${file.filename}`;

  const cloudUrl = await uploadToCloudinary(file.path, `yoga_${subfolder}`);
  return cloudUrl || localUrl;
};

module.exports = {
  uploadToCloudinary,
  getMediaUrl
};
