// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Import the CSS file

const LandingPage = () => {
  return (
    <div className="container">
      <h1>Welcome to the Stock Market Simulator</h1>
      <Link to="/login" className="link">Log In</Link>
      <br />
      <Link to="/register" className="link">Register</Link>
    </div>
  );
};

export default LandingPage;
