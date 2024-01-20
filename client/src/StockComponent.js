import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import BalanceComponent from './BalanceComponent';
import TradeButtonComponent from './TradeButtonComponent';

const socket = io('http://localhost:3000'); // Connect to your server

const StockComponent = ({ stocks, balance }) => {

    useEffect(() => {
        // Listen for 'price update' events from the server
        socket.on('price update', updatedStocks => {
            // Handle the stock updates here if needed
        });

        // Clean up the effect
        return () => socket.off('price update');
    }, []);

    return (
        <div>
            <h1>Stock Market Simulator</h1>
            <Link to="/profile">View Profile</Link> {/* Add the link to the profile page here */}
            <BalanceComponent balance={balance} />
            <div id="stocks">
                {Object.entries(stocks).map(([symbol, stockInfo]) => (
                    <div key={symbol}>
                        <p>{`${symbol}: ${stockInfo.name} - $${stockInfo.price.toFixed(2)}`}</p>
                        <TradeButtonComponent stockSymbol={symbol} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockComponent;
