const mongoose = require('mongoose');

const smartwatchDeviceSchema = new mongoose.Schema(
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
      unique: true,
      index: true,
      trim: true
    },
    deviceName: {
      type: String,
      required: true,
      trim: true,
      default: 'Galaxy Watch 4'
    },
    manufacturer: {
      type: String,
      default: 'Samsung',
      trim: true
    },
    model: {
      type: String,
      default: 'Galaxy Watch 4',
      trim: true
    },
    platform: {
      type: String,
      default: 'Wear OS',
      trim: true
    },
    firmwareVersion: {
      type: String,
      default: '1.0.0',
      trim: true
    },
    connectionType: {
      type: String,
      enum: ['wearable_data_layer', 'bluetooth', 'websocket', 'wifi_ip'],
      default: 'wearable_data_layer'
    },
    isConnected: {
      type: Boolean,
      default: true
    },
    lastSeenAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying user devices sorted by active connection
smartwatchDeviceSchema.index({ userId: 1, isConnected: -1 });

module.exports = mongoose.model('SmartwatchDevice', smartwatchDeviceSchema);
