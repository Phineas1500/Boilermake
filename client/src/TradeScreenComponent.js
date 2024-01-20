/*import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StockChart from './StockChart'; // Import StockChart
import { fetchHistoricalData } from './stockService'; // Import fetchHistoricalData function

const TradeScreenComponent = ({ stocks, balance, buyStock, sellStock }) => {
  const navigate = useNavigate();
  const { stockSymbol } = useParams();
  const [quantity, setQuantity] = useState('');
  const [historicalData, setHistoricalData] = useState([]); // State for historical data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(''); // State for error handling

  useEffect(() => {
    // Fetch historical data when component mounts or stockSymbol changes
    const loadHistoricalData = async () => {
      try {
        setLoading(true);
        const data = await fetchHistoricalData(stockSymbol);
        setHistoricalData(data);
        console.log('Historical data fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setError('Failed to fetch historical data.');
      } finally {
        setLoading(false);
      }
    };
    loadHistoricalData();
  }, [stockSymbol]); // Dependency array with stockSymbol

  const stock = stocks[stockSymbol];
  if (!stock) {
    return <p>Stock not found.</p>;
  }

  const handleBuy = () => {
    const quantityNum = parseInt(quantity, 10);
    if (quantityNum > 0) {
      console.log(`Buying ${quantityNum} shares of ${stockSymbol}`);
      buyStock(stockSymbol, quantityNum, stock.price);
      console.log(`Buy order placed for ${quantityNum} shares of ${stockSymbol}`);
    } else {
      alert('Please enter a valid quantity to buy.');
    }
  };
  
  const handleSell = () => {
    const quantityNum = parseInt(quantity, 10);
    if (quantityNum > 0) {
      console.log(`Selling ${quantityNum} shares of ${stockSymbol}`);
      sellStock(stockSymbol, quantityNum, stock.price);
      console.log(`Sell order placed for ${quantityNum} shares of ${stockSymbol}`);
    } else {
      alert('Please enter a valid quantity to sell.');
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Trade {stock.name}</h1>
      <p>Category: {stock.category}</p>
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

      {loading && <p>Loading historical data...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && <StockChart historicalData={historicalData} />}
    </div>
  );
};

export default TradeScreenComponent;*/
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