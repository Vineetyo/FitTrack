const Task = require('../models/Task');
const Log = require('../models/Log');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { name, category, unit, targetValue } = req.body;
    if (!name) return res.status(400).json({ message: 'Task name is required' });

    const task = await Task.create({
      userId: req.user._id,
      name,
      category: category || 'custom',
      unit: unit || '',
      targetValue: targetValue || 0
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { name, category, unit, targetValue } = req.body;
    if (name !== undefined) task.name = name;
    if (category !== undefined) task.category = category;
    if (unit !== undefined) task.unit = unit;
    if (targetValue !== undefined) task.targetValue = targetValue;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Delete all logs associated with this task
    await Log.deleteMany({ taskId: req.params.id });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
