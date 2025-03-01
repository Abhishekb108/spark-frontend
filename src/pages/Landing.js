import React from 'react';
import '../styles/landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to LinkHub</h1>
      <p>Create your own link page in minutes!</p>
      <div className="cta-buttons">
        <button onClick={() => window.location.href = '/signup'}>Get Started</button>
        <button onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    </div>
  );
};

export default Landing;