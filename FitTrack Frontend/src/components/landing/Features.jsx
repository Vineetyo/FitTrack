import React from 'react';
import FeatureCard from './FeatureCard.jsx';

const Features = ({ onSmartRecipesClick, onMealPlanningClick, onLogWorkoutsClick, onProgressTrackerClick }) => {
  const features = [
    { icon: '🍳', title: 'Smart Recipes', desc: 'Personalized recipe ideas that match your calories and diet type.' },
    { icon: '📅', title: 'Meal Planning', desc: 'Plan your meals for the week and simplify grocery lists.' },
    { icon: '🏋️', title: 'Log Workouts', desc: 'Track your sets, reps, and weights for every exercise session.' },
    { icon: '📈', title: 'Progress Tracker', desc: 'Visualize your gains with charts, PRs, and progress insights.' }
  ];

  const handleFeatureClick = (title) => {
    if (title === 'Smart Recipes') {
      onSmartRecipesClick();
    } else if (title === 'Meal Planning') {
      onMealPlanningClick();
    } else if (title === 'Log Workouts') {
      if (onLogWorkoutsClick) onLogWorkoutsClick();
    } else if (title === 'Progress Tracker') {
      if (onProgressTrackerClick) onProgressTrackerClick();
    } else {
      console.log(`${title} clicked - feature coming soon!`);
    }
  };

  return (
    <section className="features" id="features">
      <h2>Everything You Need</h2>
      <p>Tools built to help you achieve your goals</p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} onClick={() => handleFeatureClick(feature.title)} style={{ cursor: 'pointer' }}>
            <FeatureCard 
              icon={feature.icon}
              title={feature.title}
              description={feature.desc}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;