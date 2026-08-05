const express = require('express');
const router = express.Router();
const {
  getPractices,
  createPractice,
  updatePractice,
  deletePractice
} = require('../controllers/practiceController');

router.route('/')
  .get(getPractices)
  .post(createPractice);

router.route('/:id')
  .put(updatePractice)
  .delete(deletePractice);

module.exports = router;
