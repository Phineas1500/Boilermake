// client/src/StockComponent.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import BalanceComponent from './BalanceComponent';
import TradeButtonComponent from './TradeButtonComponent';

const socket = io('http://localhost:3000'); // Connect to your server

const StockComponent = () => {
    const [stocks, setStocks] = useState({});
    const [balance, setBalance] = useState(100000.00); // User starts with $100,000.00

    useEffect(() => {
        // Listen for 'price update' events from the server
        socket.on('price update', updatedStocks => {
            setStocks(updatedStocks);
        });

        // Clean up the effect
        return () => socket.off('price update');
    }, []);

    return (
        <div>
            <h1>Stock Market Simulator</h1>
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
