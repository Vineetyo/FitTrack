import React, { useState } from "react";
import { API_BASE, saveToken } from "./auth.js";

const SignUp = ({ onSwitchToSignIn, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        saveToken(data.token);
        onClose && onClose();
        window.location.reload();
      } else {
        alert(data.message || "Signup failed");
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
          <h1>Create Account</h1>
          <p>Start your fitness journey today</p>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button onClick={handleSubmit} className="auth-btn">Create Account</button>
        </div>

        <div className="auth-divider"><span>OR</span></div>

        <div className="auth-footer">
          <p>Already have an account?
            <button onClick={onSwitchToSignIn} className="switch-btn">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
