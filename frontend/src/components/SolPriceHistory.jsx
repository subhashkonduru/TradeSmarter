// src/components/SolPriceHistory.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './SolPriceHistory.css';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

const SolPriceHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  const fetchHistory = async (selectedDays) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sol-price-history?days=${selectedDays}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setHistory(data.sol_price_history);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch price history');
    }
  };

  useEffect(() => {
    fetchHistory(days);
  }, [days]);

  const chartData = {
    labels: history.map((entry) => new Date(entry.timestamp)),
    datasets: [
      {
        label: 'SOL Price (USD)',
        data: history.map((entry) => entry.price),
        borderColor: '#58a6ff',
        backgroundColor: 'rgba(88, 166, 255, 0.2)',
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#f0f6fc',
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `$${context.raw.toFixed(2)}`,
      },
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: days === 1 ? 'hour' : 'day',
      },
      ticks: {
        color: '#8b949e',
      },
      title: {
        display: true,
        text: 'Date',
        color: '#f0f6fc',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    y: {
      ticks: {
        color: '#8b949e',
        callback: (value) => `$${value}`,
      },
      title: {
        display: true,
        text: 'Price (USD)',
        color: '#f0f6fc',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      grid: {
        color: '#30363d',
      },
    },
  },
};


  return (
    <div className="history-container">
      <div className="history-card">
        <h2 className="history-heading">📈 SOL Price Chart</h2>

        <div className="dropdown-wrapper">
          <label htmlFor="days">View for:</label>
          <select
            id="days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>

        {error ? (
          <div className="history-error">{error}</div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default SolPriceHistory;
