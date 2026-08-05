const mongoose = require('mongoose');

const practiceSequenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Custom Sequence' },
  duration: { type: String, default: '15 mins' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  targetGoal: { type: String, default: 'General Flexibility' },
  poses: [{
    poseId: { type: String },
    name: { type: String },
    holdTime: { type: String, default: '60s' },
    breathingPattern: { type: String, default: 'Deep Belly Breath' },
    notes: { type: String }
  }],
  isAIGenerated: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdBy: { type: String, default: 'Admin Master' }
}, {
  timestamps: true
});

module.exports = mongoose.model('PracticeSequence', practiceSequenceSchema);
