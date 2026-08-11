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
    console.log(`📁 [Local Disk Storage Fallback Success] Saved file to: ${filePath}`);
    return filename;
  } catch (err) {
    console.error('❌ [Local Disk Storage Fallback Error]:', err.message || err);
    return null;
  }
};

/**
 * Uploads an in-memory Buffer directly to Cloudinary, with local storage fallback if Cloudinary fails.
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
 * Helper to process Multer memory file and return Cloudinary secure_url or local storage URL
 */
const getMediaUrl = async (req, file, subfolder = 'media') => {
  if (!file) return null;

  if (file.buffer) {
    // 1. Try Cloudinary direct upload
    const cloudUrl = await uploadBufferToCloudinary(file.buffer, `yoga_${subfolder}`, file.originalname);
    if (cloudUrl) return cloudUrl;

    // 2. Local File System Fallback if Cloudinary is unconfigured / credentials invalid
    console.warn('⚠️ [Media Upload] Cloudinary upload failed. Saving to local disk storage fallback...');
    const localFileName = saveBufferLocally(file.buffer, file.originalname);
    if (localFileName) {
      // Dynamic host detection (e.g. apiyoga.hirehand.co.in on live server vs localhost:5000 on local)
      const protocol = req ? (req.headers['x-forwarded-proto'] || req.protocol || 'http') : 'http';
      const host = req ? req.get('host') : (process.env.HOST || 'localhost:5000');
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



