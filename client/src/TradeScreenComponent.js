import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TradeScreenComponent = ({ stocks, balance, buyStock, sellStock }) => {
  const navigate = useNavigate();
  const { stockSymbol } = useParams();
  const [quantity, setQuantity] = useState('');

  const stock = stocks[stockSymbol];
  if (!stock) {
    return <p>Stock not found.</p>;
  }

  const handleBuy = () => {
    const quantityNum = parseInt(quantity, 10);
    if (quantityNum > 0) {
      console.log(`Buying ${quantityNum} shares of ${stockSymbol}`);
      buyStock(stockSymbol, quantityNum, stock.price);
    } else {
      alert('Please enter a valid quantity to buy.');
    }
  };
  
  const handleSell = () => {
    const quantityNum = parseInt(quantity, 10);
    if (quantityNum > 0) {
      console.log(`Selling ${quantityNum} shares of ${stockSymbol}`);
      sellStock(stockSymbol, quantityNum, stock.price);
    } else {
      alert('Please enter a valid quantity to sell.');
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button> {/* This button will take you back */}
      <h1>Trade {stock.name}</h1>
      <p>Category: {stock.category}</p> {/* Displaying the category */}
      <p>Current Price: ${stock.price.toFixed(2)}</p>
      <p>Current Balance: ${balance.toFixed(2)}</p>
      <input
        type="number"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        min="0"
      />
      <button onClick={handleBuy}>Buy</button>
      <button onClick={handleSell}>Sell</button>
    </div>
  );
};

export default TradeScreenComponent;
