import React, { useState, useEffect, useCallback } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import LogForm from './LogForm';
import ProgressChart from './ProgressChart';
import {
  fetchTasks, createTask, updateTask, deleteTask,
  createLog, fetchProgress
} from '../../api/progressApi';

const ProgressTracker = ({ onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loggingTask, setLoggingTask] = useState(null);
  const [chartTask, setChartTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const list = await fetchTasks();
      setTasks(list);

      // Load progress for each task
      const map = {};
      await Promise.all(
        list.map(async (t) => {
          try {
            const prog = await fetchProgress(t._id);
            map[t._id] = prog;
          } catch {
            map[t._id] = null;
          }
        })
      );
      setProgressMap(map);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ─── Task CRUD ────────────────────────────

  const handleCreateTask = async (data) => {
    try {
      await createTask(data);
      setShowTaskForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      console.error('Create task error:', err);
      alert('Failed to create task. Please make sure the backend is running.');
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      await updateTask(editingTask._id, data);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task and all its logs?')) return;
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Log ──────────────────────────────────

  const handleCreateLog = async (data) => {
    try {
      const result = await createLog(data);
      setLoggingTask(null);
      loadTasks(); // Refresh to update progress/PR
      if (result.isPR) {
        setTimeout(() => alert('🎉 New Personal Record!'), 200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back to Home
        </button>

        <div style={styles.headerTitle}>
          <span style={styles.headerIcon}>📈</span>
          <h1 style={styles.title}>Progress Tracker</h1>
        </div>
        <p style={styles.subtitle}>
          Track your workouts, beat your records, and visualize your progress
        </p>

        <button
          style={styles.createBtn}
          onClick={() => { setEditingTask(null); setShowTaskForm(true); }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 10px 30px rgba(0, 255, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ➕ New Task
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <p style={{ color: '#888', marginTop: '1rem' }}>Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🏋️‍♂️</div>
            <h3 style={styles.emptyTitle}>No tasks yet</h3>
            <p style={styles.emptyText}>
              Create your first workout task to start tracking your progress!
            </p>
            <button
              style={styles.createBtn}
              onClick={() => { setEditingTask(null); setShowTaskForm(true); }}
            >
              ➕ Create Your First Task
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                progress={progressMap[task._id]}
                onLog={(t) => setLoggingTask(t)}
                onViewProgress={(t) => setChartTask(t)}
                onEdit={(t) => { setEditingTask(t); setShowTaskForm(true); }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => { setShowTaskForm(false); setEditingTask(null); }}
        />
      )}

      {loggingTask && (
        <LogForm
          task={loggingTask}
          onSubmit={handleCreateLog}
          onClose={() => setLoggingTask(null)}
        />
      )}

      {chartTask && (
        <ProgressChart
          task={chartTask}
          onClose={() => setChartTask(null)}
        />
      )}

      {/* Inline keyframes for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #0b0b0b, #181818)',
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: '#fff',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
    overflowY: 'auto'
  },
  header: {
    background: 'rgba(0, 0, 0, 0.9)',
    padding: '2rem 5%',
    borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  backButton: {
    background: 'transparent',
    border: '2px solid cyan',
    color: 'cyan',
    padding: '0.7rem 1.5rem',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    transition: 'all 0.3s ease'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem'
  },
  headerIcon: {
    fontSize: '2.5rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'cyan',
    margin: 0
  },
  subtitle: {
    color: '#aaa',
    fontSize: '1rem',
    margin: '0 0 1.5rem 0'
  },
  createBtn: {
    background: 'cyan',
    color: '#000',
    padding: '0.8rem 2rem',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  content: {
    padding: '2rem 5%',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem'
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6rem 2rem'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(0, 255, 255, 0.2)',
    borderTop: '3px solid cyan',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  emptyState: {
    textAlign: 'center',
    padding: '6rem 2rem',
    background: 'rgba(0, 255, 255, 0.03)',
    borderRadius: '25px',
    border: '1px solid rgba(0, 255, 255, 0.1)'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  emptyTitle: {
    color: 'cyan',
    fontSize: '1.8rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0'
  },
  emptyText: {
    color: '#888',
    fontSize: '1.1rem',
    marginBottom: '2rem'
  }
};

export default ProgressTracker;
