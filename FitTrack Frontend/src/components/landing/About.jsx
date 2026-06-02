import React from 'react';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-content">
          <h2>About <span>FitTrack</span></h2>
          <p>
            FitTrack is your all-in-one companion to achieve fitness goals through smarter tracking and personalized insights.
            We believe fitness should be simple, motivating, and data-driven — empowering you to stay consistent every day.
          </p>

          <div className="about-points">
            <div className="about-card">
              <h3>💡 Our Vision</h3>
              <p>
                To revolutionize how people monitor their health by blending technology, AI, and motivation into a single seamless experience.
              </p>
            </div>

            <div className="about-card">
              <h3>🚀 Our Mission</h3>
              <p>
                To help every individual — from beginners to athletes — take control of their progress through intelligent tracking and community support.
              </p>
            </div>

            <div className="about-card">
              <h3>🤝 Our Promise</h3>
              <p>
                We’re committed to providing accurate insights, clean design, and features that truly make fitness more personal and effective.
              </p>
            </div>
          </div>
        </div>

        <div className="about-image">
          <div className="about-circle">
            🏋️‍♂️
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
