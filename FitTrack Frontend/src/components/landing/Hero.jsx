import React from 'react';

const Hero = ({ onGetStarted }) => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Transform Your <span>Fitness Journey</span></h1>
        <p>Track your meals, workouts, and progress with a simple and smart interface designed for real results.</p>
        <div className="hero-buttons">
          <button onClick={onGetStarted} className="btn-main">Start Free Trial</button>
        </div>
      </div>
      <div className="hero-img">
        <div className="hero-circle">💪</div>
      </div>
    </section>
  );
};

export default Hero;