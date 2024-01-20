const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // This should match your React app's URL
    methods: ["GET", "POST"]
  }
});
const port = 3000;

app.use(cors()); // Use CORS middleware

// Mock stock data
let stocks = {
    'AAPL': { name: 'Apple Inc.', price: 150 },
    'MSFT': { name: 'Microsoft Corp.', price: 250 },
    'GOOGL': { name: 'Alphabet Inc.', price: 2800 }
};

// Function to update stock prices randomly
function updateStockPrices() {
    for (const stock in stocks) {
        // Generate a random number between -1 and 1 to simulate stock price change
        let change = (Math.random() - 0.5) * 2;
        
        // Apply the change and restrict to 2 decimal places
        let updatedPrice = stocks[stock].price + change;
        updatedPrice = parseFloat(updatedPrice.toFixed(2)); // This ensures two decimal places

        // Update the stock price, ensure it doesn't go below some reasonable minimum
        stocks[stock].price = Math.max(1, updatedPrice);
    }
    console.log('Updated stock prices:', stocks);
    // Emit the updated prices to all connected clients
    io.emit('price update', stocks);
}


// Update stock prices every 5 seconds
setInterval(updateStockPrices, 5000);

// Route to get list of stocks
app.get('/stocks', (req, res) => {
    res.json(stocks);
});

// Route to "buy" a stock
app.get('/buy/:stockId', (req, res) => {
    const stockId = req.params.stockId.toUpperCase();
    const stock = stocks[stockId];
    if (stock) {
        // Implement logic for buying a stock here
        res.send(`Bought ${stockId} at ${stock.price}`);
    } else {
        res.status(404).send('Stock not found');
    }
});

// Route to "sell" a stock
app.get('/sell/:stockId', (req, res) => {
    const stockId = req.params.stockId.toUpperCase();
    const stock = stocks[stockId];
    if (stock) {
        // Implement logic for selling a stock here
        res.send(`Sold ${stockId} at ${stock.price}`);
    } else {
        res.status(404).send('Stock not found');
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Stock Market Simulator!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
