const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  // Profile fields
  avatarColor: {
    type: String,
    default: '#00ffff'
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not', ''],
    default: ''
  },

  fitnessGoals: {
    currentWeight: { type: Number, default: null },
    targetWeight:  { type: Number, default: null },
    dailyCalories: { type: Number, default: null },
    weeklyGoal:    { type: Number, default: null },
    primaryGoal:   { type: String, default: '' }
  },

  dietary: {
    dietType:     { type: String, default: 'all' },
    allergies:    { type: [String], default: [] },
    customAllergy:{ type: String, default: '' }
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);