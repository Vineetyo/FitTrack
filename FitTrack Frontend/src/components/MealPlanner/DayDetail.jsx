import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import RecipeSelector from './RecipeSelector';
import NutritionSummary from './NutritionSummary';

const DayDetail = ({ selectedDay, mealPlan, formatDateKey, onAddMeal, onRemoveMeal, onBack }) => {
  const [showRecipeSelector, setShowRecipeSelector] = useState(null);

  const dateKey = formatDateKey(selectedDay);
  const dayMeals = mealPlan[dateKey] || {};

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'snacks', label: 'Snacks', icon: '🍿' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSelectRecipe = (recipe) => {
    onAddMeal(showRecipeSelector, recipe);
    setShowRecipeSelector(null);
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        <ArrowLeft size={20} />
        <span>Back to Calendar</span>
      </button>

      <div style={styles.header}>
        <h2 style={styles.date}>{formatDate(selectedDay)}</h2>
      </div>

      <div style={styles.content}>
        <div style={styles.mealsSection}>
          <h3 style={styles.sectionTitle}>Meals</h3>

          <div style={styles.mealsList}>
            {mealTypes.map(({ key, label, icon }) => (
              <div key={key} style={styles.mealCard}>
                <div style={styles.mealHeader}>
                  <div style={styles.mealTitle}>
                    <span style={styles.mealIcon}>{icon}</span>
                    <h4 style={styles.mealLabel}>{label}</h4>
                  </div>

                  {!dayMeals[key] && (
                    <button
                      onClick={() => setShowRecipeSelector(key)}
                      style={styles.addButton}
                    >
                      <Plus size={20} />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {dayMeals[key] ? (
                  <div style={styles.mealContent}>
                    <div style={styles.recipeInfo}>
                      <div>
                        <p style={styles.recipeName}>{dayMeals[key].name}</p>
                        <p style={styles.recipeCalories}>{dayMeals[key].calories} cal</p>
                      </div>

                      <button
                        onClick={() => onRemoveMeal(key)}
                        style={styles.removeButton}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={styles.emptyMeal}>No meal planned</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <NutritionSummary dayMeals={dayMeals} />
      </div>

      {showRecipeSelector && (
        <RecipeSelector
          mealType={showRecipeSelector}
          onSelect={handleSelectRecipe}
          onClose={() => setShowRecipeSelector(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '2px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '2rem'
  },
  backButton: {
    background: 'transparent',
    border: '2px solid cyan',
    color: 'cyan',
    padding: '0.7rem 1.5rem',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    transition: 'all 0.3s ease'
  },
  header: {
    marginBottom: '2rem'
  },
  date: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'cyan',
    margin: 0
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  mealsSection: {
    minHeight: '400px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'cyan',
    marginBottom: '1.5rem'
  },
  mealsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mealCard: {
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease'
  },
  mealHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  mealTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  mealIcon: {
    fontSize: '1.5rem'
  },
  mealLabel: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#fff',
    margin: 0
  },
  addButton: {
    background: 'cyan',
    border: 'none',
    color: '#000',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease'
  },
  mealContent: {
    paddingTop: '0.5rem'
  },
  recipeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '1rem',
    borderRadius: '8px'
  },
  recipeName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 0.25rem 0'
  },
  recipeCalories: {
    fontSize: '0.9rem',
    color: 'cyan',
    margin: 0
  },
  removeButton: {
    background: 'rgba(255, 0, 0, 0.2)',
    border: '1px solid rgba(255, 0, 0, 0.4)',
    color: '#ff4444',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  emptyMeal: {
    color: '#888',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    margin: 0
  }
};

export default DayDetail;
