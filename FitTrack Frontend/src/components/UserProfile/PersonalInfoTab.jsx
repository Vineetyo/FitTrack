import React from 'react';

const GENDER_LABELS = {
  male: 'Male', female: 'Female', 'non-binary': 'Non-binary', 'prefer-not': 'Prefer not to say', '': '—'
};

export default function PersonalInfoTab({ profile, onProfileChange, isEditing }) {
  if (!isEditing) {
    return (
      <div className="fields-grid">
        <div className="field-group">
          <label>Full Name</label>
          <div className="field-value">{profile.fullName || '—'}</div>
        </div>
        <div className="field-group">
          <label>Email</label>
          <div className="field-value">{profile.email || '—'}</div>
        </div>
        <div className="field-group">
          <label>Age</label>
          <div className="field-value">{profile.age || '—'}</div>
        </div>
        <div className="field-group">
          <label>Gender</label>
          <div className="field-value">{GENDER_LABELS[profile.gender] || '—'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fields-grid">
      <div className="field-group">
        <label>Full Name</label>
        <input
          value={profile.fullName}
          onChange={e =>
            onProfileChange(p => ({
              ...p,
              fullName: e.target.value,
              avatarInitial: e.target.value[0]?.toUpperCase() || '',
            }))
          }
          placeholder="John Doe"
        />
      </div>

      <div className="field-group">
        <label>Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={e => onProfileChange(p => ({ ...p, email: e.target.value }))}
          placeholder="john@example.com"
        />
      </div>

      <div className="field-group">
        <label>Age</label>
        <input
          type="number"
          value={profile.age}
          onChange={e => onProfileChange(p => ({ ...p, age: e.target.value }))}
          placeholder="25"
          min="10"
          max="120"
        />
      </div>

      <div className="field-group">
        <label>Gender</label>
        <select
          value={profile.gender}
          onChange={e => onProfileChange(p => ({ ...p, gender: e.target.value }))}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not">Prefer not to say</option>
        </select>
      </div>
    </div>
  );
}