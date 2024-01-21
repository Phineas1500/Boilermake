import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileComponent.css'; // Import the CSS file

const ProfileComponent = ({ portfolio, stocks, balance }) => {
  const navigate = useNavigate();
  
  // Calculate the total value of the portfolio
  let portfolioValue = balance;
  const portfolioItems = Object.entries(portfolio).map(([symbol, quantity]) => {
    const stockValue = stocks[symbol] ? stocks[symbol].price * quantity : 0;
    portfolioValue += stockValue;
    return (
      <li key={symbol}>
        {symbol}: {quantity} shares (Value: ${stockValue.toFixed(2)})
      </li>
    );
  });

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button> {/* Styled back button */}
      <h1>User Portfolio</h1>
      <h2>Holdings:</h2>
      <ul className="portfolio-items">
        {portfolioItems}
      </ul>
      <h2>Total Portfolio Value: ${portfolioValue.toFixed(2)}</h2>
      <h2>Cash Balance: ${balance.toFixed(2)}</h2>
    </div>
  );
};

export default ProfileComponent;