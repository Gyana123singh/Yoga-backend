const Breathing = require('../models/Breathing');
const { MOCK_BREATHING_TECHNIQUES } = require('../utils/seedData');

const getBreathingTechniques = async (req, res) => {
  try {
    let techniques = await Breathing.find().sort({ createdAt: -1 });
    if (techniques.length === 0) {
      techniques = MOCK_BREATHING_TECHNIQUES;
    }
    res.json({ success: true, count: techniques.length, data: techniques });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBreathingTechnique = async (req, res) => {
  try {
    const { name, category, pattern, benefits, audioGuide, defaultDuration, difficulty, iconColor } = req.body;
    const newId = `BRT-${Math.floor(10 + Math.random() * 90)}`;

    const technique = new Breathing({
      id: newId,
      name,
      category: category || 'Stress & Focus',
      pattern,
      benefits,
      audioGuide: audioGuide || 'Voice 01 (Calm Female - Maya)',
      defaultDuration: defaultDuration || '5 Minutes',
      difficulty: difficulty || 'Beginner',
      iconColor: iconColor || 'from-indigo-500 to-cyan-500'
    });

    const saved = await technique.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateBreathingTechnique = async (req, res) => {
  try {
    let item = await Breathing.findOne({ id: req.params.id }) || await Breathing.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Technique not found' });
    }
    Object.assign(item, req.body);
    const updated = await item.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBreathingTechnique = async (req, res) => {
  try {
    const item = await Breathing.findOneAndDelete({ id: req.params.id }) || await Breathing.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Technique not found' });
    }
    res.json({ success: true, message: 'Breathing technique deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBreathingTechniques,
  createBreathingTechnique,
  updateBreathingTechnique,
  deleteBreathingTechnique
};
