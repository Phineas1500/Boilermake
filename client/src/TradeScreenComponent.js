import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const TradeScreenComponent = ({ stocks }) => {
    const { stockSymbol } = useParams();
    const [quantity, setQuantity] = useState(0);

    console.log("Stocks:", stocks);
    console.log("Stock Symbol:", stockSymbol);

    const stock = stocks[stockSymbol];
    if (!stock) {
        return <p>Stock not found.</p>;
    }

    const handleBuy = () => {
        console.log(`Buying ${quantity} shares of ${stockSymbol}`);
    };

    const handleSell = () => {
        console.log(`Selling ${quantity} shares of ${stockSymbol}`);
    };

    return (
        <div>
            <h1>Trade {stock.name}</h1>
            <p>Current Price: ${stock.price.toFixed(2)}</p>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
            />
            <button onClick={handleBuy}>Buy</button>
            <button onClick={handleSell}>Sell</button>
        </div>
    );
};

export default TradeScreenComponent;
