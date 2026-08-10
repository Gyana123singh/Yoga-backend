const cloudinary = require('../config/cloudinary');

/**
 * Uploads an in-memory Buffer (from Multer memoryStorage) directly to Cloudinary via upload_stream.
 * No files are created or stored on the local disk server!
 */
const uploadBufferToCloudinary = (fileBuffer, folder = 'yoga_uploads', originalName = '') => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn('[Cloudinary Warning] Missing Cloudinary keys in .env!');
      return resolve(null);
    }

    const cleanFolder = folder || 'yoga_uploads';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: cleanFolder
      },
      (error, result) => {
        if (error) {
          console.error('☁️ [Cloudinary Upload Error]:', error.message || error);
          return resolve(null);
        }
        if (result && result.secure_url) {
          console.log(`☁️ [Cloudinary Upload Success] URL: ${result.secure_url}`);
          return resolve(result.secure_url);
        }
        resolve(null);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Helper to process Multer memory file and return Cloudinary secure_url
 */
const getMediaUrl = async (req, file, subfolder = 'media') => {
  if (!file) return null;

  // 1. In-memory buffer from Multer memoryStorage
  if (file.buffer) {
    const cloudUrl = await uploadBufferToCloudinary(file.buffer, `yoga_${subfolder}`, file.originalname);
    if (cloudUrl) return cloudUrl;

    // Fallback if Cloudinary upload failed or unconfigured
    const mime = file.mimetype || 'image/jpeg';
    return `data:${mime};base64,${file.buffer.toString('base64')}`;
  }

  return null;
};

module.exports = {
  uploadBufferToCloudinary,
  getMediaUrl
};
