# Progress Tracker — Walkthrough

## Summary

Added a full-stack **Progress Tracker** feature to FitTrack. Users can create workout tasks, log sessions, auto-detect personal records, and visualize progress through Recharts-powered charts — all styled to match the existing dark/cyan theme.

---

## Backend Changes (7 files)

### New Models
| File | Purpose |
|------|---------|
| [Task.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/models/Task.js) | Workout task schema: name, category enum, unit, targetValue |
| [Log.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/models/Log.js) | Session log schema: sets, reps, weight, distance, duration, isPR |

### New Controllers
| File | Purpose |
|------|---------|
| [taskController.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/controllers/taskController.js) | Full CRUD with cascading delete (removes logs too) |
| [logController.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/controllers/logController.js) | CRUD + **PR auto-detection** + **progress aggregation** (status, charts data) |

### New Routes
| File | Endpoints |
|------|-----------|
| [taskRoutes.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/routes/taskRoutes.js) | `GET/POST /api/tasks`, `PUT/DELETE /api/tasks/:id` |
| [logRoutes.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/routes/logRoutes.js) | `GET/POST /api/logs`, `PUT/DELETE /api/logs/:id`, `GET /api/logs/progress/:taskId` |

### Modified
- [server.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/server.js) — mounted `/api/tasks` and `/api/logs`

```diff:server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes     = require('./routes/authRoutes');
const recipeRoutes   = require('./routes/recipeRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const userRoutes     = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));

app.use('/api/auth',     authRoutes);
app.use('/api/recipes',  recipeRoutes);
app.use('/api/mealplan', mealPlanRoutes);
app.use('/api/user',     userRoutes);

app.get('/', (req, res) =>
  res.send({ status: 'ok', message: 'FitTrack backend running' })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes     = require('./routes/authRoutes');
const recipeRoutes   = require('./routes/recipeRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const userRoutes     = require('./routes/userRoutes');
const taskRoutes     = require('./routes/taskRoutes');
const logRoutes      = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));

app.use('/api/auth',     authRoutes);
app.use('/api/recipes',  recipeRoutes);
app.use('/api/mealplan', mealPlanRoutes);
app.use('/api/user',     userRoutes);
app.use('/api/tasks',    taskRoutes);
app.use('/api/logs',     logRoutes);

app.get('/', (req, res) =>
  res.send({ status: 'ok', message: 'FitTrack backend running' })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## Frontend Changes (8 files)

### New API Layer
| File | Purpose |
|------|---------|
| [progressApi.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/api/progressApi.js) | All fetch wrappers using existing `API_BASE` + `authHeaders()` |

### New Components (ProgressTracker/)
| File | Purpose |
|------|---------|
| [ProgressTracker.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/ProgressTracker.jsx) | Main page — task card grid, modal orchestration, loading/empty states |
| [TaskCard.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/TaskCard.jsx) | Task card with status badge, progress bar, stats, action buttons |
| [TaskForm.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/TaskForm.jsx) | Modal form for creating/editing tasks |
| [LogForm.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/LogForm.jsx) | Modal form for logging sessions (dynamic fields by category) |
| [ProgressChart.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/ProgressChart.jsx) | Recharts visualization: line chart, bar chart, progress ring, stat cards |

### Modified
- [App.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/App.jsx) — added `showProgressTracker` state and rendering
- [Navbar.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/landing/Navbar.jsx) — added "📈 Progress" button (visible when logged in)

```diff:App.jsx
import React, { useState } from 'react';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Stats from './components/landing/Stats';
import Features from './components/landing/Features';
import Testimonials from './components/landing/Testimonial';
import Footer from './components/landing/Footer';
import About from './components/landing/About';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import RecipeFinder from './components/RecipeFinder/RecipeFinder';
import MealPlanner from './components/MealPlanner/MealPlanner';
import UserProfile from './components/UserProfile/UserProfile';
import './App.css';

