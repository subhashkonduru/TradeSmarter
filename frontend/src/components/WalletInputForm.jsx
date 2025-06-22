import React from 'react';
import styles from '../styles/WalletInputForm.module.css';

const WalletInputForm = ({ walletAddress, setWalletAddress, onSubmit, loading }) => (
  <div className={styles.inputGroup}>
    <input
      type="text"
      placeholder="Enter your Solana wallet address"
      value={walletAddress}
      onChange={(e) => setWalletAddress(e.target.value)}
      className={styles.input}
    />
    <button onClick={onSubmit} className={styles.button} disabled={!walletAddress || loading}>
      {loading ? 'Analyzing...' : 'Analyze'}
    </button>

  </div>
);

export default WalletInputForm;
