process.env.GOOGLE_APPLICATION_CREDENTIALS = './serviceAccount.json';
const admin = require('firebase-admin');
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cron = require('node-cron');
const { OpenAI } = require("openai");

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
    //origin: "*",
    methods: ["GET", "POST"]
  }
});
const port = 3000;
let latestHeadlinesGlobal = {};

let stocks = {
    'CRNB': { name: 'Cranberry Inc.', price: 150, category: 'Consumer Tech' },
    'MCH': { name: 'McHenry\'s Corp.', price: 300, category: 'Fast Food' },
    'QTR': { name: 'Quitter Inc.', price: 45, category: 'Social Media' },
    'SRC': { name: 'Specific Rotors Company', price: 30, category: 'Automotive' },
    'GOGGL': { name: 'Goggle Inc.', price: 140, category: 'Consumer Tech' },
    'WBFX': { name: 'Webflix Inc.', price: 500, category: 'Entertainment' },
    'EDSN': { name: 'Edison Inc.', price: 200, category: 'Automotive' },
    'PKT': { name: 'Pinkit Inc.', price: 120, category: 'Social Media' },
    'BUR': { name: 'Burrito Gong Corp.', price: 55, category: 'Fast Food' },
    'TKC': { name: 'This Knee Company.', price: 90, category: 'Entertainment' }
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

async function fetchLatestHeadlines() {
    const headlinesRef = db.collection('headlines');
    let latestHeadlines = {};

    // Assuming each headline document has 'category' and 'content' fields
    try {
        const snapshot = await headlinesRef.orderBy('timestamp', 'desc').limit(10).get();
        snapshot.forEach(doc => {
            const data = doc.data();
            // Only update if the category hasn't been added yet
            if (!latestHeadlines[data.category]) {
                latestHeadlines[data.category] = data.content;
            }
        });
        return latestHeadlines;
    } catch (error) {
        console.error('Error fetching latest headlines from Firestore:', error);
        return {};
    }
}


async function saveHeadlinesToFirestore(headlines) {
    const headlinesRef = db.collection('headlines');
    const batch = db.batch();
    Object.entries(headlines).forEach(([category, headline]) => {
        const headlineDoc = headlinesRef.doc(); // Create a new document for each headline
        batch.set(headlineDoc, {
            category,
            content: headline,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    });

    try {
        await batch.commit();
        console.log('Headlines saved to Firestore');
    } catch (error) {
        console.error('Error saving headlines to Firestore:', error);
    }
}


// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: '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',
});
//const openai = new OpenAIApi(new Configuration({
//  apiKey: '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'
//}));

// Helper function to generate a single headline for a specific category
async function generateHeadlineForCategory(category, name) {
    try {  
        // Fetch old headlines from the same category
        const oldHeadlines = await fetchOldHeadlinesByCategory(category);
        // Create a prompt using the old headlines for context
        let prompt = `Here are some past headlines for the ${category} category:\n`;
        oldHeadlines.forEach(headline => {
            prompt += `- "${headline}"\n`;
        });
        prompt += `Now, generate a compelling (positive or negative) news headline for ${name}, which is in the ${category} industry:`;

        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo-1106", // Ensure this is the correct model
            temperature: 1.8,
            max_tokens: 60,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // Log the entire response for debugging
        console.log("OpenAI API Response:", JSON.stringify(response, null, 2));

        if (response.choices[0].message.content.length > 0) {
            // Access the message content directly
            const headline = response.choices[0].message.content;
            return headline;
        } else {
            // Log the complete response if the structure is not as expected
            console.error('Unexpected response structure:', JSON.stringify(response, null, 2));
            return "An unexpected error occurred. Unable to generate headline.";
        }
        
    } catch (error) {
        console.error('Error generating headline for category:', category, error);
        return `An unexpected error occurred: ${error.message}. Unable to generate headline.`;
    }
}

async function fetchOldHeadlinesByCategory(category) {
    const headlinesRef = db.collection('headlines');
    const oldHeadlines = [];

    try {
        const querySnapshot = await headlinesRef
            .where('category', '==', category)
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get();
        querySnapshot.forEach(doc => {
            oldHeadlines.push(doc.data().content);
        });
        return oldHeadlines;
    } catch (error) {
        console.error('Error fetching old headlines from Firestore:', error);
        return [];
    }

}
  
async function generateHeadlines() {
    let headlines = {};

    try {
        for (let stockSymbol in stocks) {
            const category = stocks[stockSymbol].category;
            const name = stocks[stockSymbol].name;
            if (!headlines[name]) {
                headlines[name] = await generateHeadlineForCategory(category, name);

                // Perform sentiment analysis
                const sentiment = await analyzeSentiment(headlines[name]);

                // Adjust stock price based on sentiment
                adjustStockPrice(stockSymbol, sentiment);
                
            }
        }
    } catch (error) {
        console.error('Error in generating headlines:', error);
        throw error;  // Propagate the error to be handled by the caller
    }
    //await saveHeadlinesToFirestore(headlines);
    return headlines;
}

// Function to analyze sentiment
async function analyzeSentiment(text) {
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: `Analyze the sentiment of this text: "${text}"` }],
        model: "gpt-3.5-turbo-1106",
    });
    const sentiment = response.choices[0].message.content.trim();
    return sentiment; // "Positive", "Negative", or "Neutral"

}

// Function to adjust stock price based on sentiment
function adjustStockPrice(stockSymbol, sentiment) {
    const adjustmentFactor = 0.05; // Adjustment factor (5%)
    if (sentiment === "Positive") {
        stocks[stockSymbol].price *= (1 + adjustmentFactor);
    } else if (sentiment === "Negative") {
        stocks[stockSymbol].price *= (1 - adjustmentFactor);
    }
    // No change for "Neutral" sentiment
}

cron.schedule('*/5 * * * *', () => {
    console.log('Running generateHeadlines every minute');
    generateHeadlines().then((headlines) => {
      console.log('Generated headlines:', headlines);
      // Emit the headlines to the connected clients via socket.io
      io.emit('headline update', headlines);
      // Save the generated headlines to Firestore
      saveHeadlinesToFirestore(headlines).then(() => {
          Object.assign(latestHeadlines, headlines); // Update the global latestHeadlines
          console.log('Headlines successfully saved to Firestore');
      }).catch(error => {
          console.error('Error saving headlines to Firestore:', error);
      });
    }).catch(error => {
      console.error('Error generating headlines:', error);
    });
});

  


async function initializeServer() {
  await fetchCurrentPricesFromFirestore();

  // Fetch the latest headlines from Firestore
  latestHeadlinesGlobal = await fetchLatestHeadlines();
  const latestHeadlines = await fetchLatestHeadlines();

  app.use(cors({
    origin: 'http://localhost:3001', // or '*' to allow all origins
    //origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Route to generate and fetch headlines/articles
  app.get('/generate-content', async (req, res) => {
    try {
        const headlines = await generateHeadlines();
        // Update the latest headlines with newly generated ones
        Object.assign(latestHeadlinesGlobal, headlines);
        res.json(headlines);
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: error.message });
    }
  });


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

  app.get('/latest-headlines', (req, res) => {
    res.json(latestHeadlinesGlobal);
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
