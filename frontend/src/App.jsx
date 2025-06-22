// src/App.jsx
import React from 'react';
import Portfolio from './components/Portfolio';
import SolPriceHistory from './components/SolPriceHistory';
import TokenSentiment from './components/TokenSentiment';
import TradeSignals from './components/TradeSignals'; // ⬅️ NEW
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>CoinMe</h1>
      <Portfolio />
      <TradeSignals />
      <TokenSentiment />
      <SolPriceHistory />
    </div>
  );
}

export default App;
