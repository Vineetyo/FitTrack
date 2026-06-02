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