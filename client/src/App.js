/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

// client/src/App.js
// client/src/App.js
// client/src/App.js
import React, { useState } from 'react'; // Make sure to import useState
import {
  BrowserRouter as Router,
  Routes, // Replace 'Switch' with 'Routes'
  Route
} from 'react-router-dom';
import StockComponent from './StockComponent';
import TradeScreenComponent from './TradeScreenComponent';

function App() {
  const [stocks, setStocks] = useState({}); // You may want to lift the stocks state up to here

  return (
    <Router>
      <div className="App">
        <Routes> {/* Update this line */}
          <Route exact path="/" element={<StockComponent stocks={stocks} setStocks={setStocks} />} />
          <Route path="/trade/:stockSymbol" element={<TradeScreenComponent stocks={stocks} />} />
        </Routes> {/* Update this line */}
      </div>
    </Router>
  );
}

export default App;
