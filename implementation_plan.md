# Progress Tracker Feature — Implementation Plan

Add a full-stack "Progress Tracker" feature to FitTrack, allowing users to create workout tasks, log sessions, auto-detect personal records, and view progress via Recharts-powered charts.

## User Review Required

> [!IMPORTANT]
> **CORS with credentials**: The existing backend CORS config does NOT pass `credentials: true`. The user's request mentions `credentials: include` in axios, but the existing auth pattern uses `Authorization: Bearer` headers (not cookies). I will follow the **existing pattern** (Bearer token via `authHeaders()`) instead of introducing `credentials: include`, which would require backend CORS changes.

> [!IMPORTANT]
> **No `src/pages/` directory exists**. The existing pattern puts everything under `src/components/`. I will create the ProgressTracker as `src/components/ProgressTracker/ProgressTracker.jsx` (matching the existing pattern of RecipeFinder, MealPlanner, UserProfile) and also create a `src/api/progressApi.js` as requested.

> [!WARNING]
> **Frontend uses state-based routing** (no React Router for page views). The app toggles between views via `useState` flags in `App.jsx`. Adding a `/progress` route via React Router would be a breaking change. Instead, I'll add a "Progress" nav link that toggles the ProgressTracker view, consistent with how RecipeFinder/MealPlanner/Profile work.

---

## Proposed Changes

### Backend — Models

#### [NEW] [Task.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/models/Task.js)
- Mongoose model with fields: `userId`, `name`, `category`, `unit`, `targetValue`, `createdAt`
- Category enum: `weightlifting | cardio | bodyweight | custom`

#### [NEW] [Log.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/models/Log.js)
- Mongoose model with fields: `userId`, `taskId`, `date`, `sets`, `reps`, `weight`, `distance`, `duration`, `notes`, `isPR`, `createdAt`

---

### Backend — Controllers

#### [NEW] [taskController.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/controllers/taskController.js)
- `getTasks` — get all tasks for `req.user._id`
- `createTask` — create a new task
- `updateTask` — update task by ID (with ownership check)
- `deleteTask` — delete task and all associated logs

#### [NEW] [logController.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/controllers/logController.js)
- `getLogs` — get all logs for a given `taskId` (query param)
- `createLog` — create a log with **PR auto-detection** logic
- `updateLog` — update log by ID
- `deleteLog` — delete log by ID
- `getProgress` — aggregated data: value over time, weekly volume, best PR, progress vs target, and status (On Track / Slipping / Inactive)

**PR auto-detection**: On POST, compare the new log's primary value (weight for weightlifting, distance for cardio, reps for bodyweight) against all past logs for the same task. If it exceeds the maximum, set `isPR: true`.

**Status logic**: Count logs in the last 7 days. ≥3 → "On Track", 1–2 → "Slipping", 0 → "Inactive".

---

### Backend — Routes

#### [NEW] [taskRoutes.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/routes/taskRoutes.js)
- `GET /api/tasks` → `getTasks`
- `POST /api/tasks` → `createTask`
- `PUT /api/tasks/:id` → `updateTask`
- `DELETE /api/tasks/:id` → `deleteTask`

#### [NEW] [logRoutes.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/routes/logRoutes.js)
- `GET /api/logs?taskId=` → `getLogs`
- `POST /api/logs` → `createLog`
- `PUT /api/logs/:id` → `updateLog`
- `DELETE /api/logs/:id` → `deleteLog`
- `GET /api/logs/progress/:taskId` → `getProgress`

---

### Backend — Server Entry

#### [MODIFY] [server.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Backend/server.js)
- Import and mount `taskRoutes` at `/api/tasks`
- Import and mount `logRoutes` at `/api/logs`

---

### Frontend — API Layer

#### [NEW] [progressApi.js](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/api/progressApi.js)
- Functions wrapping `fetch` calls using existing `API_BASE` and `authHeaders()` pattern
- Task CRUD functions + Log CRUD functions + `getProgress(taskId)`

---

### Frontend — Components

#### [NEW] [ProgressTracker.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/ProgressTracker.jsx)
- Main page component showing all tasks as cards
- Manages state for modals and selected task
- Sub-views: task list, log form, progress charts

#### [NEW] [TaskCard.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/TaskCard.jsx)
- Displays task info: name, category, target, current best, status badge
- Action buttons: log session, view progress, edit, delete

#### [NEW] [TaskForm.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/TaskForm.jsx)
- Modal form for creating/editing a task
- Fields: name, category (dropdown), unit, targetValue

#### [NEW] [LogForm.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/LogForm.jsx)
- Modal form for logging a workout session
- Dynamically shows relevant fields based on task category (e.g., weight/sets/reps for weightlifting, distance/duration for cardio)

#### [NEW] [ProgressChart.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/ProgressTracker/ProgressChart.jsx)
- Recharts-based visualization:
  - Line chart: primary value over time, PR entries marked with distinct ⭐ markers
  - Bar chart: weekly volume (sets × reps per week)
  - Stat card: current best vs target with percentage ring

---

### Frontend — Integration

#### [MODIFY] [App.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/App.jsx)
- Add `showProgressTracker` state
- Render `<ProgressTracker>` when active
- Pass `onProgress` callback to Navbar

#### [MODIFY] [Navbar.jsx](file:///c:/Users/DELL/OneDrive/Desktop/MERN%20projects/project%20-%203%20recipe%20recommendation%20system%20and%20more/miniProject/FitTrack%20Frontend/src/components/landing/Navbar.jsx)
- Add "Progress" nav link (visible when logged in) that calls `onProgress`

---

### Dependencies

- **Backend**: No new dependencies needed — all existing (`mongoose`, `express`, `jsonwebtoken`)
- **Frontend**: Install `recharts` for charting

---

## Open Questions

1. **Lucide-react**: The existing MealPlanner uses `lucide-react` (imported but not in package.json — likely hoisted or not committed). Should I use emoji icons for the Progress Tracker or install `lucide-react` explicitly? → I'll use emojis + inline SVG to stay safe, matching the feature cards pattern.

## Verification Plan

### Automated Tests
- Start the backend server and verify the new routes return proper responses
- `npm run build` on the frontend to verify no compilation errors

### Manual Verification
- Create a task, log sessions, verify PR auto-detection
- Check that progress charts render with Recharts
- Verify the "Progress" link appears in the navbar when logged in
- Confirm existing features (RecipeFinder, MealPlanner, Profile) still work
