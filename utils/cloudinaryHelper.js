const cloudinary = require('../config/cloudinary');

/**
 * Uploads an in-memory Buffer (from Multer memoryStorage) directly to Cloudinary via upload_stream.
 * Direct Cloudinary storage only - no local disk storage.
 */
const uploadBufferToCloudinary = (fileBuffer, folder = 'yoga_uploads', originalName = '') => {
  return new Promise((resolve) => {
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
 * Helper to process Multer memory file and return Cloudinary secure_url directly
 */
const getMediaUrl = async (req, file, subfolder = 'media') => {
  if (!file) return null;

  if (file.buffer) {
    return await uploadBufferToCloudinary(file.buffer, `yoga_${subfolder}`, file.originalname);
  }

  return null;
};

module.exports = {
  uploadBufferToCloudinary,
  getMediaUrl
};


