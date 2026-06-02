import React from 'react';

const Stats = () => {
  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Meals Tracked' },
    { value: '500+', label: 'Healthy Recipes' },
    { value: '4.8★', label: 'User Rating' }
  ];

  return (
    <section className="stats">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;