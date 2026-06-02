import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceDot
} from 'recharts';
import { fetchProgress } from '../../api/progressApi';

const STATUS_STYLES = {
  'On Track': { bg: 'rgba(0, 255, 150, 0.15)', color: '#00ff96', border: 'rgba(0, 255, 150, 0.4)' },
  'Slipping': { bg: 'rgba(255, 200, 0, 0.15)', color: '#ffc800', border: 'rgba(255, 200, 0, 0.4)' },
  'Inactive': { bg: 'rgba(255, 60, 60, 0.15)', color: '#ff5555', border: 'rgba(255, 60, 60, 0.4)' }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(0, 255, 255, 0.3)',
      borderRadius: '10px',
      padding: '0.7rem 1rem',
      color: '#fff',
      fontSize: '0.85rem'
    }}>
      <p style={{ margin: 0, color: '#888' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '0.2rem 0 0', color: p.color || 'cyan', fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const PRDot = (props) => {
  const { cx, cy, payload } = props;
  if (!payload?.isPR) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="rgba(255, 215, 0, 0.3)" stroke="#ffd700" strokeWidth={2} />
      <text x={cx} y={cy - 14} fill="#ffd700" fontSize={12} fontWeight={700} textAnchor="middle">
        PR
      </text>
    </g>
  );
};

const ProgressChart = ({ task, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [task._id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchProgress(task._id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <p style={{ color: '#888', marginTop: '1rem' }}>Loading progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            No progress data available. Log some sessions first!
          </p>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[data.status] || STATUS_STYLES['Inactive'];
  const lineData = (data.valueOverTime || []).map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
  const prDots = lineData.filter(d => d.isPR);

  const pctAngle = (data.progressPercent / 100) * 360;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>&times;</button>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.icon}>📊</span>
          <div>
            <h2 style={styles.title}>{task.name}</h2>
            <p style={styles.subtitle}>Progress Overview</p>
          </div>
          <div style={{
            ...styles.statusBadge,
            background: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`
          }}>
            {data.status}
          </div>
        </div>

        {/* Stat Cards Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🏆</span>
            <div>
              <p style={styles.statLabel}>Personal Best</p>
              <p style={styles.statValue}>{data.bestValue} {task.unit}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🎯</span>
            <div>
              <p style={styles.statLabel}>Target</p>
              <p style={styles.statValue}>{data.targetValue} {task.unit}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📈</span>
            <div>
              <p style={styles.statLabel}>Progress</p>
              <p style={{
                ...styles.statValue,
                color: data.progressPercent >= 100 ? '#00ff96' : 'cyan'
              }}>
                {data.progressPercent}%
              </p>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📋</span>
            <div>
              <p style={styles.statLabel}>Total Logs</p>
              <p style={styles.statValue}>{data.totalLogs}</p>
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div style={styles.ringSection}>
          <div style={styles.ringContainer}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={data.progressPercent >= 100 ? '#00ff96' : 'cyan'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${Math.PI * 100}`}
                strokeDashoffset={`${Math.PI * 100 * (1 - Math.min(data.progressPercent, 100) / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700">
                {data.progressPercent}%
              </text>
              <text x="60" y="72" textAnchor="middle" fill="#888" fontSize="10">
                of target
              </text>
            </svg>
          </div>
          <div style={styles.ringInfo}>
            <p style={{ color: '#ccc', margin: 0, fontSize: '0.95rem' }}>
              <strong style={{ color: 'cyan' }}>{data.bestValue}</strong> / {data.targetValue} {task.unit}
            </p>
            <p style={{ color: '#666', margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
              {data.recentCount} session{data.recentCount !== 1 ? 's' : ''} this week
            </p>
          </div>
        </div>

        {/* Line Chart: Value Over Time */}
        {lineData.length > 0 && (
          <div style={styles.chartSection}>
            <h3 style={styles.chartTitle}>📈 Value Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="cyan"
                  strokeWidth={2.5}
                  dot={{ fill: '#0b0b0b', stroke: 'cyan', strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: 'cyan', r: 6 }}
                  name="Value"
                />
                {prDots.map((pr, i) => (
                  <ReferenceDot
                    key={i}
                    x={pr.date}
                    y={pr.value}
                    r={8}
                    fill="rgba(255, 215, 0, 0.3)"
                    stroke="#ffd700"
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div style={styles.legend}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'cyan', display: 'inline-block' }} />
                Value
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffd700', display: 'inline-block' }} />
                Personal Record
              </span>
            </div>
          </div>
        )}

        {/* Bar Chart: Weekly Volume */}
        {(data.weeklyVolume || []).length > 0 && (
          <div style={styles.chartSection}>
            <h3 style={styles.chartTitle}>📊 Weekly Volume (Sets × Reps)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.weeklyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="week"
                  stroke="#666"
                  fontSize={11}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="volume"
                  fill="cyan"
                  radius={[6, 6, 0, 0]}
                  name="Volume"
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {lineData.length === 0 && (
          <div style={styles.emptyChart}>
            <p style={{ fontSize: '2rem', margin: 0 }}>📭</p>
            <p style={{ color: '#666', margin: '0.5rem 0 0' }}>
              No log data yet. Start logging sessions to see your progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '2rem',
    overflowY: 'auto',
    animation: 'fadeIn 0.3s ease'
  },
  card: {
    background: 'rgba(10, 10, 10, 0.97)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '25px',
    padding: '2.5rem',
    maxWidth: '750px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
    marginTop: '2rem',
    marginBottom: '2rem'
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
    zIndex: 10
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  icon: { fontSize: '1.8rem' },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: 700,
    color: 'cyan'
  },
  subtitle: {
    margin: 0,
    color: '#888',
    fontSize: '0.9rem'
  },
  statusBadge: {
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginLeft: 'auto'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  },
  statCard: {
    background: 'rgba(0, 255, 255, 0.04)',
    border: '1px solid rgba(0, 255, 255, 0.12)',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem'
  },
  statIcon: { fontSize: '1.3rem' },
  statLabel: {
    margin: 0,
    color: '#666',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  statValue: {
    margin: 0,
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 700
  },
  ringSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    margin: '1.5rem 0',
    padding: '1.5rem',
    background: 'rgba(0, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 255, 0.1)'
  },
  ringContainer: {},
  ringInfo: {},
  chartSection: {
    marginTop: '1.5rem',
    padding: '1.2rem',
    background: 'rgba(0, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 255, 0.1)'
  },
  chartTitle: {
    color: '#ddd',
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: 0,
    marginBottom: '1rem'
  },
  legend: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginTop: '0.8rem',
    fontSize: '0.8rem',
    color: '#888'
  },
  emptyChart: {
    textAlign: 'center',
    padding: '3rem 1rem',
    background: 'rgba(0, 255, 255, 0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    marginTop: '1.5rem'
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 255, 255, 0.2)',
    borderTop: '3px solid cyan',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default ProgressChart;
