import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from '../styles/WalletInputForm.module.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const sentimentColor = (score) => {
  if (score > 0.1) return 'green';
  if (score < -0.1) return 'red';
  return 'gray';
};

function TokenSentiment() {
  const [token, setToken] = useState('');
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchSentiment = async () => {
    setLoading(true);
    setError('');
    setSentimentData(null);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/token-sentiment?token=${token}`
      );

      console.log('Response Data:', res.data);

      if (
        typeof res.data !== 'object' ||
        !res.data.news_analysis ||
        !Array.isArray(res.data.news_analysis)
      ) {
        throw new Error('Invalid response structure');
      }

      setSentimentData(res.data);
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch sentiment data.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-card" style={{ backgroundColor: '#161b22' }}>
      <h2>🧠 Public News Based Token Sentiment Analyzer</h2>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter token name (e.g. SOL)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={styles.input}
        />
        <button
          onClick={handleFetchSentiment}
          className={styles.button}
          disabled={!token || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {sentimentData && (
        <div style={{ marginTop: '30px' }}>
          <h3>
            📊 Sentiment:{' '}
            <span
              style={{
                color: sentimentColor(sentimentData.average_sentiment_score),
              }}
            >
              {sentimentData.sentiment}
            </span>
          </h3>
          <p>
            <strong>Token:</strong> {sentimentData.token}
          </p>
          <p>
            <strong>Average Score:</strong>{' '}
            {sentimentData.average_sentiment_score.toFixed(3)}
          </p>
          <p>
            <strong>Risk Warning:</strong>{' '}
            <span style={{ fontWeight: 'bold' }}>
              {sentimentData.risk_warning}
            </span>
          </p>

          <h4 style={{ marginTop: '30px' }}>📉 Sentiment Chart</h4>
          <Bar
            data={{
              labels: sentimentData.news_analysis.map((_, i) => `Article ${i + 1}`),
              datasets: [
                {
                  label: 'Sentiment Score',
                  data: sentimentData.news_analysis.map((item) => item.sentiment),
                  backgroundColor: sentimentData.news_analysis.map((item) =>
                    sentimentColor(item.sentiment)
                  ),
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  min: -1,
                  max: 1,
                  title: {
                    display: true,
                    text: 'Polarity Score',
                  },
                },
              },
            }}
          />

          <h4 style={{ marginTop: '30px' }}>📰 News Summaries</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {sentimentData.news_analysis.map((item, index) => (
              <li key={index} style={{ marginBottom: '15px' }}>
                <div style={{ fontStyle: 'italic' }}>{item.summary}</div>
                <div>
                  <strong>Sentiment:</strong>{' '}
                  <span style={{ color: sentimentColor(item.sentiment) }}>
                    {item.sentiment.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TokenSentiment;
