import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Target, Leaf, CheckCircle, Pencil, X } from 'lucide-react';
import { API_BASE, authHeaders } from '../auth/auth.js';
import AvatarCard from './AvatarCard';
import PersonalInfoTab from './PersonalInfoTab';
import FitnessGoalsTab from './FitnessGoalsTab';
import DietaryTab from './DietaryTab';
import './profile.css';
 
const TABS = [
  { key: 'personal', label: 'Personal',      icon: User   },
  { key: 'goals',    label: 'Fitness Goals', icon: Target },
  { key: 'dietary',  label: 'Dietary',       icon: Leaf   },
];
 
export default function UserProfile({ onBack }) {
  const [activeTab,  setActiveTab]  = useState('personal');
  const [isEditing,  setIsEditing]  = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [loading,    setLoading]    = useState(false);
 
  const [profile, setProfile] = useState({
    fullName: '', email: '', avatarInitial: '', avatarColor: '#00ffff', age: '', gender: '',
  });
 
  // Snapshot to restore on Cancel
  const [snapshot, setSnapshot] = useState(null);
 
  const [fitnessGoals, setFitnessGoals] = useState({
    currentWeight: '', targetWeight: '', dailyCalories: '', weeklyGoal: '', primaryGoal: '',
  });
 
  const [dietary, setDietary] = useState({
    dietType: 'all', allergies: [], customAllergy: '',
  });
 
  useEffect(() => { fetchProfile(); }, []);
 
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/profile`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.fullName)     setProfile(p => ({ ...p, ...data, avatarInitial: data.fullName?.[0]?.toUpperCase() || '?' }));
        if (data.fitnessGoals) setFitnessGoals(data.fitnessGoals);
        if (data.dietary)      setDietary(data.dietary);
      }
    } catch (_) { /* use defaults */ }
  };
 
  const handleEditClick = () => {
    // Save snapshot so Cancel can fully restore previous values
    setSnapshot({
      profile:      { ...profile },
      fitnessGoals: { ...fitnessGoals },
      dietary:      { ...dietary, allergies: [...dietary.allergies] },
    });
    setIsEditing(true);
  };
 
  const handleCancel = () => {
    if (snapshot) {
      setProfile(snapshot.profile);
      setFitnessGoals(snapshot.fitnessGoals);
      setDietary(snapshot.dietary);
    }
    setIsEditing(false);
    setSnapshot(null);
  };
 
  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...profile, fitnessGoals, dietary }),
      });
      setSaved(true);
      setIsEditing(false);
      setSnapshot(null);
      setTimeout(() => setSaved(false), 2500);
    } catch (_) {
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-inner">
          <button className="back-btn-profile" onClick={onBack}>
            <ArrowLeft size={18} />
            Back to Home
          </button>
 
          <div className="profile-header-row">
            <div>
              <div className="profile-header-title">
                <span className="profile-header-icon">👤</span>
                <h1>My Profile</h1>
              </div>
              <p className="profile-header-sub">
                {isEditing
                  ? 'Editing your profile — save when done'
                  : 'Your personal info, goals & preferences'}
              </p>
            </div>
 
            {/* Edit / Cancel button — top right */}
            {!isEditing ? (
              <button className="edit-btn" onClick={handleEditClick}>
                <Pencil size={16} />
                Edit Profile
              </button>
            ) : (
              <button className="cancel-btn" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
 
      {/* Body */}
      <div className="profile-body">
        <AvatarCard profile={profile} onProfileChange={setProfile} isEditing={isEditing} />
 
        <div className="profile-main">
          {/* Tab Bar */}
          <div className="tab-bar">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`tab-btn ${activeTab === key ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
 
          {/* Editing mode banner */}
          {isEditing && (
            <div className="editing-banner">
              <Pencil size={13} /> You are in edit mode
            </div>
          )}
 
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'personal' && (
              <PersonalInfoTab profile={profile} onProfileChange={setProfile} isEditing={isEditing} />
            )}
            {activeTab === 'goals' && (
              <FitnessGoalsTab fitnessGoals={fitnessGoals} onGoalsChange={setFitnessGoals} isEditing={isEditing} />
            )}
            {activeTab === 'dietary' && (
              <DietaryTab dietary={dietary} onDietaryChange={setDietary} isEditing={isEditing} />
            )}
          </div>
 
          {/* Save Row — only visible while editing */}
          {isEditing && (
            <div className="save-row">
              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? <span className="spinner" /> : <><Save size={18} />Save Changes</>}
              </button>
            </div>
          )}
 
          {/* Saved confirmation shown in view mode after save */}
          {!isEditing && saved && (
            <div className="save-row">
              <div className="saved-badge">
                <CheckCircle size={16} />
                Profile saved successfully!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}