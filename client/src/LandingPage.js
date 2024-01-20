// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <h1>Welcome to the Stock Market Simulator</h1>
      <Link to="/login">Log In</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
};

export default LandingPage;
