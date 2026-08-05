const PracticeSequence = require('../models/PracticeSequence');

const getPractices = async (req, res) => {
  try {
    const { isAIGenerated, category, search } = req.query;
    let query = {};

    if (isAIGenerated !== undefined) query.isAIGenerated = isAIGenerated === 'true';
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { targetGoal: { $regex: search, $options: 'i' } }
      ];
    }

    const practices = await PracticeSequence.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: practices.length, data: practices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPractice = async (req, res) => {
  try {
    const { title, description, category, duration, difficulty, targetGoal, poses, tags, isAIGenerated, createdBy } = req.body;

    const practice = new PracticeSequence({
      title,
      description,
      category: category || 'Custom Flow',
      duration: duration || '15 mins',
      difficulty: difficulty || 'Beginner',
      targetGoal: targetGoal || 'Flexibility & Strength',
      poses: poses || [],
      tags: tags || ['Yoga'],
      isAIGenerated: isAIGenerated || false,
      createdBy: createdBy || 'Admin Master'
    });

    const saved = await practice.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePractice = async (req, res) => {
  try {
    const practice = await PracticeSequence.findById(req.params.id);
    if (!practice) {
      return res.status(404).json({ success: false, message: 'Practice sequence not found' });
    }
    Object.assign(practice, req.body);
    const updated = await practice.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deletePractice = async (req, res) => {
  try {
    const practice = await PracticeSequence.findByIdAndDelete(req.params.id);
    if (!practice) {
      return res.status(404).json({ success: false, message: 'Practice sequence not found' });
    }
    res.json({ success: true, message: 'Practice sequence deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPractices,
  createPractice,
  updatePractice,
  deletePractice
};
