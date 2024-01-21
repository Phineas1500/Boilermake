// StockComponent.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import BalanceComponent from './BalanceComponent';
import TradeButtonComponent from './TradeButtonComponent';
import './StockComponent.css'; // Import the CSS file

const socket = io('http://localhost:3000');

const StockComponent = ({ stocks, balance, setUser }) => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [headlines, setHeadlines] = useState({}); // Initially empty, will be updated via socket

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        // Listen for headline updates from the server
        socket.on('headline update', updatedHeadlines => {
            setHeadlines(updatedHeadlines);
        });

        // Listen for 'price update' events from the server
        socket.on('price update', updatedStocks => {
            // Optional: Handle stock price updates if needed
        });

        // Fetch initial headlines on component mount
        fetch('http://localhost:3000/generate-content')
            .then(response => response.json())
            .then(data => setHeadlines(data))
            .catch(error => console.error('Error fetching initial headlines:', error));

        // Clean up the effect
        return () => {
            socket.off('headline update');
            socket.off('price update');
        };
    }, []);

    return (
        <div className="stock-container">
            <h1>Stock Market Simulator</h1>
            <div className="links">
              <Link to="/profile">View Profile</Link>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/news">View News</Link>
            </div>
            <BalanceComponent balance={balance} />
            <div id="stocks">
                {Object.entries(stocks).map(([symbol, stockInfo]) => (
                    <div key={symbol} className="stock-item">
                        <p>{`${symbol}: ${stockInfo.name} - $${stockInfo.price.toFixed(2)}`}</p>
                        <TradeButtonComponent stockSymbol={symbol} />
                        <p className="stock-headline">Headline: {headlines[stockInfo.name]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
    
    
};

export default StockComponent;