const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  ingredients: [{
    type: String
  }],
  image: String,
  prepTime: String,
  cookTime: String,
  servings: Number,
  difficulty: String,
  calories: Number,
  category: String,
  protein: String,
  description: String,
  instructions: [{
    type: String
  }],
  nutrition: {
    protein: String,
    carbs: String,
    fat: String,
    fiber: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
