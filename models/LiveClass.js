const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  instructorAvatar: { type: String },
  dateTime: { type: String, required: true },
  duration: { type: String, default: '45 mins' },
  seatsBooked: { type: Number, default: 0 },
  totalSeats: { type: Number, default: 500 },
  status: { type: String, enum: ['Live Now', 'Scheduled', 'Completed'], default: 'Scheduled' },
  streamUrl: { type: String },
  category: { type: String, default: 'Vinyasa' }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
