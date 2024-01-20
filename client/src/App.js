// client/src/App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import StockComponent from './StockComponent';
import TradeScreenComponent from './TradeScreenComponent';

function App() {
  const [stocks, setStocks] = useState({});
  const [balance, setBalance] = useState(100000); // User's starting balance
  const [portfolio, setPortfolio] = useState({}); // User's stock portfolio

  const buyStock = (stockSymbol, quantity, price) => {
    const cost = quantity * price;
    console.log(`Attempting to buy ${quantity} of ${stockSymbol} for $${cost}`);
    if (balance >= cost) {
      setBalance(prevBalance => {
        const newBalance = prevBalance - cost;
        console.log(`New balance after buying: $${newBalance}`);
        return newBalance;
      });
      setPortfolio(prevPortfolio => {
        const newPortfolio = { ...prevPortfolio };
        newPortfolio[stockSymbol] = (newPortfolio[stockSymbol] || 0) + quantity;
        console.log(`New portfolio after buying: `, newPortfolio);
        return newPortfolio;
      });
    } else {
      alert('Not enough balance to complete this purchase.');
    }
  };
  
  const sellStock = (stockSymbol, quantity, price) => {
    console.log(`Attempting to sell ${quantity} of ${stockSymbol}`);
    setPortfolio(prevPortfolio => {
      const stockQuantity = prevPortfolio[stockSymbol] || 0;
      if (stockQuantity >= quantity) {
        const newQuantity = stockQuantity - quantity;
        setBalance(prevBalance => {
          const newBalance = prevBalance + quantity * price;
          console.log(`New balance after selling: $${newBalance}`);
          return newBalance;
        });
        const newPortfolio = { ...prevPortfolio };
        if (newQuantity > 0) {
          newPortfolio[stockSymbol] = newQuantity;
        } else {
          delete newPortfolio[stockSymbol];
        }
        console.log(`New portfolio after selling: `, newPortfolio);
        return newPortfolio;
      } else {
        alert('You do not own enough shares to sell this quantity.');
        return prevPortfolio;
      }
    });
  };
  
  
  useEffect(() => {
    // Fetch the stock data from your server when the component mounts
    fetch('http://localhost:3000/stocks')
      .then(response => response.json())
      .then(data => setStocks(data))
      .catch(error => console.error('Error fetching stocks:', error));
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StockComponent stocks={stocks} balance={balance} portfolio={portfolio} />} />
          <Route path="/trade/:stockSymbol" element={<TradeScreenComponent stocks={stocks} balance={balance} buyStock={buyStock} sellStock={sellStock} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
