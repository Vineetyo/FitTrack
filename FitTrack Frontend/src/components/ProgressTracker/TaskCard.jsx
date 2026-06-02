import React from 'react';

const CATEGORY_ICONS = {
  weightlifting: '🏋️',
  cardio: '🏃',
  bodyweight: '💪',
  custom: '⚡'
};

const STATUS_STYLES = {
  'On Track': { bg: 'rgba(0, 255, 150, 0.15)', color: '#00ff96', border: 'rgba(0, 255, 150, 0.4)' },
  'Slipping': { bg: 'rgba(255, 200, 0, 0.15)', color: '#ffc800', border: 'rgba(255, 200, 0, 0.4)' },
  'Inactive': { bg: 'rgba(255, 60, 60, 0.15)', color: '#ff5555', border: 'rgba(255, 60, 60, 0.4)' }
};

const TaskCard = ({ task, progress, onLog, onViewProgress, onEdit, onDelete }) => {
  const icon = CATEGORY_ICONS[task.category] || '⚡';
  const statusInfo = STATUS_STYLES[progress?.status] || STATUS_STYLES['Inactive'];
  const best = progress?.bestValue || 0;
  const pct = progress?.progressPercent || 0;

  return (
    <div style={styles.card}>
      {/* Header row */}
      <div style={styles.header}>
        <div style={styles.iconWrap}>{icon}</div>
        <div style={styles.info}>
          <h3 style={styles.name}>{task.name}</h3>
          <span style={styles.category}>{task.category}</span>
        </div>
        <div
          style={{
            ...styles.badge,
            background: statusInfo.bg,
            color: statusInfo.color,
            border: `1px solid ${statusInfo.border}`
          }}
        >
          {progress?.status || 'Inactive'}
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.stats}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Target</span>
          <span style={styles.statValue}>{task.targetValue} {task.unit}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Best</span>
          <span style={{ ...styles.statValue, color: best > 0 ? 'cyan' : '#666' }}>
            {best > 0 ? `${best} ${task.unit}` : '—'}
          </span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Progress</span>
          <span style={{ ...styles.statValue, color: pct >= 100 ? '#00ff96' : 'cyan' }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${Math.min(pct, 100)}%`,
            background: pct >= 100
              ? 'linear-gradient(90deg, #00ff96, #00ffff)'
              : 'linear-gradient(90deg, #00ffff, #00cccc)'
          }}
        />
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.actionBtn} onClick={() => onLog(task)} title="Log Session">
          📝 Log
        </button>
        <button style={styles.actionBtn} onClick={() => onViewProgress(task)} title="View Charts">
          📊 Charts
        </button>
        <button style={styles.actionBtnSmall} onClick={() => onEdit(task)} title="Edit Task">
          ✏️
        </button>
        <button
          style={{ ...styles.actionBtnSmall, borderColor: 'rgba(255, 60, 60, 0.4)' }}
          onClick={() => onDelete(task._id)}
          title="Delete Task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'rgba(0, 255, 255, 0.04)',
    border: '1px solid rgba(0, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '1.8rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.2rem'
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'rgba(0, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    flexShrink: 0
  },
  info: {
    flex: 1,
    minWidth: 0
  },
  name: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  category: {
    fontSize: '0.85rem',
    color: '#888',
    textTransform: 'capitalize'
  },
  badge: {
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  stat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ccc'
  },
  barTrack: {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '1.2rem'
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.6s ease'
  },
  actions: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap'
  },
  actionBtn: {
    background: 'rgba(0, 255, 255, 0.08)',
    border: '1px solid rgba(0, 255, 255, 0.25)',
    color: '#ccc',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  actionBtnSmall: {
    background: 'rgba(0, 255, 255, 0.05)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    color: '#aaa',
    padding: '0.5rem 0.7rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: 'auto'
  }
};

export default TaskCard;
