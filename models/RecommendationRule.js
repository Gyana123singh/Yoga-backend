const mongoose = require('mongoose');

const recommendationRuleSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userState: { type: String, required: true },
  triggerCondition: { type: String, required: true },
  recommendedSequence: [{ type: String }],
  priority: { type: String, enum: ['Urgent High', 'High', 'Medium', 'Low'], default: 'Medium' },
  aiPromptTemplate: { type: String },
  status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
  matchCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('RecommendationRule', recommendationRuleSchema);
