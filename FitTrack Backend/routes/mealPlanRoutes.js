const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const auth = require('../middleware/authMiddleware');

router.get('/date/:date', auth, mealPlanController.getMealPlanByDate);
router.get('/month', auth, mealPlanController.getMealPlansForMonth);
router.put('/date/:date', auth, mealPlanController.upsertMealPlan);
router.delete('/date/:date', auth, mealPlanController.deleteMealPlan);

module.exports = router;
