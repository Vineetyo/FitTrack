import React from 'react';
 
const GOAL_OPTIONS = ['Lose Weight', 'Gain Muscle', 'Maintain Weight', 'Improve Endurance', 'Eat Healthier'];
 
export default function FitnessGoalsTab({ fitnessGoals, onGoalsChange, isEditing }) {
 
  // Progress bar (shown in both modes)
  const WeightProgress = () => (
    fitnessGoals.currentWeight && fitnessGoals.targetWeight ? (
      <div className="progress-card">
        <div className="progress-header">
          <span>Weight Progress</span>
          <span
            className="progress-delta"
            style={{ color: fitnessGoals.targetWeight < fitnessGoals.currentWeight ? '#34d399' : '#fbbf24' }}
          >
            {Math.abs(fitnessGoals.currentWeight - fitnessGoals.targetWeight).toFixed(1)} kg to go
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(100, Math.max(5,
                (1 - Math.abs(fitnessGoals.currentWeight - fitnessGoals.targetWeight) /
                  Math.max(fitnessGoals.currentWeight, 1)) * 100
              ))}%`,
            }}
          />
        </div>
        <div className="progress-labels">
          <span>{fitnessGoals.currentWeight} kg</span>
          <span>{fitnessGoals.targetWeight} kg</span>
        </div>
      </div>
    ) : null
  );
 
  if (!isEditing) {
    return (
      <div>
        <div className="fields-grid">
          <div className="field-group">
            <label>Current Weight (kg)</label>
            <div className="field-value">{fitnessGoals.currentWeight || '—'}</div>
          </div>
          <div className="field-group">
            <label>Target Weight (kg)</label>
            <div className="field-value">{fitnessGoals.targetWeight || '—'}</div>
          </div>
          <div className="field-group">
            <label>Daily Calorie Target</label>
            <div className="field-value">{fitnessGoals.dailyCalories ? `${fitnessGoals.dailyCalories} kcal` : '—'}</div>
          </div>
          <div className="field-group">
            <label>Weekly Workout Goal</label>
            <div className="field-value">{fitnessGoals.weeklyGoal ? `${fitnessGoals.weeklyGoal} days/week` : '—'}</div>
          </div>
        </div>
 
        {fitnessGoals.primaryGoal && (
          <div className="field-group" style={{ marginTop: '1.5rem' }}>
            <label>Primary Goal</label>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="pill pill-active">{fitnessGoals.primaryGoal}</span>
            </div>
          </div>
        )}
 
        <WeightProgress />
      </div>
    );
  }
 
  return (
    <div>
      <div className="fields-grid">
        <div className="field-group">
          <label>Current Weight (kg)</label>
          <input
            type="number"
            value={fitnessGoals.currentWeight}
            onChange={e => onGoalsChange(g => ({ ...g, currentWeight: e.target.value }))}
            placeholder="70"
          />
        </div>
        <div className="field-group">
          <label>Target Weight (kg)</label>
          <input
            type="number"
            value={fitnessGoals.targetWeight}
            onChange={e => onGoalsChange(g => ({ ...g, targetWeight: e.target.value }))}
            placeholder="65"
          />
        </div>
        <div className="field-group">
          <label>Daily Calorie Target</label>
          <input
            type="number"
            value={fitnessGoals.dailyCalories}
            onChange={e => onGoalsChange(g => ({ ...g, dailyCalories: e.target.value }))}
            placeholder="2000"
          />
        </div>
        <div className="field-group">
          <label>Weekly Workout Goal (days)</label>
          <input
            type="number"
            value={fitnessGoals.weeklyGoal}
            onChange={e => onGoalsChange(g => ({ ...g, weeklyGoal: e.target.value }))}
            placeholder="4"
            min="0" max="7"
          />
        </div>
      </div>
 
      <div className="field-group" style={{ marginTop: '1.5rem' }}>
        <label>Primary Goal</label>
        <div className="pill-group">
          {GOAL_OPTIONS.map(goal => (
            <button
              key={goal}
              className={`pill ${fitnessGoals.primaryGoal === goal ? 'pill-active' : ''}`}
              onClick={() => onGoalsChange(g => ({ ...g, primaryGoal: goal }))}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>
 
      <WeightProgress />
    </div>
  );
}