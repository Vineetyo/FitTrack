const Recipe = require('../models/Recipe');

exports.getRecipes = async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (search) {
      const terms = search.split(',').map(t => t.trim()).filter(Boolean);
      query.$or = [
        { name: { $regex: terms.join('|'), $options: 'i' } },
        { ingredients: { $in: terms.map(t => new RegExp(t, 'i')) } }
      ];
    }

    if (filter) {
      if (filter === 'veg') query.category = 'veg';
      else if (filter === 'non-veg') query.category = 'non-veg';
      else if (filter === 'high-protein') query.protein = 'high';
      else if (filter === 'low-calorie') query.calories = { $lt: 400 };
    }

    const recipes = await Recipe.find(query).limit(200);
    res.json({ count: recipes.length, recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Not found' });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
