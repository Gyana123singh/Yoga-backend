const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  addVideoClass,
  updateVideoClass,
  deleteVideoClass
} = require('../controllers/exploreSessionController');
const { uploadSessionMedia } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAllSessions);
router.get('/:id', getSessionById);

// Admin routes
router.post('/', uploadSessionMedia, createSession);
router.put('/:id', uploadSessionMedia, updateSession);
router.delete('/:id', deleteSession);

// Video classes sub-routes
router.post('/:id/video-classes', uploadSessionMedia, addVideoClass);
router.put('/:id/video-classes/:classId', uploadSessionMedia, updateVideoClass);
router.delete('/:id/video-classes/:classId', deleteVideoClass);

module.exports = router;
