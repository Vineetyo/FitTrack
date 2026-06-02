import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard.jsx';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    { text: 'FitTrack helped me stay consistent with my diet. It\'s easy and fun to use every single day!', name: 'Sarah Johnson', role: 'Lost 15kg in 4 months', avatar: 'S' },
    { text: 'Meal planning used to be stressful, now I actually enjoy it and look forward to it!', name: 'Michael Chen', role: 'Software Engineer', avatar: 'M' },
    { text: 'Tracking progress visually keeps me motivated to push harder and reach new goals.', name: 'Emily Rodriguez', role: 'Fitness Enthusiast', avatar: 'E' },
    { text: 'This app transformed how I approach fitness. The interface is intuitive and powerful.', name: 'David Williams', role: 'Personal Trainer', avatar: 'D' },
    { text: 'I love how easy it is to log my workouts and see my improvements over time!', name: 'Jessica Brown', role: 'Marathon Runner', avatar: 'J' },
    { text: 'The recipe recommendations are spot-on and have helped me discover new healthy meals.', name: 'Alex Martinez', role: 'Nutritionist', avatar: 'A' },
    { text: 'FitTrack keeps me accountable and motivated. Best fitness app I\'ve ever used!', name: 'Rachel Green', role: 'Yoga Instructor', avatar: 'R' },
    { text: 'Simple, effective, and exactly what I needed to stay on track with my goals.', name: 'Tom Anderson', role: 'Fitness Blogger', avatar: 'T' },
    { text: 'The progress analytics are incredible. I can see exactly where I\'m improving!', name: 'Lisa Park', role: 'Gym Owner', avatar: 'L' },
    { text: 'Finally found an app that makes healthy living feel effortless and enjoyable!', name: 'James Wilson', role: 'CrossFit Athlete', avatar: 'J' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="testimonials" id="testimonials">
      <h2>What Our Users Say</h2>
      <p>Real feedback from our amazing community</p>
      <div className="testimonial-container">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={index}
            text={testimonial.text}
            name={testimonial.name}
            role={testimonial.role}
            avatar={testimonial.avatar}
            isActive={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;