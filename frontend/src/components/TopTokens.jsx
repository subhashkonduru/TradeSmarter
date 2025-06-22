import React, { useState } from 'react';

const TopTokens = () => {
  const [topTokens, setTopTokens] = useState([]);

  const fetchTopTokens = async () => {
    const res = await fetch('${process.env.REACT_APP_API_BASE_URL}/top-tokens?limit=10');
    const data = await res.json();
    setTopTokens(data);
  };

  return (
    <div style={styles.container}>
      <h2>🚀 Top Tokens</h2>
      <button style={styles.button} onClick={fetchTopTokens}>Fetch Top Tokens</button>
      <ol style={styles.list}>
        {topTokens.map((token, idx) => (
          <li key={idx}>{token.symbol} - ${token.price?.toFixed(4)}</li>
        ))}
      </ol>
    </div>
  );
};

const styles = {
  container: { margin: '2rem 0' },
  button: { padding: '0.5rem 1rem', backgroundColor: '#8250df', color: '#fff', border: 'none' },
  list: { marginTop: '1rem', paddingLeft: '1.5rem' },
};

export default TopTokens;
