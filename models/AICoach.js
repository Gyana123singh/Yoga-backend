const mongoose = require('mongoose');

const aiCoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  promptStyle: { type: String },
  tone: { type: String, default: 'Empathetic & Calm' },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250' }
}, {
  timestamps: true
});

module.exports = mongoose.model('AICoach', aiCoachSchema);
