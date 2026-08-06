const express = require('express');
const router = express.Router();
const { getVideosByFeeling, uploadFeelingVideo, deleteVideo } = require('../controllers/videoController');
const { uploadVideo } = require('../middleware/uploadMiddleware');

router.get('/', getVideosByFeeling);
router.post('/upload', uploadVideo.single('video'), uploadFeelingVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
