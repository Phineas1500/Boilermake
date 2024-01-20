process.env.GOOGLE_APPLICATION_CREDENTIALS = './serviceAccount.json';
const admin = require('firebase-admin');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cron = require('node-cron');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://stock-sim-c17d8.firebaseio.com'
});

const db = admin.firestore();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const port = 3000;

let stocks = {
    'CRNB': { name: 'Cranberry Inc.', price: 150, category: 'Consumer Tech' },
    'MCH': { name: 'McHenry\'s Corp.', price: 300, category: 'Fast Food' },
    'QTR': { name: 'Quitter Inc.', price: 45, category: 'Social Media' }
};

async function fetchCurrentPricesFromFirestore() {
  try {
    const stocksSnapshot = await db.collection('stocks').get();
    stocksSnapshot.forEach(doc => {
      const stockData = doc.data();
      if (stocks[doc.id]) {
        stocks[doc.id].price = stockData.currentPrice;
      }
    });
    console.log('Stocks updated with current prices from Firestore:', stocks);
  } catch (error) {
    console.error('Error fetching current prices from Firestore:', error);
    throw error; // Throw error to prevent the server from starting
  }
}

function updateStockPrices() {
    for (const stock in stocks) {
        let change = (Math.random() - 0.5) * 2;
        let updatedPrice = stocks[stock].price + change;
        updatedPrice = parseFloat(updatedPrice.toFixed(2));
        stocks[stock].price = Math.max(1, updatedPrice);
    }
    console.log('Updated stock prices:', stocks);
    io.emit('price update', stocks);
}

async function saveCurrentPricesToFirestore(stocks) {
  const batch = db.batch();
  Object.entries(stocks).forEach(([symbol, stockData]) => {
    const stockRef = db.collection('stocks').doc(symbol);
    batch.set(stockRef, { currentPrice: stockData.price }, { merge: true });
  });
  try {
    await batch.commit();
    console.log('Current prices saved to Firestore');
  } catch (error) {
    console.error('Error saving current prices to Firestore:', error);
  }
}

async function saveHistoricalPricesToFirestore(stocks) {
  const batch = db.batch();
  Object.entries(stocks).forEach(([symbol, stockData]) => {
    const historicalRef = db.collection('stocks').doc(symbol)
      .collection('historicalPrices').doc();
    batch.set(historicalRef, {
      price: stockData.price,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  try {
    await batch.commit();
    console.log('Historical prices saved to Firestore');
  } catch (error) {
    console.error('Error saving historical prices to Firestore:', error);
  }
}

async function initializeServer() {
  await fetchCurrentPricesFromFirestore();
  app.use(cors());

  setInterval(async () => {
    updateStockPrices();
    await saveCurrentPricesToFirestore(stocks);
  }, 5000);

  cron.schedule('*/30 * * * *', () => {
    console.log('Running saveHistoricalPricesToFirestore every 30 minutes');
    saveHistoricalPricesToFirestore(stocks);
  });

  app.get('/stocks', (req, res) => {
    res.json(stocks);
  });

  app.get('/buy/:stockId', (req, res) => {
    const stockId = req.params.stockId.toUpperCase();
    const stock = stocks[stockId];
    if (stock) {
      res.send(`Bought ${stockId} at ${stock.price}`);
    } else {
      res.status(404).send('Stock not found');
    }
  });

  app.get('/sell/:stockId', (req, res) => {
    const stockId = req.params.stockId.toUpperCase();
    const stock = stocks[stockId];
    if (stock) {
      res.send(`Sold ${stockId} at ${stock.price}`);
    } else {
      res.status(404).send('Stock not found');
    }
  });

  app.get('/', (req, res) => {
    res.send('Welcome to the Stock Market Simulator!');
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

initializeServer();
