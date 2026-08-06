const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true, default: 1 },
  title: { type: String, required: true }, // e.g. "Breath Preparation", "Cat Cow", "Forearm Plank"
  subtitle: { type: String, default: 'Spinal warm up' },
  durationSeconds: { type: Number, default: 180 }, // 3 minutes
  instructionTitle: { type: String, default: 'Inhale' },
  instructionDetail: { type: String, default: 'Breathe in slowly through your nose and fill your lungs and slowly release.' },
  videoUrl: { type: String, default: '' },
  poseImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop' },
  bgMusicUrl: { type: String, default: '' }
}, { _id: true });

const dayScheduleSchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true }, // 1 to 30
  title: { type: String, required: true }, // e.g. "Core Awareness", "Breath + Core"
  focusTitle: { type: String, default: 'Core Activation' },
  focusDescription: { type: String, default: 'Activate your core, improve body awareness and connect with your breath.' },
  durationMinutes: { type: Number, default: 15 },
  estimatedCalories: { type: Number, default: 112 },
  difficultyTag: { type: String, default: 'Beginner Friendly' },
  isFree: { type: Boolean, default: true },
  steps: [stepSchema]
}, { _id: true });

const yogaProgramSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Core & Belly Strength"
  subtitle: { type: String, default: 'Build a stronger core and improve stability & overall fitness.' },
  goalCategory: { type: String, enum: ['Strength', 'Mobility', 'Mind', 'Energy'], required: true, default: 'Strength' },
  totalDays: { type: Number, default: 30 },
  difficultyLevel: { type: String, default: 'Intermediate' }, // "Beginner", "Intermediate", "Advanced", "All Levels"
  enrolledCount: { type: String, default: '8.5K+' },
  heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop' },
  tags: { type: [String], default: ['Core Activation', 'Abdominal Strength'] },
  improvements: [{
    name: { type: String, default: 'Core Stability' },
    icon: { type: String, default: 'grid' }
  }],
  freeDaysCount: { type: Number, default: 2 }, // Day 1 and Day 2 are FREE
  dailySchedules: [dayScheduleSchema],
  order: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('YogaProgram', yogaProgramSchema);
