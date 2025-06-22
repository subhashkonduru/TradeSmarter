import React, { useState } from 'react';
import WalletInputForm from './WalletInputForm';
import PortfolioCard from './PortfolioCard';
import ErrorMessage from './ErrorMessage';
import styles from '../styles/Portfolio.module.css';

const Portfolio = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const fetchPortfolio = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/portfolio?wallet_address=${walletAddress}`);
    const data = await response.json();

    if (data.error) {
      setError(data.error);
      setPortfolio(null);
    } else {
      setPortfolio(data);
      setError('');
    }
  } catch (err) {
    setError('Failed to fetch portfolio.');
    setPortfolio(null);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Wallet Insight</h2>
        <WalletInputForm
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          onSubmit={fetchPortfolio}
          loadind={loading}
        />
        {portfolio && <PortfolioCard portfolio={portfolio} />}
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
};

export default Portfolio;
