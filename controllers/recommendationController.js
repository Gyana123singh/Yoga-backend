const RecommendationRule = require('../models/RecommendationRule');
const { MOCK_RECOMMENDATIONS_RULES } = require('../utils/seedData');

const getRecommendationRules = async (req, res) => {
  try {
    let rules = await RecommendationRule.find().sort({ createdAt: -1 });
    if (rules.length === 0) {
      rules = MOCK_RECOMMENDATIONS_RULES;
    }
    res.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRecommendationRule = async (req, res) => {
  try {
    const { userState, triggerCondition, recommendedSequence, priority, aiPromptTemplate, status } = req.body;
    const newId = `RULE-${Math.floor(100 + Math.random() * 900)}`;

    const rule = new RecommendationRule({
      id: newId,
      userState,
      triggerCondition,
      recommendedSequence: Array.isArray(recommendedSequence)
        ? recommendedSequence
        : (recommendedSequence ? recommendedSequence.split(',').map(s => s.trim()) : []),
      priority: priority || 'Medium',
      aiPromptTemplate: aiPromptTemplate || 'Synthesize customized parasympathetic activation flow.',
      status: status || 'Active',
      matchCount: Math.floor(100 + Math.random() * 5000)
    });

    const saved = await rule.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateRecommendationRule = async (req, res) => {
  try {
    let rule = await RecommendationRule.findOne({ id: req.params.id }) || await RecommendationRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }
    Object.assign(rule, req.body);
    const updated = await rule.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteRecommendationRule = async (req, res) => {
  try {
    const rule = await RecommendationRule.findOneAndDelete({ id: req.params.id }) || await RecommendationRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }
    res.json({ success: true, message: 'Recommendation rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendationRules,
  createRecommendationRule,
  updateRecommendationRule,
  deleteRecommendationRule
};
