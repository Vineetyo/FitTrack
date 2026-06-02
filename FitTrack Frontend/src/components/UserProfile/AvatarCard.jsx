import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const AVATAR_COLORS = ['#00ffff', '#ff6b6b', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'];

export default function AvatarCard({ profile, onProfileChange, isEditing }) {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const maxSize = 2 * 1024 * 1024; // 2MB max

    if (!isImage) {
      setUploadError('Only image files are supported.');
      event.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      setUploadError('Image too large. Please use a file under 2MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onProfileChange((prev) => ({
        ...prev,
        avatarUrl: reader.result,
        avatarInitial: '',
      }));
      setUploadError('');
      event.target.value = '';
    };
    reader.onerror = () => {
      setUploadError('Unable to read the selected image. Please try another file.');
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="avatar-card">
      <div
        className="avatar-ring"
        onClick={() => isEditing && fileInputRef.current?.click()}
        style={{ cursor: isEditing ? 'pointer' : 'default' }}
      >
        <div
          className="avatar-circle"
          style={{
            background: profile.avatarUrl
              ? `url(${profile.avatarUrl}) center/cover no-repeat`
              : `radial-gradient(circle at 30% 30%, ${profile.avatarColor}55, ${profile.avatarColor}22)`,
            border: `2px solid ${profile.avatarColor}`,
          }}
        >
          {!profile.avatarUrl && (
            <span className="avatar-letter">
              {profile.avatarInitial || profile.fullName?.[0]?.toUpperCase() || '?'}
            </span>
          )}
        </div>
        {isEditing && (
          <div className="avatar-camera-overlay">
            <Camera size={20} />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {uploadError && (
        <div className="upload-error">{uploadError}</div>
      )}

      <h2 className="avatar-name">{profile.fullName || 'Your Name'}</h2>
      <p className="avatar-email">{profile.email || 'your@email.com'}</p>

      {/* Color picker only in edit mode */}
      {isEditing && (
        <div className="color-row">
          {AVATAR_COLORS.map(c => (
            <div
              key={c}
              className={`color-dot ${profile.avatarColor === c ? 'color-dot-active' : ''}`}
              style={{ background: c }}
              onClick={() => onProfileChange(p => ({ ...p, avatarColor: c }))}
            />
          ))}
        </div>
      )}

      {/* View mode: show a small colored dot indicating current color */}
      {!isEditing && (
        <div className="avatar-color-preview" style={{ background: profile.avatarColor }} />
      )}
    </div>
  );
}