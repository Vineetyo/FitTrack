import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ currentDate, mealPlan, onDayClick, onPreviousMonth, onNextMonth, formatDateKey }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay()
    };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasMealsForDay = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    return mealPlan[dateKey] && Object.keys(mealPlan[dateKey]).length > 0;
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyDay}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      const hasMeals = hasMealsForDay(day);

      days.push(
        <div
          key={day}
          onClick={() => onDayClick(day)}
          style={{
            ...styles.dayCell,
            ...(isToday ? styles.today : {}),
            ...(hasMeals ? styles.hasMeals : {})
          }}
        >
          <span style={styles.dayNumber}>{day}</span>
          {hasMeals && <div style={styles.mealIndicator}>●</div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} />
        </button>

        <h2 style={styles.monthTitle}>{monthName}</h2>

        <button onClick={onNextMonth} style={styles.navButton}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div style={styles.weekDays}>
        {weekDays.map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div style={styles.calendarGrid}>
        {renderCalendarDays()}
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.legendDot}></div>
          <span>Has meals planned</span>
        </div>

        <div style={styles.legendItem}>
          <div style={{ ...styles.legendBox, border: '2px solid cyan' }}></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '2px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  navButton: {
    background: 'rgba(0, 255, 255, 0.1)',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    color: 'cyan',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  monthTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'cyan',
    margin: 0
  },
  weekDays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  weekDay: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.5rem'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
    marginBottom: '2rem'
  },
  emptyDay: {
    aspectRatio: '1',
    minHeight: '80px'
  },
  dayCell: {
    aspectRatio: '1',
    minHeight: '80px',
    background: 'rgba(0, 255, 255, 0.05)',
    border: '2px solid rgba(0, 255, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  today: {
    border: '2px solid cyan',
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
  },
  hasMeals: {
    background: 'rgba(0, 255, 255, 0.1)'
  },
  dayNumber: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#fff'
  },
  mealIndicator: {
    color: 'cyan',
    fontSize: '0.75rem',
    marginTop: '0.25rem'
  },
  legend: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(0, 255, 255, 0.2)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#aaa',
    fontSize: '0.9rem'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'cyan'
  },
  legendBox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px'
  }
};

export default Calendar;
