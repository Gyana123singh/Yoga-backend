const Asana = require('../models/Asana');
const { MOCK_ASANAS } = require('../utils/seedData');

const getAsanas = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    if (category) query.category = { $regex: category, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { englishName: { $regex: search, $options: 'i' } },
        { sanskritName: { $regex: search, $options: 'i' } },
        { benefits: { $regex: search, $options: 'i' } }
      ];
    }

    let asanas = await Asana.find(query).sort({ createdAt: -1 });

    if (asanas.length === 0 && !category && !difficulty && !search) {
      asanas = MOCK_ASANAS;
    }

    res.json({ success: true, count: asanas.length, data: asanas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAsanaById = async (req, res) => {
  try {
    const asana = await Asana.findOne({ id: req.params.id }) || await Asana.findById(req.params.id);
    if (!asana) {
      const mock = MOCK_ASANAS.find(a => a.id === req.params.id);
      if (mock) return res.json({ success: true, data: mock });
      return res.status(404).json({ success: false, message: 'Asana not found' });
    }
    res.json({ success: true, data: asana });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAsana = async (req, res) => {
  try {
    const { englishName, sanskritName, category, difficulty, targetMuscles, benefits, contraindications, instructions, equipment, imageUrl, pose3dAvailable } = req.body;
    const newId = `ASN-${Math.floor(10 + Math.random() * 90)}`;

    const asana = new Asana({
      id: newId,
      englishName,
      sanskritName,
      category: category || 'Stretch',
      difficulty: difficulty || 'Beginner',
      targetMuscles: targetMuscles || [],
      benefits,
      contraindications: contraindications || 'Consult a physician if experiencing acute pain.',
      instructions: instructions || [],
      equipment: equipment || ['Yoga Mat'],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      pose3dAvailable: pose3dAvailable || false
    });

    const savedAsana = await asana.save();
    res.status(201).json({ success: true, data: savedAsana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAsana = async (req, res) => {
  try {
    let asana = await Asana.findOne({ id: req.params.id }) || await Asana.findById(req.params.id);
    if (!asana) {
      return res.status(404).json({ success: false, message: 'Asana not found' });
    }

    Object.assign(asana, req.body);
    const updatedAsana = await asana.save();
    res.json({ success: true, data: updatedAsana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAsana = async (req, res) => {
  try {
    const asana = await Asana.findOneAndDelete({ id: req.params.id }) || await Asana.findByIdAndDelete(req.params.id);
    if (!asana) {
      return res.status(404).json({ success: false, message: 'Asana not found' });
    }
    res.json({ success: true, message: 'Asana removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAsanas,
  getAsanaById,
  createAsana,
  updateAsana,
  deleteAsana
};
