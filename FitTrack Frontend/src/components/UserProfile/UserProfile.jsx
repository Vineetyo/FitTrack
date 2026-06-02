
import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Save,
  User,
  Target,
  Leaf,
  CheckCircle,
  Pencil,
  X,
} from 'lucide-react';

import { API_BASE, authHeaders } from '../auth/auth.js';

import AvatarCard from './AvatarCard';
import PersonalInfoTab from './PersonalInfoTab';
import FitnessGoalsTab from './FitnessGoalsTab';
import DietaryTab from './DietaryTab';

import './profile.css';

const TABS = [
  { key: 'personal', label: 'Personal', icon: User },
  { key: 'goals', label: 'Fitness Goals', icon: Target },
  { key: 'dietary', label: 'Dietary', icon: Leaf },
];

const DEFAULT_PROFILE = {
  fullName: '',
  email: '',
  avatarInitial: '',
  avatarColor: '#00ffff',
  avatarUrl: '',
  age: '',
  gender: '',
};

const DEFAULT_GOALS = {
  currentWeight: '',
  targetWeight: '',
  dailyCalories: '',
  weeklyGoal: '',
  primaryGoal: '',
};

const DEFAULT_DIETARY = {
  dietType: 'all',
  allergies: [],
  customAllergy: '',
};

