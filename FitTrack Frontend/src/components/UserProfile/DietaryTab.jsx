import React from 'react';

const DIET_TYPES = [
  { value: 'all', label: 'All Foods', emoji: '🍽️' },
  { value: 'veg', label: 'Vegetarian', emoji: '🥗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'keto', label: 'Keto', emoji: '🥩' },
  { value: 'paleo', label: 'Paleo', emoji: '🍖' },
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
];

const ALLERGY_OPTIONS = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Fish', 'Wheat'];

export default function DietaryTab({ dietary, onDietaryChange, isEditing }) {
  const toggleAllergy = (allergy) => {
    onDietaryChange((d) => ({
      ...d,
      allergies: d.allergies.includes(allergy)
        ? d.allergies.filter((a) => a !== allergy)
        : [...d.allergies, allergy],
    }));
  };

  const activeDiet = DIET_TYPES.find((d) => d.value === dietary.dietType);

  if (!isEditing) {
    return (
      <div className="view-grid">
        <div className="view-field" style={{ gridColumn: '1 / -1' }}>
          <span className="view-label">Diet Type</span>
          <span className="view-value">
            {activeDiet ? `${activeDiet.emoji} ${activeDiet.label}` : '—'}
          </span>
        </div>

        <div className="view-field" style={{ gridColumn: '1 / -1' }}>
          <span className="view-label">Allergies & Intolerances</span>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {dietary.allergies.length > 0 ? (
              dietary.allergies.map((allergy) => (
                <span key={allergy} className="pill pill-active pill-danger">
                  {allergy}
                </span>
              ))
            ) : (
              <span className="view-value">None</span>
            )}
          </div>
        </div>

        {dietary.customAllergy && (
          <div className="view-field" style={{ gridColumn: '1 / -1' }}>
            <span className="view-label">Other Notes</span>
            <span className="view-value">{dietary.customAllergy}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="field-group">
        <label>Diet Type</label>
        <div className="diet-cards">
          {DIET_TYPES.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              className={`diet-card ${dietary.dietType === value ? 'diet-card-active' : ''}`}
              onClick={() => onDietaryChange((d) => ({ ...d, dietType: value }))}
            >
              <span className="diet-emoji">{emoji}</span>
              <span className="diet-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field-group" style={{ marginTop: '2rem' }}>
        <label>Allergies & Intolerances</label>
        <div className="pill-group">
          {ALLERGY_OPTIONS.map((allergy) => (
            <button
              key={allergy}
              type="button"
              className={`pill ${dietary.allergies.includes(allergy) ? 'pill-active pill-danger' : ''}`}
              onClick={() => toggleAllergy(allergy)}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>

      <div className="field-group" style={{ marginTop: '1.5rem' }}>
        <label>Other dietary notes</label>
        <textarea
          value={dietary.customAllergy}
          onChange={(e) => onDietaryChange((d) => ({ ...d, customAllergy: e.target.value }))}
          placeholder="e.g. Low sodium, no added sugar..."
          rows={3}
        />
      </div>
    </div>
  );
}
 