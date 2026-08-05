const User = require('../models/User');
const { MOCK_USERS } = require('../utils/seedData');

const getUsers = async (req, res) => {
  try {
    const { planType, search } = req.query;
    let query = {};

    if (planType && planType !== 'All') {
      query.planType = planType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { primaryGoal: { $regex: search, $options: 'i' } }
      ];
    }

    let users = await User.find(query).sort({ createdAt: -1 });

    // Fallback if database has no records yet
    if (users.length === 0 && !planType && !search) {
      users = MOCK_USERS;
    } else if (planType && planType !== 'All' && users.length === 0) {
      users = MOCK_USERS.filter(u => u.planType === planType);
    }

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }) || await User.findById(req.params.id);
    if (!user) {
      const mock = MOCK_USERS.find(u => u.id === req.params.id);
      if (mock) return res.json({ success: true, data: mock });
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, planType, primaryGoal, country, language, devicesConnected } = req.body;
    const newId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = new User({
      id: newId,
      name,
      email,
      planType: planType || 'Free',
      plan: planType === 'Premium' ? 'Pro Annual ($149/yr)' : 'Starter Free',
      status: 'Active',
      primaryGoal: primaryGoal || 'General Wellness & Mindfulness',
      country: country || 'United States',
      language: language || 'English',
      devicesConnected: devicesConnected || [],
      streak: 1,
      totalMinutes: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    });

    const savedUser = await user.save();
    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await User.findOne({ id: req.params.id });
    if (!user) {
      user = await User.findById(req.params.id);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id }) || await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
