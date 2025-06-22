import React, { useState } from 'react';

const TokenInfo = () => {
  const [mint, setMint] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  const fetchTokenInfo = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/token-info?mint=${mint}`);
    const data = await res.json();
    setTokenInfo(data);
  };

  return (
    <div style={styles.container}>
      <h2>🎯 Token Info</h2>
      <input
        style={styles.input}
        type="text"
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        placeholder="Enter token mint"
      />
      <button style={styles.button} onClick={fetchTokenInfo}>Fetch</button>
      {tokenInfo && (
        <pre style={styles.output}>{JSON.stringify(tokenInfo, null, 2)}</pre>
      )}
    </div>
  );
};

const styles = {
  container: { margin: '2rem 0' },
  input: { padding: '0.5rem', width: '300px', marginRight: '1rem' },
  button: { padding: '0.5rem 1rem', backgroundColor: '#238636', color: '#fff', border: 'none' },
  output: { backgroundColor: '#111', padding: '1rem', marginTop: '1rem', color: '#0f0' },
};

export default TokenInfo;
