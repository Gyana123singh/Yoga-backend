const mongoose = require('mongoose');

const asanaSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  englishName: { type: String, required: true },
  sanskritName: { type: String, required: true },
  category: { type: String, default: 'General / Stretch' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  targetMuscles: [{ type: String }],
  benefits: { type: String, required: true },
  contraindications: { type: String, default: 'Consult a physician if experiencing acute spinal or joint pain.' },
  instructions: [{ type: String }],
  equipment: [{ type: String }],
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600' },
  pose3dAvailable: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Asana', asanaSchema);
