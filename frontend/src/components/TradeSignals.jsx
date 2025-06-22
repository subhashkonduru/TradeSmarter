import React, { useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from '../styles/WalletInputForm.module.css';

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
);

const TokenSignalChart = () => {
    const [token, setToken] = useState('solana');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [useAdjusted, setUseAdjusted] = useState(true);

    const fetchTokenSignals = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/token-trade-signals?token_id=${token}`);
            setData(res.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const signalKey = useAdjusted ? 'adjusted_signal' : 'signal';

    const chartData = data?.analysis?.length ? {
        labels: data.analysis.map(entry => entry.timestamp),
        datasets: [
            {
                label: 'Price',
                data: data.analysis.map(entry => entry.price),
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                pointRadius: 2,
                fill: false,
            },
            {
                label: 'SMA 5',
                data: data.analysis.map(entry => entry.SMA_5),
                borderColor: 'orange',
                backgroundColor: 'transparent',
                pointRadius: 0,
                fill: false,
                tension: 0.3
            },
            {
                label: 'SMA 10',
                data: data.analysis.map(entry => entry.SMA_10),
                borderColor: 'cyan',
                backgroundColor: 'transparent',
                pointRadius: 0,
                fill: false,
                tension: 0.3
            },
            {
                label: 'Buy',
                data: data.analysis
                    .filter(entry => (entry[signalKey] || entry.signal) === 'Buy')
                    .map(entry => ({ x: entry.timestamp, y: entry.price })),
                pointBackgroundColor: 'green',
                pointBorderColor: 'green',
                pointStyle: 'rectRot',
                borderColor: 'green', // Add this to show legend line
                showLine: false,
                pointRadius: 10,
                type: 'line',
                fill: false
            },
            {
                label: 'Sell',
                data: data.analysis
                    .filter(entry => (entry[signalKey] || entry.signal) === 'Sell')
                    .map(entry => ({ x: entry.timestamp, y: entry.price })),
                pointBackgroundColor: 'red',
                pointBorderColor: 'red',
                pointStyle: 'rectRot',
                borderColor: 'red', // Add this to show legend line
                showLine: false,
                pointRadius: 8,
                type: 'line',
                fill: false
            }
        ]
    } : null;
    const latestEntry = data?.analysis?.[data.analysis.length - 1];


    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                    usePointStyle: true
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white'
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: 'white',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            y: {
                ticks: {
                    color: 'white'
                },
                title: {
                    display: true,
                    text: 'Price (USD)',
                    color: 'white',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    return (
        <div className="token-card" style={{ backgroundColor: '#161b22', padding: '2rem', borderRadius: '12px' }}>
            <h2 style={{ color: 'white' }}>📈 TradeSmarter: AI-Driven Crypto Signals</h2>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Enter token name (e.g. solana)"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className={styles.input}
                />
                <button onClick={fetchTokenSignals} className={styles.button} disabled={!token || loading}>
                    {loading ? 'Loading...' : 'Get Signal Chart'}
                </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label style={{ color: 'white' }}>
                    <input
                        type="checkbox"
                        checked={useAdjusted}
                        onChange={() => setUseAdjusted(prev => !prev)}
                        style={{ marginRight: '0.5rem' }}
                    />
                    Use Adjusted Signal
                </label>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {data && (
                <>
                    <p style={{ color: 'white' }}><strong>USD Index Trend:</strong> {data.usd_index_trend}</p>
                    <p style={{ color: 'white' }}><strong>USD % Change:</strong> {data.usd_change_pct}%</p>
                    {chartData && <Line data={chartData} options={options} />}
                </>
            )}
            {data?.note && (
                <>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                        📌 Note: {data.note}
                    </p>
                    {latestEntry && (
                        <div style={{ marginTop: '1rem', color: 'white' }}>
                            <h4>📅 Today's Signal ({latestEntry.timestamp}):</h4>
                            <p><strong>Price:</strong> ${latestEntry.price}</p>
                            <p><strong>SMA 5:</strong> {latestEntry.SMA_5}</p>
                            <p><strong>SMA 10:</strong> {latestEntry.SMA_10}</p>
                            <p>
                                <strong>Signal:</strong>{' '}
                                <span style={{ color: (latestEntry[signalKey] || latestEntry.signal) === 'Buy' ? 'limegreen' : 'red' }}>
                                    {latestEntry[signalKey] || latestEntry.signal}
                                </span>
                            </p>
                        </div>
                    )}

                </>
            )}

        </div>
    );
};

export default TokenSignalChart;
