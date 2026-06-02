import React from 'react';

const NutritionSummary = ({ dayMeals }) => {
  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    Object.values(dayMeals).forEach(meal => {
      totalCalories += meal.calories || 0;
      totalProtein += parseFloat(meal.nutrition?.protein) || 0;
      totalCarbs += parseFloat(meal.nutrition?.carbs) || 0;
      totalFat += parseFloat(meal.nutrition?.fat) || 0;
    });

    return {
      calories: totalCalories,
      protein: totalProtein.toFixed(1),
      carbs: totalCarbs.toFixed(1),
      fat: totalFat.toFixed(1)
    };
  };

  const nutrition = calculateNutrition();
  const hasMeals = Object.keys(dayMeals).length > 0;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Daily Summary</h3>
      
      {!hasMeals ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📊</span>
          <p style={styles.emptyText}>Add meals to see nutrition summary</p>
        </div>
      ) : (
        <>
          <div style={styles.caloriesCard}>
            <div style={styles.caloriesIcon}>🔥</div>
            <div>
              <p style={styles.caloriesLabel}>Total Calories</p>
              <p style={styles.caloriesValue}>{nutrition.calories}</p>
            </div>
          </div>

          <div style={styles.macrosGrid}>
            <div style={styles.macroCard}>
              <div style={styles.macroIcon}>💪</div>
              <div style={styles.macroContent}>
                <p style={styles.macroLabel}>Protein</p>
                <p style={styles.macroValue}>{nutrition.protein}g</p>
              </div>
            </div>

            <div style={styles.macroCard}>
              <div style={styles.macroIcon}>🌾</div>
              <div style={styles.macroContent}>
                <p style={styles.macroLabel}>Carbs</p>
                <p style={styles.macroValue}>{nutrition.carbs}g</p>
              </div>
            </div>

            <div style={styles.macroCard}>
              <div style={styles.macroIcon}>🥑</div>
              <div style={styles.macroContent}>
                <p style={styles.macroLabel}>Fat</p>
                <p style={styles.macroValue}>{nutrition.fat}g</p>
              </div>
            </div>
          </div>

          <div style={styles.mealsCount}>
            <p style={styles.mealsCountText}>
              {Object.keys(dayMeals).length} {Object.keys(dayMeals).length === 1 ? 'meal' : 'meals'} planned
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'cyan',
    marginBottom: '1.5rem',
    marginTop: 0
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 0'
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  },
  emptyText: {
    color: '#888',
    fontSize: '0.95rem',
    margin: 0
  },
  caloriesCard: {
    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.05))',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  caloriesIcon: {
    fontSize: '2.5rem'
  },
  caloriesLabel: {
    color: '#aaa',
    fontSize: '0.9rem',
    margin: '0 0 0.25rem 0'
  },
  caloriesValue: {
    color: 'cyan',
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
  },
  macrosGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  macroCard: {
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  macroIcon: {
    fontSize: '1.5rem'
  },
  macroContent: {
    flex: 1
  },
  macroLabel: {
    color: '#aaa',
    fontSize: '0.85rem',
    margin: '0 0 0.25rem 0'
  },
  macroValue: {
    color: 'cyan',
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: 0
  },
  mealsCount: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(0, 255, 255, 0.2)'
  },
  mealsCountText: {
    color: '#aaa',
    fontSize: '0.9rem',
    margin: 0
  }
};

export default NutritionSummary;