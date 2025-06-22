# 📘 TradeSmarter Documentation  
*AI-Driven Crypto Insight Platform*

---

## 🔹 Introduction

In a world flooded with crypto noise, **TradeSmarter** brings intelligent clarity. Designed for traders of all experience levels, it combines algorithmic strategy with real-time insights and an elegant interface. From signal-based decision-making to wallet intelligence and sentiment analysis, TradeSmarter empowers users to trade confidently, backed by clean logic and sharp data.

---

## 🔹 Key Features

**1. Trading Signal Dashboard**  
- Based on *SMA 5 vs. SMA 10 crossover*  
- Interprets market momentum into Buy/Sell signals  
- USD price movement is factored into strategy for better accuracy

**2. Wallet Intelligence Tool**  
- Paste any Solana public address  
- Fetches wallet balance, real-time valuation, and token breakdown  
- No login or wallet connection required

**3. Sentiment Analysis Engine**  
- Analyzes live token-related headlines using NLP  
- Returns average sentiment scores, polarity, and risk tag  
- Supports trader intuition with emotional context

**4. Visual Charts and UX**  
- Recharts-powered price and sentiment graphs  
- Fully responsive, dark mode–compatible UI  
- Mobile-first layout for traders on the move

---

## 🧠 Signal Logic Engine

TradeSmarter uses a hybrid SMA + USD logic to enhance accuracy:

### ✅ SMA Crossover Logic

| SMA Condition      | Interpretation                    | Signal    |
|--------------------|------------------------------------|-----------|
| SMA 5 > SMA 10     | Bullish trend → upward momentum    | ✅ Buy     |
| SMA 5 < SMA 10     | Bearish trend → momentum dropping  | ❌ Sell    |
| SMA 5 ≈ SMA 10     | Momentum unclear                   | ⏸ Neutral |

### 💵 USD Price-Enhanced Signal Logic

| SMA Logic           | USD Price Trend | Interpretation                            | Signal Type       |
|---------------------|------------------|--------------------------------------------|--------------------|
| SMA 5 > SMA 10      | 🔼 Rising        | Strong bullish alignment                  | ✅ Buy             |
| SMA 5 > SMA 10      | 🔽 Falling       | Potential fakeout—price doesn't support    | ⚠️ Cautious Buy    |
| SMA 5 < SMA 10      | 🔽 Falling       | Strong bearish confirmation                | ❌ Sell            |
| SMA 5 < SMA 10      | 🔼 Rising        | Trend conflict—market indecision           | ⚠️ Hold            |
| SMA 5 ≈ SMA 10      | ➡️ Flat          | No momentum, trend unclear                 | ⏸ Neutral          |

> 📌 Example (June 22, 2025):  
> SMA 5 = 142.1, SMA 10 = 145.63, USD = $134 → Despite upward price, SMA crossover is bearish. Signal: ⚠️ Hold.

---

## 🏗️ Technical Architecture

### 1. Frontend
- **Framework:** React.js  
- **Routing:** React Router  
- **Charting:** Recharts  
- **Styling:** CSS Modules / Tailwind  
- **Deployment:** Vercel

### 2. Backend
- **Framework:** FastAPI  
- **Endpoints:**  
  - `/signals` → Returns SMA decision  
  - `/wallet-info` → Pulls SOL balance + token list  
  - `/sentiment` → NLP-based news scan  
- **CORS:** Dynamic whitelisting

### 3. AI/NLP Engine
- **Signal Logic:** NumPy-based SMA convolution  
- **Sentiment Model:** Transformer-based (or Novita.ai API)  
- **Output:** Token polarity + risk levels

### 4. Deployment Stack

| Layer        | Tool/Service Used       |
|--------------|--------------------------|
| Hosting      | Vercel (frontend), Render/Azure (backend) |
| External APIs| CoinGecko, Novita.ai     |
| CI/CD        | GitHub Actions           |
| Auth         | (Optional) JWT-ready     |

---

## 🔄 Data Flow Diagram (Textual)

```
React Frontend (SignalChart / WalletInfo / SentimentPanel)
        ↓
FastAPI Backend (main.py)
   ├── /signals → SMA logic
   ├── /wallet-info → token balance
   └── /sentiment → NLP summary
        ↓
External APIs: CoinGecko + Novita.ai
```

---

## 🚀 Usage Guide

1. **Visit the app:**  
   [TradeSmarter Live](https://trade-smarter-git-main-shanker08s-projects.vercel.app/)

2. **For wallet analysis:**  
   - Paste your Solana public address  
   - View balance in SOL and USD  
   - Get a token-wise breakdown instantly

3. **To analyze market signal:**  
   - Go to Signal Chart tab  
   - Review current SMA 5/10 crossover  
   - Get a Buy/Sell/Hold decision

4. **To scan sentiment:**  
   - Enter a token name or symbol  
   - View average polarity, sample headlines, and risk classification

---

## 🧪 Dev Instructions

**Backend Setup**

```bash
cd backend/
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend Setup**

```bash
cd frontend/
npm install
npm start
```

---

## 🔐 Environment Configuration

| Variable           | Description                    |
|--------------------|--------------------------------|
| `NOVITA_API_KEY`   | Sentiment engine (optional)     |
| `COINGECKO_URL`    | Token pricing API               |
| `CORS_ORIGINS`     | Allowed frontend origin         |

---

## 👤 About the Developer

Crafted with care by **Subhash**  
GitHub: [@SubhashKonduru](https://github.com/subhashkonduru)  [@shanker08](https://github.com/shanker08)  
Focused on scalable deployments, production-grade code, and user-first design.

---

## 🪪 License

Open Surce License. Open for extension, contribution, and personal innovation.
