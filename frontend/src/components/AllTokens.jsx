import React, { useState } from 'react';

const AllTokens = () => {
  const [tokens, setTokens] = useState([]);

  const fetchAllTokens = async () => {
    const res = await fetch('${process.env.REACT_APP_API_BASE_URL}/all-tokens');
    const data = await res.json();
    setTokens(data.slice(0, 20));
  };

  return (
    <div style={styles.container}>
      <h2>📜 All Tokens (First 20)</h2>
      <button style={styles.button} onClick={fetchAllTokens}>Load Tokens</button>
      <ul style={styles.list}>
        {tokens.map((token) => (
          <li key={token.address}>{token.symbol} - ${token.price?.toFixed(4)}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { margin: '2rem 0' },
  button: { padding: '0.5rem 1rem', backgroundColor: '#1f6feb', color: '#fff', border: 'none' },
  list: { marginTop: '1rem', lineHeight: '1.8' },
};

export default AllTokens;