export default function UserProfile({ onBack }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [fitnessGoals, setFitnessGoals] = useState(DEFAULT_GOALS);
  const [dietary, setDietary] = useState(DEFAULT_DIETARY);

  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        headers: authHeaders(),
      });

      if (!res.ok) return;

      const data = await res.json();

      setProfile({
        fullName: data.fullName || '',
        email: data.email || '',
        avatarInitial:
          data.fullName?.[0]?.toUpperCase() || '',
        avatarColor: data.avatarColor || '#00ffff',
        avatarUrl: data.avatarUrl || '',
        age:
          data.age !== null && data.age !== undefined
            ? String(data.age)
            : '',
        gender: data.gender || '',
      });

      setFitnessGoals({
        currentWeight:
          data.fitnessGoals?.currentWeight ?? '',
        targetWeight:
          data.fitnessGoals?.targetWeight ?? '',
        dailyCalories:
          data.fitnessGoals?.dailyCalories ?? '',
        weeklyGoal:
          data.fitnessGoals?.weeklyGoal ?? '',
        primaryGoal:
          data.fitnessGoals?.primaryGoal || '',
      });

      setDietary({
        dietType: data.dietary?.dietType || 'all',
        allergies: data.dietary?.allergies || [],
        customAllergy:
          data.dietary?.customAllergy || '',
      });
    } catch (error) {
      console.error('Profile fetch failed:', error);
      setStatus({
        type: 'error',
        message: 'Unable to load profile. Please make sure the backend is running.',
      });
    }
  };

  const handleEditClick = () => {
    setSnapshot({
      profile: { ...profile },
      fitnessGoals: { ...fitnessGoals },
      dietary: {
        ...dietary,
        allergies: [...dietary.allergies],
      },
    });

    setIsEditing(true);

    setStatus({
      type: '',
      message: '',
    });
  };

  const handleCancel = () => {
    if (snapshot) {
      setProfile(snapshot.profile);
      setFitnessGoals(snapshot.fitnessGoals);
      setDietary(snapshot.dietary);
    }

    setIsEditing(false);
    setSnapshot(null);

    setStatus({
      type: '',
      message: '',
    });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValid =
    profile.fullName.trim() &&
    isValidEmail(profile.email);

  const isDirty = useMemo(() => {
    if (!snapshot) return false;

    return (
      JSON.stringify(profile) !==
        JSON.stringify(snapshot.profile) ||
      JSON.stringify(fitnessGoals) !==
        JSON.stringify(snapshot.fitnessGoals) ||
      JSON.stringify(dietary) !==
        JSON.stringify(snapshot.dietary)
    );
  }, [snapshot, profile, fitnessGoals, dietary]);

  const profileCompletion = useMemo(() => {
    const filled = [
      profile.fullName,
      profile.email,
      profile.age,
      profile.gender,
      fitnessGoals.currentWeight,
      fitnessGoals.targetWeight,
      fitnessGoals.dailyCalories,
      fitnessGoals.weeklyGoal,
      fitnessGoals.primaryGoal,
      dietary.dietType !== 'all' ||
      dietary.allergies.length > 0 ||
      dietary.customAllergy,
    ].filter(Boolean).length;

    return Math.round((filled / 10) * 100);
  }, [profile, fitnessGoals, dietary]);

  const handleSave = async () => {
    if (!isValid) {
      setStatus({
        type: 'error',
        message:
          'Please enter a valid name and email.',
      });

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/user/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
          body: JSON.stringify({
            fullName: profile.fullName.trim(),
            email: profile.email.trim(),
            avatarColor: profile.avatarColor,
            age:
              profile.age !== ''
                ? Number(profile.age)
                : null,
            gender: profile.gender,
            avatarUrl: profile.avatarUrl,

            fitnessGoals: {
              currentWeight:
                fitnessGoals.currentWeight !== ''
                  ? Number(
                      fitnessGoals.currentWeight
                    )
                  : null,

              targetWeight:
                fitnessGoals.targetWeight !== ''
                  ? Number(
                      fitnessGoals.targetWeight
                    )
                  : null,

              dailyCalories:
                fitnessGoals.dailyCalories !== ''
                  ? Number(
                      fitnessGoals.dailyCalories
                    )
                  : null,

              weeklyGoal:
                fitnessGoals.weeklyGoal !== ''
                  ? Number(
                      fitnessGoals.weeklyGoal
                    )
                  : null,

              primaryGoal:
                fitnessGoals.primaryGoal || '',
            },

            dietary,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            'Unable to save profile'
        );
      }

      setProfile({
        fullName:
          result.fullName || profile.fullName,

        email: result.email || profile.email,

        avatarInitial:
          result.fullName?.[0]?.toUpperCase() ||
          profile.avatarInitial,

        avatarColor:
          result.avatarColor ||
          profile.avatarColor,

        avatarUrl:
          result.avatarUrl || profile.avatarUrl,

        age:
          result.age !== null &&
          result.age !== undefined
            ? String(result.age)
            : profile.age,

        gender:
          result.gender || profile.gender,
      });

      setFitnessGoals({
        currentWeight:
          result.fitnessGoals?.currentWeight ??
          fitnessGoals.currentWeight,

        targetWeight:
          result.fitnessGoals?.targetWeight ??
          fitnessGoals.targetWeight,

        dailyCalories:
          result.fitnessGoals?.dailyCalories ??
          fitnessGoals.dailyCalories,

        weeklyGoal:
          result.fitnessGoals?.weeklyGoal ??
          fitnessGoals.weeklyGoal,

        primaryGoal:
          result.fitnessGoals?.primaryGoal ||
          fitnessGoals.primaryGoal,
      });

      setDietary({
        dietType:
          result.dietary?.dietType ||
          dietary.dietType,

        allergies:
          result.dietary?.allergies ||
          dietary.allergies,

        customAllergy:
          result.dietary?.customAllergy ||
          dietary.customAllergy,
      });

      setSaved(true);
      setIsEditing(false);
      setSnapshot(null);

      setStatus({
        type: 'success',
        message:
          'Profile updated successfully.',
      });

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(error);

      setStatus({
        type: 'error',
        message:
          typeof error.message === 'string' &&
          error.message.toLowerCase().includes('failed to fetch')
            ? 'Unable to reach the backend. Check that the server is running and your browser is allowed to access localhost.'
            : error.message ||
              'Failed to save profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-header">

        <button
          className="back-btn-profile"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="profile-header-row">

          <div>
            <div className="profile-header-title">
              <span className="profile-header-icon">
                👤
              </span>

              <h1>My Profile</h1>
            </div>

            <p className="profile-header-sub">
              {isEditing
                ? 'Editing your profile — save when done'
                : 'Your personal info, goals & preferences'}
            </p>
          </div>

          {!isEditing ? (
            <button
              className="edit-btn"
              onClick={handleEditClick}
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          ) : (
            <button
              className="cancel-btn"
              onClick={handleCancel}
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="profile-body">

        <AvatarCard
          profile={profile}
          onProfileChange={setProfile}
          isEditing={isEditing}
        />

        <div className="profile-main">

          <div className="tab-bar">
            {TABS.map(
              ({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`tab-btn ${
                    activeTab === key
                      ? 'tab-btn-active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveTab(key)
                  }
                >
                  <Icon size={16} />
                  {label}
                </button>
              )
            )}
          </div>

          {isEditing && (
            <div className="editing-banner">
              <Pencil size={13} />
              You are in edit mode
            </div>
          )}

          <div className="tab-content">

            {activeTab === 'personal' && (
              <PersonalInfoTab
                profile={profile}
                onProfileChange={setProfile}
                isEditing={isEditing}
              />
            )}

            {activeTab === 'goals' && (
              <FitnessGoalsTab
                fitnessGoals={fitnessGoals}
                onGoalsChange={setFitnessGoals}
                isEditing={isEditing}
              />
            )}

            {activeTab === 'dietary' && (
              <DietaryTab
                dietary={dietary}
                onDietaryChange={setDietary}
                isEditing={isEditing}
              />
            )}
          </div>

          {status.message && (
            <div
              className={`status-message ${
                status.type === 'success'
                  ? 'status-success'
                  : 'status-error'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle size={16} />
              ) : (
                <X size={16} />
              )}

              {status.message}
            </div>
          )}

          {isEditing && (
            <div className="save-row">
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading || !isDirty}
              >
                {loading ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {!isEditing && saved && (
            <div className="save-row">
              <div className="saved-badge">
                <CheckCircle size={16} />
                Profile saved successfully!
              </div>
            </div>
          )}

          <div className="completion-meter">
            <div className="completion-label">
              Profile Completion:
              {profileCompletion}%
            </div>

            <div className="completion-bar">
              <div
                className="completion-fill"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
