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
      />
      <Hero onGetStarted={() => console.log('Get Started')} />
      <Stats />
      <Features
        onSmartRecipesClick={() => setShowRecipeFinder(true)}
        onMealPlanningClick={() => setShowMealPlanner(true)}
        onLogWorkoutsClick={() => setShowProgressTracker(true)}
        onProgressTrackerClick={() => setShowProgressTracker(true)}
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