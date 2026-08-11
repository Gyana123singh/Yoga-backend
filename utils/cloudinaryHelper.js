const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

/**
 * Saves file buffer locally to backend/uploads as a fallback when Cloudinary fails.
 */
const saveBufferLocally = (fileBuffer, originalName = 'media.mp4') => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(originalName) || '.mp4';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, fileBuffer);
    console.log(`📁 [Local Disk Fallback Success] Saved uploaded media to: ${filePath}`);
    return filename;
  } catch (err) {
    console.error('❌ [Local Disk Fallback Error]:', err.message || err);
    return null;
  }
};

/**
 * Uploads an in-memory Buffer (from Multer memoryStorage) directly to Cloudinary via upload_stream.
 * Pure Cloudinary storage - no local disk files unless Cloudinary fails!
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
 * Helper to process Multer memory file and return Cloudinary secure_url, or local disk fallback URL.
 */
const getMediaUrl = async (req, file, subfolder = 'media') => {
  if (!file) return null;

  if (file.buffer) {
    // 1. Try Cloudinary Upload
    const cloudUrl = await uploadBufferToCloudinary(file.buffer, `yoga_${subfolder}`, file.originalname);
    if (cloudUrl) return cloudUrl;

    // 2. Local File System Fallback if Cloudinary fails or has invalid credentials
    console.warn('⚠️ [Media Upload] Cloudinary upload failed. Falling back to local disk storage...');
    const localFileName = saveBufferLocally(file.buffer, file.originalname);
    if (localFileName) {
      const protocol = req ? req.protocol : 'http';
      const host = req ? req.get('host') : 'localhost:5000';
      const localUrl = `${protocol}://${host}/uploads/${localFileName}`;
      console.log(`✅ [Local Media URL Generated]: ${localUrl}`);
      return localUrl;
    }
  }

  return null;
};

module.exports = {
  uploadBufferToCloudinary,
  getMediaUrl,
  saveBufferLocally
};

