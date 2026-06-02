const User = require('../models/User');

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, avatarColor, avatarUrl, age, gender, fitnessGoals, dietary } = req.body;

    const updates = {};

    if (fullName    !== undefined) updates.fullName    = fullName;
    if (email       !== undefined) updates.email       = email.toLowerCase();
    if (avatarColor !== undefined) updates.avatarColor = avatarColor;
    if (avatarUrl   !== undefined) updates.avatarUrl   = avatarUrl;
    if (age         !== undefined) updates.age         = age || null;
    if (gender      !== undefined) updates.gender      = gender;

    if (fitnessGoals !== undefined) {
      updates.fitnessGoals = {
        currentWeight: fitnessGoals.currentWeight || null,
        targetWeight:  fitnessGoals.targetWeight  || null,
        dailyCalories: fitnessGoals.dailyCalories || null,
        weeklyGoal:    fitnessGoals.weeklyGoal    || null,
        primaryGoal:   fitnessGoals.primaryGoal   || ''
      };
    }

    if (dietary !== undefined) {
      updates.dietary = {
        dietType:      dietary.dietType      || 'all',
        allergies:     dietary.allergies     || [],
        customAllergy: dietary.customAllergy || ''
      };
    }

    // Check email uniqueness if email is being changed
    if (updates.email && updates.email !== req.user.email) {
      const existing = await User.findOne({ email: updates.email });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};