// client/src/TradeButtonComponent.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure this is the only import from 'react-router-dom'

const TradeButtonComponent = ({ stockSymbol }) => {
    const navigate = useNavigate(); // This replaces useHistory

    const handleTrade = () => {
        // Navigate to the trade screen for the specific stock
        navigate(`/trade/${stockSymbol}`); // Use navigate() instead of history.push()
    };

    return (
        <button onClick={handleTrade}>Trade</button>
    );
};

export default TradeButtonComponent;
