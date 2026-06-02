import React, { useState } from "react";
import { API_BASE, saveToken } from "./auth.js";

const SignIn = ({ onSwitchToSignUp, onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        saveToken(data.token);
        onClose && onClose();
        window.location.reload();
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn">×</button>

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your fitness journey</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>

          <button onClick={handleSubmit} className="auth-btn">Sign In</button>
        </div>

        <div className="auth-divider"><span>OR</span></div>

        <div className="auth-footer">
          <p>Don't have an account?
            <button onClick={onSwitchToSignUp} className="switch-btn">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
