// client/src/BalanceComponent.js
import React from 'react';

const BalanceComponent = ({ balance }) => {
    return (
        <div>
            <h2>Balance: ${balance.toFixed(2)}</h2>
        </div>
    );
};

export default BalanceComponent;
