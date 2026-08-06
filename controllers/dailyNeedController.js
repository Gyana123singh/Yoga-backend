const Feeling = require('../models/Feeling');
const FocusArea = require('../models/FocusArea');
const DurationOption = require('../models/DurationOption');
const DailySessionConfig = require('../models/DailySessionConfig');

/**
 * @desc    Get full Daily Needs Config (Feelings, Focus Areas, Durations, Session Templates)
 * @route   GET /api/daily-needs/config
 * @access  Public
 */
const getDailyNeedsConfig = async (req, res) => {
  try {
    const [feelings, focusAreas, durations, sessions] = await Promise.all([
      Feeling.find().sort({ order: 1 }),
      FocusArea.find().sort({ order: 1 }),
      DurationOption.find().sort({ order: 1 }),
      DailySessionConfig.find().sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      data: {
        feelings,
        focusAreas,
        durations,
        sessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Feeling CRUD
 */
const createFeeling = async (req, res) => {
  try {
    const { name, emoji, description, order, isActive } = req.body;
    const feeling = new Feeling({ name, emoji, description, order, isActive });
    await feeling.save();
    res.status(201).json({ success: true, data: feeling });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFeeling = async (req, res) => {
  try {
    const feeling = await Feeling.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feeling) return res.status(404).json({ success: false, message: 'Feeling not found' });
    res.json({ success: true, data: feeling });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFeeling = async (req, res) => {
  try {
    const feeling = await Feeling.findByIdAndDelete(req.params.id);
    if (!feeling) return res.status(404).json({ success: false, message: 'Feeling not found' });
    res.json({ success: true, message: 'Feeling deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Focus Area CRUD
 */
const createFocusArea = async (req, res) => {
  try {
    const { name, icon, relatedFeelings, description, order, isActive } = req.body;
    const focusArea = new FocusArea({ name, icon, relatedFeelings, description, order, isActive });
    await focusArea.save();
    res.status(201).json({ success: true, data: focusArea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFocusArea = async (req, res) => {
  try {
    const focusArea = await FocusArea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!focusArea) return res.status(404).json({ success: false, message: 'Focus area not found' });
    res.json({ success: true, data: focusArea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFocusArea = async (req, res) => {
  try {
    const focusArea = await FocusArea.findByIdAndDelete(req.params.id);
    if (!focusArea) return res.status(404).json({ success: false, message: 'Focus area not found' });
    res.json({ success: true, message: 'Focus area deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Duration CRUD
 */
const createDuration = async (req, res) => {
  try {
    const { label, minutes, order, isActive } = req.body;
    const duration = new DurationOption({ label, minutes, order, isActive });
    await duration.save();
    res.status(201).json({ success: true, data: duration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDuration = async (req, res) => {
  try {
    const duration = await DurationOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!duration) return res.status(404).json({ success: false, message: 'Duration not found' });
    res.json({ success: true, data: duration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDuration = async (req, res) => {
  try {
    const duration = await DurationOption.findByIdAndDelete(req.params.id);
    if (!duration) return res.status(404).json({ success: false, message: 'Duration not found' });
    res.json({ success: true, message: 'Duration deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Dynamic Session Template CRUD & Customer Generator
 */
const createSessionConfig = async (req, res) => {
  try {
    const session = new DailySessionConfig(req.body);
    await session.save();
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSessionConfig = async (req, res) => {
  try {
    const session = await DailySessionConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session config not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSessionConfig = async (req, res) => {
  try {
    const session = await DailySessionConfig.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session config not found' });
    res.json({ success: true, message: 'Session config deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resolvePersonalSession = async (req, res) => {
  try {
    const { feeling, focusArea, duration } = req.body;
    const durationMins = parseInt(duration) || 20;

    // Check if admin has created a matching session config
    let match = await DailySessionConfig.findOne({
      isActive: true,
      $or: [
        { feeling: feeling, focusArea: focusArea },
        { feeling: feeling },
        { focusArea: focusArea }
      ]
    });

    if (match) {
      return res.json({ success: true, data: match });
    }

    // Dynamic Fallback Routine if specific template isn't pre-configured
    const breathMin = Math.max(2, Math.round(durationMins * 0.2));
    const flowMin = Math.max(5, Math.round(durationMins * 0.55));
    const relaxMin = Math.max(2, Math.round(durationMins * 0.15));
    const coolMin = Math.max(1, durationMins - (breathMin + flowMin + relaxMin));

    const generatedSession = {
      badge: 'YOUR PERSONAL SESSION',
      title: `${durationMins}-Minute ${focusArea.split('/')[0].trim()} & ${feeling}`,
      totalDurationMinutes: durationMins,
      steps: [
        { id: 'step-1', duration: `${breathMin} min`, durationMinutes: breathMin, title: `Breath preparation (${feeling} reset)`, category: 'Breath', color: '#ECFDF5', icon: 'wind', description: 'Deep belly inhalation and calming exhalation.' },
        { id: 'step-2', duration: `${flowMin} min`, durationMinutes: flowMin, title: `${focusArea} flow`, category: 'Yoga Flow', color: '#FFEDD5', icon: 'user', description: 'Targeted pose sequence for strength and alignment.' },
        { id: 'step-3', duration: `${relaxMin} min`, durationMinutes: relaxMin, title: 'Deep body relaxation', category: 'Relaxation', color: '#F3E8FF', icon: 'lotus', description: 'Mindful muscle release and grounding tension relief.' },
        { id: 'step-4', duration: `${coolMin} min`, durationMinutes: coolMin, title: 'Cooling breath', category: 'Cooling', color: '#FFE4E6', icon: 'heart', description: 'Calming parasympathetic nervous system cool-down.' }
      ]
    };

    res.json({ success: true, data: generatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDailyNeedsConfig,
  createFeeling,
  updateFeeling,
  deleteFeeling,
  createFocusArea,
  updateFocusArea,
  deleteFocusArea,
  createDuration,
  updateDuration,
  deleteDuration,
  createSessionConfig,
  updateSessionConfig,
  deleteSessionConfig,
  resolvePersonalSession
};
