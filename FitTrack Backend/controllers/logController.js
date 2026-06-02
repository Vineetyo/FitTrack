const Log = require('../models/Log');
const Task = require('../models/Task');

// Helper: get the primary value from a log based on category
function getPrimaryValue(log, category) {
  switch (category) {
    case 'weightlifting': return log.weight || 0;
    case 'cardio':        return log.distance || 0;
    case 'bodyweight':    return log.reps || 0;
    default:              return log.weight || log.distance || log.reps || 0;
  }
}

exports.getLogs = async (req, res) => {
  try {
    const { taskId } = req.query;
    if (!taskId) return res.status(400).json({ message: 'taskId query param required' });

    const logs = await Log.find({ userId: req.user._id, taskId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createLog = async (req, res) => {
  try {
    const { taskId, date, sets, reps, weight, distance, duration, notes } = req.body;
    if (!taskId || !date) return res.status(400).json({ message: 'taskId and date are required' });

    // Get the task to know category
    const task = await Task.findOne({ _id: taskId, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Build log data
    const logData = {
      userId: req.user._id,
      taskId,
      date: new Date(date),
      sets: sets || null,
      reps: reps || null,
      weight: weight || null,
      distance: distance || null,
      duration: duration || null,
      notes: notes || '',
      isPR: false
    };

    // PR auto-detection: compare against all previous logs
    const previousLogs = await Log.find({ userId: req.user._id, taskId });
    const newValue = getPrimaryValue(logData, task.category);

    if (newValue > 0) {
      const previousMax = previousLogs.reduce((max, l) => {
        const val = getPrimaryValue(l, task.category);
        return val > max ? val : max;
      }, 0);

      if (newValue > previousMax) {
        logData.isPR = true;
      }
    }

    const log = await Log.create(logData);
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLog = async (req, res) => {
  try {
    const log = await Log.findOne({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const { date, sets, reps, weight, distance, duration, notes } = req.body;
    if (date !== undefined) log.date = new Date(date);
    if (sets !== undefined) log.sets = sets;
    if (reps !== undefined) log.reps = reps;
    if (weight !== undefined) log.weight = weight;
    if (distance !== undefined) log.distance = distance;
    if (duration !== undefined) log.duration = duration;
    if (notes !== undefined) log.notes = notes;

    await log.save();
    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const logs = await Log.find({ userId: req.user._id, taskId }).sort({ date: 1 });

    // --- Value over time (for line chart) ---
    const valueOverTime = logs.map(l => ({
      date: l.date,
      value: getPrimaryValue(l, task.category),
      isPR: l.isPR
    }));

    // --- Weekly volume (sets × reps per week) ---
    const weeklyMap = {};
    logs.forEach(l => {
      const d = new Date(l.date);
      // Get ISO week start (Monday)
      const day = d.getDay() || 7;
      const monday = new Date(d);
      monday.setDate(d.getDate() - day + 1);
      const weekKey = monday.toISOString().split('T')[0];

      if (!weeklyMap[weekKey]) weeklyMap[weekKey] = 0;
      weeklyMap[weekKey] += (l.sets || 0) * (l.reps || 0);
    });

    const weeklyVolume = Object.entries(weeklyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, volume]) => ({ week, volume }));

    // --- Best PR value ---
    let bestValue = 0;
    logs.forEach(l => {
      const v = getPrimaryValue(l, task.category);
      if (v > bestValue) bestValue = v;
    });

    // --- Progress vs target ---
    const progressPercent = task.targetValue > 0
      ? Math.min(Math.round((bestValue / task.targetValue) * 100), 100)
      : 0;

    // --- Status: logs in the last 7 days ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = logs.filter(l => new Date(l.date) >= sevenDaysAgo).length;

    let status = 'Inactive';
    if (recentCount >= 3) status = 'On Track';
    else if (recentCount >= 1) status = 'Slipping';

    res.json({
      task,
      valueOverTime,
      weeklyVolume,
      bestValue,
      targetValue: task.targetValue,
      progressPercent,
      status,
      totalLogs: logs.length,
      recentCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
