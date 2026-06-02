// require('dotenv').config();
// const connectDB = require('../config/db');
// const Recipe = require('../models/Recipe');

// const sample = [
//   {
//     name: 'Spaghetti Carbonara',
//     ingredients: ['pasta','eggs','bacon','parmesan','black pepper'],
//     image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
//     prepTime: '15 min',
//     cookTime: '15 min',
//     servings: 4,
//     difficulty: 'Medium',
//     calories: 450,
//     category: 'non-veg',
//     protein: 'high',
//     description: 'A classic Italian pasta dish with a creamy egg and cheese sauce, crispy bacon, and black pepper.',
//     instructions: ['Boil pasta','Cook bacon','Mix eggs and parmesan','Combine and serve'],
//     nutrition: { protein: '22', carbs: '52', fat: '18', fiber: '3' }
//   },
//   {
//     name: 'Veggie Stir Fry',
//     ingredients: ['broccoli','carrots','bell peppers','soy sauce','garlic','ginger','rice'],
//     image: '',
//     prepTime: '15 min',
//     cookTime: '10 min',
//     servings: 4,
//     difficulty: 'Easy',
//     calories: 320,
//     category: 'veg',
//     protein: 'medium',
//     description: 'A colorful and healthy vegetable stir fry.',
//     instructions: ['Chop veg','Stir fry','Serve with rice'],
//     nutrition: { protein: '8', carbs: '58', fat: '8', fiber: '6' }
//   }
// ];

// const run = async () => {
//   await connectDB();
//   await Recipe.deleteMany({});
//   await Recipe.insertMany(sample);
//   console.log('Seeded recipes');
//   process.exit(0);
// };

// run().catch(err => { console.error(err); process.exit(1); });
