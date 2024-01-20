import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth"; // Import Firebase auth functions
import BalanceComponent from './BalanceComponent';
import TradeButtonComponent from './TradeButtonComponent';

const socket = io('http://localhost:3000'); // Connect to your server

const StockComponent = ({ stocks, balance, setUser }) => {
    const navigate = useNavigate();
    const auth = getAuth(); // Initialize Firebase Auth

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Update the user state to null
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
            <Link to="/profile">View Profile</Link>
            <button onClick={handleLogout}>Logout</button> {/* Logout button */}
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