import React, { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  { value: 'weightlifting', label: 'Weightlifting', icon: '🏋️' },
  { value: 'cardio', label: 'Cardio', icon: '🏃' },
  { value: 'bodyweight', label: 'Bodyweight', icon: '💪' },
  { value: 'custom', label: 'Custom', icon: '⚡' }
];

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('custom');
  const [unit, setUnit] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setCategory(task.category || 'custom');
      setUnit(task.unit || '');
      setTargetValue(task.targetValue || '');
    } else {
      // Reset for new task
      setName('');
      setCategory('custom');
      setUnit('');
      setTargetValue('');
    }
    setError('');
  }, [task]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCat = CATEGORIES.find(c => c.value === category) || CATEGORIES[3];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Task name is required');
      return;
    }
    onSubmit({
      name: name.trim(),
      category,
      unit: unit.trim(),
      targetValue: Number(targetValue) || 0
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>&times;</button>

        <div style={styles.header}>
          <span style={styles.headerIcon}>{task ? '✏️' : '➕'}</span>
          <h2 style={styles.title}>{task ? 'Edit Task' : 'New Task'}</h2>
        </div>
        <p style={styles.subtitle}>
          {task ? 'Update your workout task details' : 'Create a new workout task to track'}
        </p>

        {error && (
          <div style={styles.error}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Task Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder='e.g. "Bench Press"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Custom dropdown for category */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div
                style={styles.customSelect}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span style={styles.selectContent}>
                  <span style={{ marginRight: '0.5rem' }}>{selectedCat.icon}</span>
                  {selectedCat.label}
                </span>
                <span style={{
                  ...styles.selectArrow,
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▾
                </span>
              </div>
              {dropdownOpen && (
                <div style={styles.dropdown}>
                  {CATEGORIES.map((c) => (
                    <div
                      key={c.value}
                      style={{
                        ...styles.dropdownItem,
                        background: category === c.value
                          ? 'rgba(0, 255, 255, 0.15)'
                          : 'transparent'
                      }}
                      onClick={() => {
                        setCategory(c.value);
                        setDropdownOpen(false);
                      }}
                      onMouseEnter={(e) => {
                        if (category !== c.value) {
                          e.currentTarget.style.background = 'rgba(0, 255, 255, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (category !== c.value) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <span style={{ marginRight: '0.6rem' }}>{c.icon}</span>
                      <span>{c.label}</span>
                      {category === c.value && (
                        <span style={styles.checkmark}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Unit</label>
              <input
                style={styles.input}
                type="text"
                placeholder='e.g. "kg", "km", "mins"'
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Target Value</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="100"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>

      <style>{`
        .pt-input:focus {
          border-color: cyan !important;
          background: rgba(0, 255, 255, 0.1) !important;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '2rem',
    animation: 'fadeIn 0.3s ease'
  },
  card: {
    background: 'rgba(10, 10, 10, 0.95)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '25px',
    padding: '2.5rem',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  closeBtn: {
    position: 'absolute',
    top: '1.2rem',
    right: '1.5rem',
    background: 'transparent',
    border: 'none',
    color: 'cyan',
    fontSize: '2rem',
    cursor: 'pointer',
    lineHeight: 1,
    transition: 'opacity 0.3s'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '0.3rem'
  },
  headerIcon: { fontSize: '1.8rem' },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 700,
    color: 'cyan'
  },
  subtitle: {
    color: '#888',
    fontSize: '0.95rem',
    marginBottom: '1.8rem',
    marginTop: '0.3rem'
  },
  error: {
    background: 'rgba(255, 60, 60, 0.15)',
    border: '1px solid rgba(255, 60, 60, 0.4)',
    borderRadius: '12px',
    padding: '0.7rem 1rem',
    color: '#ff5555',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.3rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    color: 'cyan',
    fontWeight: 600,
    fontSize: '0.9rem'
  },
  input: {
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    colorScheme: 'dark'
  },
  customSelect: {
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
    userSelect: 'none'
  },
  selectContent: {
    display: 'flex',
    alignItems: 'center'
  },
  selectArrow: {
    color: 'cyan',
    fontSize: '1rem',
    transition: 'transform 0.2s ease'
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'rgba(15, 15, 15, 0.98)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: 100,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
  },
  dropdownItem: {
    padding: '0.8rem 1rem',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.95rem',
    transition: 'background 0.2s ease'
  },
  checkmark: {
    marginLeft: 'auto',
    color: 'cyan',
    fontWeight: 700
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  submitBtn: {
    background: 'cyan',
    color: '#000',
    border: 'none',
    borderRadius: '30px',
    padding: '1rem',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem'
  }
};

export default TaskForm;
