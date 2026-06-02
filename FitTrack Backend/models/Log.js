const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sets: {
    type: Number,
    default: null
  },
  reps: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  distance: {
    type: Number,
    default: null
  },
  duration: {
    type: Number,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  isPR: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);
