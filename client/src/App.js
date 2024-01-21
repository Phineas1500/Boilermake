// client/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase authentication methods
import StockComponent from './StockComponent';
import NewsPage from './NewsPage';
import TradeScreenComponent from './TradeScreenComponent';
import ProfileComponent from './ProfileComponent';
import RegisterComponent from './RegisterComponent';
import LoginComponent from './LoginComponent';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute
import LandingPage from './LandingPage'; // Import the LandingPage component
import { saveUserProfile } from './userService';
import { fetchUserProfileFromFirestore } from './userService';


const socket = io('http://localhost:3000'); // Initialize the socket connection
const auth = getAuth(); // Initialize Firebase Auth

function App() {
  const [stocks, setStocks] = useState({});
  const [balance, setBalance] = useState(100000); // User's starting balance
  const [portfolio, setPortfolio] = useState({}); // User's stock portfolio
  const [user, setUser] = useState(null); // State to track user authentication

  const updateUserProfileInFirestore = async (newBalance, newPortfolio) => {
    console.log("user", user);
    console.log("uid", user.uid);
    if (user && user.uid) {
      try {
        await saveUserProfile(user.uid, {
          balance: newBalance,
          portfolio: newPortfolio,
        });
        console.log("UserProfile updated in Firestore successfully.");
      } catch (error) {
        console.error("Error updating user profile in Firestore:", error);
      }
    }
  };

  const buyStock = (stockSymbol, quantity, price) => {
    const cost = quantity * price;
    console.log(`Attempting to buy ${quantity} of ${stockSymbol} for $${cost}`);
    if (balance >= cost) {
      setBalance(prevBalance => {
        const newBalance = prevBalance - cost;
        console.log(`New balance after buying: $${newBalance}`);
        setPortfolio(prevPortfolio => {
          const newPortfolio = { ...prevPortfolio, [stockSymbol]: (prevPortfolio[stockSymbol] || 0) + quantity };
          console.log(`New portfolio after buying: `, newPortfolio);
          // Update Firestore after buying
          updateUserProfileInFirestore(newBalance, newPortfolio)
            .then(() => console.log("Firestore updated successfully after buying"))
            .catch((error) => console.error("Error updating Firestore after buying:", error));
          return newPortfolio;
        });
        return newBalance;
      });
    } else {
      alert('Not enough balance to complete this purchase.');
    }
  };
  
  const sellStock = (stockSymbol, quantity, price) => {
    console.log(`Attempting to sell ${quantity} of ${stockSymbol}`);
    setPortfolio(prevPortfolio => {
      const stockQuantity = prevPortfolio[stockSymbol] || 0;
      if (stockQuantity >= quantity) {
        const newQuantity = stockQuantity - quantity;
        const proceeds = quantity * price;
        setBalance(prevBalance => {
          const newBalance = prevBalance + proceeds;
          console.log(`New balance after selling: $${newBalance}`);
          const newPortfolio = { ...prevPortfolio };
          if (newQuantity > 0) {
            newPortfolio[stockSymbol] = newQuantity;
          } else {
            delete newPortfolio[stockSymbol];
          }
          console.log(`New portfolio after selling: `, newPortfolio);
          updateUserProfileInFirestore(newBalance, newPortfolio)
            .then(() => console.log("Firestore updated successfully after selling"))
            .catch((error) => console.error("Error updating Firestore after selling:", error));
          return newBalance;
        });
        return { ...prevPortfolio, [stockSymbol]: newQuantity };
      } else {
        alert('You do not own enough shares to sell this quantity.');
        return prevPortfolio;
      }
    });
  };
  
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser); // Log the current user
      if (currentUser) {
        // If a user is logged in, fetch their profile from Firestore
        const userProfile = await fetchUserProfileFromFirestore(currentUser.uid);
        if (userProfile) {
          // Update local state with the fetched profile data
          setBalance(userProfile.balance);
          setPortfolio(userProfile.portfolio);
        }
        setUser(currentUser);
      } else {
        // No user is logged in
        setUser(null);
        setBalance(100000); // Reset to default or a logged out state
        setPortfolio({});
      }
    });
    // Fetch initial stock data from the server
    fetch('http://localhost:3000/stocks')
      .then(response => response.json())
      .then(data => setStocks(data))
      .catch(error => console.error('Error fetching stocks:', error));

    // Listen for 'price update' events from the server
    socket.on('price update', updatedStocks => {
      setStocks(updatedStocks);
    });

    // Return a function to unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
      socket.off('price update');
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/login" element={<LoginComponent setUser={setUser} />} /> {/* Pass setUser to LoginComponent */}
          <Route path="/stocks" element={
            <ProtectedRoute user={user}>
              <StockComponent stocks={stocks} balance={balance} portfolio={portfolio} />
            </ProtectedRoute>
          } />
          <Route path="/news" component={NewsPage} />
          <Route path="/trade/:stockSymbol" element={
            <ProtectedRoute user={user}>
              <TradeScreenComponent stocks={stocks} balance={balance} buyStock={buyStock} sellStock={sellStock} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <ProfileComponent portfolio={portfolio} stocks={stocks} balance={balance} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;