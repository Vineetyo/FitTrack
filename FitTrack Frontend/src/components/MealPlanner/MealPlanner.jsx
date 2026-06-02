import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Calendar from "./Calendar";
import DayDetail from "./DayDetail";
import { API_BASE, authHeaders, getToken } from "../auth/auth.js";

const MealPlanner = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [mealPlan, setMealPlan] = useState({});

  useEffect(() => {
    loadMonthPlans(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, []);

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const loadMonthPlans = async (year, month) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/mealplan/month?year=${year}&month=${String(
          month
        ).padStart(2, "0")}`,
        { headers: authHeaders() }
      );

      const data = await res.json();
      const map = {};
      (data || []).forEach((plan) => {
        map[plan.date] = plan.meals;
      });

      setMealPlan(map);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDayClick = (day) => {
    const clicked = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDay(clicked);
  };

  const handleAddMeal = async (mealType, recipe) => {
    const dateKey = formatDateKey(selectedDay);

    const updatedMeals = {
      ...(mealPlan[dateKey] || {}),
      [mealType]: recipe,
    };

    try {
      await fetch(`${API_BASE}/api/mealplan/date/${dateKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ meals: updatedMeals }),
      });

      setMealPlan((prev) => ({
        ...prev,
        [dateKey]: updatedMeals,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMeal = async (mealType) => {
    const dateKey = formatDateKey(selectedDay);
    const updated = { ...mealPlan };

    if (updated[dateKey]) {
      delete updated[dateKey][mealType];

      if (Object.keys(updated[dateKey]).length === 0) {
        await fetch(`${API_BASE}/api/mealplan/date/${dateKey}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        delete updated[dateKey];
      } else {
        await fetch(`${API_BASE}/api/mealplan/date/${dateKey}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ meals: updated[dateKey] }),
        });
      }
    }

    setMealPlan(updated);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(newDate);
    loadMonthPlans(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(newDate);
    loadMonthPlans(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onClose} style={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div style={styles.headerTitle}>
          <span style={styles.icon}>📅</span>
          <h1 style={styles.title}>Meal Planner</h1>
        </div>

        <p style={styles.subtitle}>Plan your meals for the month</p>
      </div>

      <div style={styles.content}>
        {!selectedDay ? (
          <Calendar
            currentDate={currentDate}
            mealPlan={mealPlan}
            onDayClick={handleDayClick}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            formatDateKey={formatDateKey}
          />
        ) : (
          <DayDetail
            selectedDay={selectedDay}
            mealPlan={mealPlan}
            formatDateKey={formatDateKey}
            onAddMeal={handleAddMeal}
            onRemoveMeal={handleRemoveMeal}
            onBack={() => setSelectedDay(null)}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #0b0b0b, #181818)",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#fff",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    overflowY: "auto",
  },
  header: {
    background: "rgba(0, 0, 0, 0.9)",
    padding: "2rem 5%",
    borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  backButton: {
    background: "transparent",
    border: "2px solid cyan",
    color: "cyan",
    padding: "0.7rem 1.5rem",
    borderRadius: "25px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    transition: "all 0.3s ease",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  icon: {
    fontSize: "2.5rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "cyan",
    margin: 0,
  },
  subtitle: {
    color: "#aaa",
    fontSize: "1rem",
    margin: 0,
  },
  content: {
    padding: "2rem 5%",
    maxWidth: "1400px",
    margin: "0 auto",
  },
};

export default MealPlanner;
