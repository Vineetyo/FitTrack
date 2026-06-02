// src/components/auth/auth.js

export const API_BASE = "http://localhost:5000";

// Token helpers
export const getToken = () => {
  return localStorage.getItem("fittrack_token");
};

export const saveToken = (token) => {
  if (token) localStorage.setItem("fittrack_token", token);
};

export const clearToken = () => {
  localStorage.removeItem("fittrack_token");
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = () => {
  return !!getToken();
};
