import { API_BASE, authHeaders } from '../components/auth/auth.js';

// ─── TASKS ──────────────────────────────────────────────

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

// ─── LOGS ───────────────────────────────────────────────

export async function fetchLogs(taskId) {
  const res = await fetch(`${API_BASE}/api/logs?taskId=${taskId}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function createLog(data) {
  const res = await fetch(`${API_BASE}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create log');
  return res.json();
}

export async function updateLog(id, data) {
  const res = await fetch(`${API_BASE}/api/logs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update log');
  return res.json();
}

export async function deleteLog(id) {
  const res = await fetch(`${API_BASE}/api/logs/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete log');
  return res.json();
}

export async function fetchProgress(taskId) {
  const res = await fetch(`${API_BASE}/api/logs/progress/${taskId}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}
