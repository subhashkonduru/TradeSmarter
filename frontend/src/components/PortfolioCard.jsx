import React from 'react';
import styles from '../styles/PortfolioCard.module.css';

const PortfolioCard = ({ portfolio }) => {
  return (
    <div className={styles.portfolioBox}>
      <div className={styles.item}>
        <span>Wallet</span>
        <span>{portfolio.wallet}</span>
      </div>
      <div className={styles.item}>
        <span>SOL Balance</span>
        <span>{portfolio.sol_balance.toFixed(4)} SOL</span>
      </div>
      <div className={styles.item}>
        <span>Current SOL Price</span>
        <span>${portfolio.sol_usd_price.toFixed(2)}</span>
      </div>
      <div className={styles.item}>
        <span>Total Value</span>
        <span>${portfolio.sol_usd_value.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PortfolioCard;
