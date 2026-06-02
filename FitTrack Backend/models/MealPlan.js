const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    date: {
        type: String,
        required: true
    },
    meals: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

mealPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
