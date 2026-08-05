const express = require('express');
const router = express.Router();
const {
  getAsanas,
  getAsanaById,
  createAsana,
  updateAsana,
  deleteAsana
} = require('../controllers/asanaController');

router.route('/')
  .get(getAsanas)
  .post(createAsana);

router.route('/:id')
  .get(getAsanaById)
  .put(updateAsana)
  .delete(deleteAsana);

module.exports = router;
