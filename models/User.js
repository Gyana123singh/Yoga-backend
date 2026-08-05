const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
  plan: { type: String, default: 'Starter Free' },
  planType: { type: String, enum: ['Free', 'Premium'], default: 'Free' },
  status: { type: String, enum: ['Active', 'Suspended', 'Pending'], default: 'Active' },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  streak: { type: Number, default: 0 },
  totalMinutes: { type: Number, default: 0 },
  primaryGoal: { type: String, default: 'General Wellness & Mindfulness' },
  devicesConnected: [{ type: String }],
  lastSession: { type: String, default: 'Just joined' },
  hrvAvg: { type: String, default: '65 ms' },
  sleepScore: { type: String, default: '80/100' },
  country: { type: String, default: 'United States' },
  language: { type: String, default: 'English' },
  aiPromptsCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
