import React, { useState } from 'react';

const LogForm = ({ task, onSubmit, onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const cat = task?.category || 'custom';

  const showWeight = ['weightlifting', 'custom'].includes(cat);
  const showSetsReps = ['weightlifting', 'bodyweight', 'custom'].includes(cat);
  const showDistance = ['cardio', 'custom'].includes(cat);
  const showDuration = ['cardio', 'bodyweight', 'custom'].includes(cat);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      taskId: task._id,
      date,
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      weight: weight ? Number(weight) : null,
      distance: distance ? Number(distance) : null,
      duration: duration ? Number(duration) : null,
      notes: notes.trim()
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>&times;</button>

        <div style={styles.header}>
          <span style={styles.icon}>📝</span>
          <div>
            <h2 style={styles.title}>Log Session</h2>
            <p style={styles.taskName}>{task?.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              style={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {showSetsReps && (
            <div style={styles.row}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Sets</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  placeholder="3"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </div>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Reps</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  placeholder="10"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>
            </div>
          )}

          {showWeight && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Weight ({task?.unit || 'kg'})</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                step="0.5"
                placeholder="60"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          )}

          {showDistance && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Distance ({task?.unit || 'km'})</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                step="0.1"
                placeholder="5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
          )}

          {showDuration && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Duration (minutes)</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
              placeholder="How did it feel? Any observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Save Log Entry
          </button>
        </form>
      </div>
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
    lineHeight: 1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  },
  icon: { fontSize: '1.8rem' },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 700,
    color: 'cyan'
  },
  taskName: {
    margin: 0,
    color: '#888',
    fontSize: '0.95rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
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

export default LogForm;
