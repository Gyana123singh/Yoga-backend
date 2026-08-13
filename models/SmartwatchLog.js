const mongoose = require('mongoose');

const smartwatchLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    deviceId: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    sessionTitle: {
      type: String,
      required: true,
      trim: true,
      default: 'Yoga Practice'
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: [0, 'Duration minutes must be positive']
    },
    avgBpm: {
      type: Number,
      required: true,
      min: [30, 'Average BPM must be at least 30'],
      max: [250, 'Average BPM cannot exceed 250']
    },
    maxBpm: {
      type: Number,
      required: true,
      min: [30, 'Max BPM must be at least 30'],
      max: [250, 'Max BPM cannot exceed 250']
    },
    minBpm: {
      type: Number,
      min: [30, 'Min BPM must be at least 30'],
      max: [250, 'Min BPM cannot exceed 250'],
      default: 60
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: [0, 'Calories burned must be positive'],
      default: 0
    },
    caloriesSource: {
      type: String,
      enum: ['device', 'calculated', 'simulated'],
      default: 'device'
    },
    hrvAvg: {
      type: Number,
      min: [0, 'HRV must be non-negative'],
      default: 65
    },
    hrvMetric: {
      type: String,
      default: 'RMSSD'
    },
    stressIndex: {
      type: Number,
      min: [0, 'Stress index minimum is 0'],
      max: [100, 'Stress index maximum is 100'],
      default: 25
    },
    stressSource: {
      type: String,
      enum: ['device', 'calculated', 'simulated'],
      default: 'device'
    },
    targetZone: {
      type: String,
      default: 'Flow Zone'
    },
    syncedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for high performance analytics and query pagination
smartwatchLogSchema.index({ userId: 1, createdAt: -1 });
smartwatchLogSchema.index({ deviceId: 1, createdAt: -1 });

module.exports = mongoose.model('SmartwatchLog', smartwatchLogSchema);
