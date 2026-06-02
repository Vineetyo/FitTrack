import React from "react";
import { getToken, clearToken } from "../auth/auth.js";

const Navbar = ({ onSignIn, onSignUp, onProfile }) => {
  const token = getToken();

  const handleLogout = () => {
    clearToken();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="logo">FitTrack</div>

      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      <div className="nav-buttons">
        {!token ? (
          <>
            <button onClick={onSignIn} className="login-btn">Login</button>
            <button onClick={onSignUp} className="cta-btn">Sign Up</button>
          </>
        ) : (
          <>
            <button onClick={onProfile} className="profile-nav-btn" title="My Profile">
              <span className="profile-nav-avatar">👤</span>
              Profile
            </button>
            <button onClick={handleLogout} className="login-btn">Logout</button>
          </>
        )}
      </div>

      <style>{`
        .profile-nav-btn {
          background: rgba(0, 255, 255, 0.1);
          color: cyan;
          border: 2px solid rgba(0, 255, 255, 0.4);
          padding: 0.7rem 1.5rem;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .profile-nav-btn:hover {
          background: rgba(0, 255, 255, 0.2);
          border-color: cyan;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .profile-nav-avatar {
          font-size: 1.1rem;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;