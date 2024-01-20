// client/src/StockComponent.js
import React, { useEffect } from 'react'; // Removed useState since it's no longer used
import io from 'socket.io-client';
import BalanceComponent from './BalanceComponent';
import TradeButtonComponent from './TradeButtonComponent';

const socket = io('http://localhost:3000'); // Connect to your server

const StockComponent = ({ stocks, balance }) => { // Accept stocks and balance as props

    useEffect(() => {
        // Listen for 'price update' events from the server
        socket.on('price update', updatedStocks => {
            // Update the stocks from the App.js state
            // NOTE: If App.js does not handle this update, you need to lift the state up to App.js
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