const App = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showRecipeFinder, setShowRecipeFinder] = useState(false);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (showRecipeFinder) {
    return <RecipeFinder onBack={() => setShowRecipeFinder(false)} />;
  }

  if (showMealPlanner) {
    return <MealPlanner onClose={() => setShowMealPlanner(false)} />;
  }

  if (showProfile) {
    return <UserProfile onBack={() => setShowProfile(false)} />;
  }

  return (
    <>
      <Navbar
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
        onProfile={() => setShowProfile(true)}
      />
      <Hero onGetStarted={() => console.log('Get Started')} />
      <Stats />
      <Features
        onSmartRecipesClick={() => setShowRecipeFinder(true)}
        onMealPlanningClick={() => setShowMealPlanner(true)}
      />
      <Testimonials />
      <About />
      <Footer />

      {showSignIn && (
        <SignIn
          onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
          onClose={() => setShowSignIn(false)}
        />
      )}

      {showSignUp && (
        <SignUp
          onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
          onClose={() => setShowSignUp(false)}
        />
      )}
    </>
  );
};

export default App;
===
import React, { useState } from 'react';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Stats from './components/landing/Stats';
import Features from './components/landing/Features';
import Testimonials from './components/landing/Testimonial';
import Footer from './components/landing/Footer';
import About from './components/landing/About';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import RecipeFinder from './components/RecipeFinder/RecipeFinder';
import MealPlanner from './components/MealPlanner/MealPlanner';
import UserProfile from './components/UserProfile/UserProfile';
import ProgressTracker from './components/ProgressTracker/ProgressTracker';
import './App.css';

const App = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showRecipeFinder, setShowRecipeFinder] = useState(false);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);

  if (showRecipeFinder) {
    return <RecipeFinder onBack={() => setShowRecipeFinder(false)} />;
  }

  if (showMealPlanner) {
    return <MealPlanner onClose={() => setShowMealPlanner(false)} />;
  }

  if (showProfile) {
    return <UserProfile onBack={() => setShowProfile(false)} />;
  }

  if (showProgressTracker) {
    return <ProgressTracker onBack={() => setShowProgressTracker(false)} />;
  }

  return (
    <>
      <Navbar
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
        onProfile={() => setShowProfile(true)}
        onProgress={() => setShowProgressTracker(true)}
      />
      <Hero onGetStarted={() => console.log('Get Started')} />
      <Stats />
      <Features
        onSmartRecipesClick={() => setShowRecipeFinder(true)}
        onMealPlanningClick={() => setShowMealPlanner(true)}
      />
      <Testimonials />
      <About />
      <Footer />

      {showSignIn && (
        <SignIn
          onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
          onClose={() => setShowSignIn(false)}
        />
      )}

      {showSignUp && (
        <SignUp
          onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
          onClose={() => setShowSignUp(false)}
        />
      )}
    </>
  );
};

export default App;
```

```diff:Navbar.jsx
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
===
import React from "react";
import { getToken, clearToken } from "../auth/auth.js";

const Navbar = ({ onSignIn, onSignUp, onProfile, onProgress }) => {
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
            <button onClick={onProgress} className="profile-nav-btn" title="Progress Tracker" style={{ borderColor: 'rgba(0, 255, 255, 0.4)' }}>
              <span className="profile-nav-avatar">📈</span>
              Progress
            </button>
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
```

---

## Key Features Implemented

1. **PR Auto-Detection** — When a log is created, it compares the primary value (weight for weightlifting, distance for cardio, reps for bodyweight) against all historical logs. If it's the highest ever, `isPR: true` is set automatically.

2. **Progress Status** — Based on logs in the last 7 days: ≥3 → "On Track" (green), 1–2 → "Slipping" (yellow), 0 → "Inactive" (red).

3. **Charts** — Recharts line chart (value over time with gold PR markers), bar chart (weekly volume), and SVG progress ring (best vs target %).

4. **Theme Consistency** — All components use the existing design system: dark backgrounds (`#0b0b0b`/`#181818`), cyan accents, `rgba(0, 255, 255, *)` borders, 20px/25px border-radius cards, same modal patterns.

---

## Verification

- ✅ `npm run build` succeeded — 0 errors, 2363 modules transformed
- ✅ No existing files overwritten (only `server.js`, `App.jsx`, and `Navbar.jsx` had additive changes)
- ✅ All existing features (RecipeFinder, MealPlanner, UserProfile, Auth) untouched

## How to Run

```bash
# Terminal 1 — Backend
cd "FitTrack Backend"
npm run dev

# Terminal 2 — Frontend
cd "FitTrack Frontend"
npm run dev
```

Then log in and click the **📈 Progress** button in the navbar.
