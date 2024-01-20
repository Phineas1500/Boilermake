// stockService.js
import { db } from './firebaseConfig';
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";

// Add this new function to fetch historical data
export const fetchHistoricalData = async (stockSymbol) => {
  const historicalData = [];
  const querySnapshot = await db.collection('stocks')
                                .doc(stockSymbol)
                                .collection('historicalPrices')
                                .orderBy('timestamp')
                                .get();
  
  querySnapshot.forEach((doc) => {
    historicalData.push({
      timestamp: doc.data().timestamp.toDate(), // Convert Firestore timestamp to JavaScript Date object
      price: doc.data().price
    });
  });
  
  return historicalData;
};

// Update the current price of a stock
export const updateCurrentPrice = async (stockSymbol, price) => {
  const stockRef = doc(db, "stocks", stockSymbol);
  try {
    await updateDoc(stockRef, {
      currentPrice: price
    });
    console.log(`Updated current price for ${stockSymbol}`);
  } catch (error) {
    console.error("Error updating current price:", error);
    throw error;
  }
};

// Add a new historical price entry for a stock
export const addHistoricalPrice = async (stockSymbol, price) => {
  const historicalRef = collection(db, "stocks", stockSymbol, "historical");
  try {
    await addDoc(historicalRef, {
      price: price,
      timestamp: new Date() // Firestore will convert this into a Timestamp
    });
    console.log(`Added historical price for ${stockSymbol}`);
  } catch (error) {
    console.error("Error adding historical price:", error);
    throw error;
  }
};
