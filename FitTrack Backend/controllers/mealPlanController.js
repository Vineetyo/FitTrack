const MealPlan = require('../models/MealPlan');

exports.getMealPlanByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;
    const plan = await MealPlan.findOne({ userId, date });
    res.json(plan || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMealPlansForMonth = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month } = req.query;
    if (!year || !month) return res.status(400).json({ message: 'Missing year/month' });
    const prefix = `${year}-${String(month).padStart(2,'0')}-`;
    const plans = await MealPlan.find({ userId, date: { $regex: `^${prefix}` } });
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.upsertMealPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;
    const { meals } = req.body;
    if (!meals) return res.status(400).json({ message: 'Missing meals object' });
    const updated = await MealPlan.findOneAndUpdate(
      { userId, date },
      { $set: { meals } },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;
    await MealPlan.findOneAndDelete({ userId, date });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
