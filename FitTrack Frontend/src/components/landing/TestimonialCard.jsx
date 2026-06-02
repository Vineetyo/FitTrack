import React from 'react';

const TestimonialCard = ({ text, name, role, avatar, isActive }) => {
  return (
    <div className={`testimonial ${isActive ? 'active' : ''}`}>
      <p>"{text}"</p>
      <div className="author">
        <div className="avatar">{avatar}</div>
        <div className="author-info">
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;