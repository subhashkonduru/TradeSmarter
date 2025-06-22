from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from typing import List
import requests
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from textblob import TextBlob

load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
from cohere import Client as CohereClient
co = CohereClient(os.getenv("COHERE_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_usd_index():
    try:
        url = "https://api.coingecko.com/api/v3/coins/usd/market_chart"
        params = {"vs_currency": "inr", "days": 7}
        res = requests.get(url, params=params)
        data = res.json()

        prices = data.get("prices", [])
        if not prices or len(prices) < 2:
            return None, "Insufficient USD price data"

        prices.sort(key=lambda x: x[0])
        first_price = prices[0][1]
        last_price = prices[-1][1]
        change_pct = ((last_price - first_price) / first_price) * 100
        trend = "Rising" if change_pct > 0.3 else "Falling" if change_pct < -0.3 else "Stable"

        return {
            "usd_index_trend": trend,
            "usd_change_pct": round(change_pct, 2)
        }, None
    except Exception as e:
        return None, str(e)

@app.get("/token-trade-signals")
def token_trade_signals(token_id: str = Query("solana"), days: int = Query(30)):
    try:
        token_url = f"https://api.coingecko.com/api/v3/coins/{token_id}/market_chart"
        params = {"vs_currency": "usd", "days": days}
        resp = requests.get(token_url, params=params)
        data = resp.json()

        prices = data.get("prices", [])
        if not prices or len(prices) < 10:
            return {"error": f"Insufficient price data for token '{token_id}'."}

        df = pd.DataFrame(prices, columns=["timestamp", "price"])
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("timestamp", inplace=True)

        median_diff = df.index.to_series().diff().median()
        if median_diff < pd.Timedelta("12H"):
            df = df.resample("1D").mean()

        df["SMA_5"] = df["price"].rolling(window=5).mean()
        df["SMA_10"] = df["price"].rolling(window=10).mean()
        df = df.dropna(subset=["SMA_5", "SMA_10"])

        df["signal"] = df.apply(
            lambda r: "Buy" if r["SMA_5"] > r["SMA_10"]
            else "Sell" if r["SMA_5"] < r["SMA_10"]
            else "Hold", axis=1
        )

        usd_data, error = fetch_usd_index()
        if error:
            usd_data = {"usd_index_trend": "Unknown", "usd_change_pct": None}

        df = df.reset_index()
        df["timestamp"] = df["timestamp"].dt.strftime("%Y-%m-%d")
        df[["price", "SMA_5", "SMA_10"]] = df[["price", "SMA_5", "SMA_10"]].round(2)

        return JSONResponse({
            "token": token_id,
            "usd_index_trend": usd_data["usd_index_trend"],
            "usd_change_pct": usd_data["usd_change_pct"],
            "analysis": df.to_dict(orient="records"),
            "note": "Signals are based on SMA crossover only (no adjustment)."
        })
    except Exception as e:
        return {"error": str(e)}

@app.get("/token-sentiment")
def token_sentiment(token: str = Query(...)):
    try:
        # 1. Fetch News Articles
        news_url = (
            f"https://newsapi.org/v2/everything?q={token}&language=en&pageSize=5&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
        )
        news_response = requests.get(news_url)
        articles = news_response.json().get("articles", [])

        summaries = []
        sentiment_scores = []

        for article in articles:
            title = article.get("title", "")
            description = article.get("description", "")
            content = f"{title}. {description}"

            # 2. Sentiment Analysis
            sentiment = TextBlob(content).sentiment.polarity
            sentiment_scores.append(sentiment)

            # 3. Summarize using Cohere if content is long enough
            if len(content) >= 250:
                response = co.summarize(
                    text=content,
                    length='short',
                    format='paragraph',
                    model='command'
                )
                summary_text = response.summary
            else:
                summary_text = content  # fallback

            summaries.append({
                "summary": summary_text,
                "sentiment": sentiment
            })

        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
        sentiment_label = "Positive" if avg_sentiment > 0.1 else "Neutral" if avg_sentiment > -0.1 else "Negative"
        risk_warning = "⚠️ FUD Alert" if avg_sentiment < -0.2 else "✅ No major concerns"

        return {
            "token": token.upper(),
            "average_sentiment_score": avg_sentiment,
            "sentiment": sentiment_label,
            "risk_warning": risk_warning,
            "news_analysis": summaries
        }

    except Exception as e:
        return {"error": str(e)}
  
@app.get("/portfolio")
async def get_portfolio(wallet_address: str = Query(...)):
    try:
        async with AsyncClient("https://api.mainnet-beta.solana.com") as client:
            pubkey = Pubkey.from_string(wallet_address)
            sol_response = await client.get_balance(pubkey)
            sol_balance = sol_response.value / 1_000_000_000

            sol_price = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").json()
            sol_usd_price = sol_price['solana']['usd']

            return {
                "wallet": wallet_address,
                "sol_balance": sol_balance,
                "sol_usd_price": sol_usd_price,
                "sol_usd_value": sol_balance * sol_usd_price
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/balance")
async def get_balance(wallet_address: str = Query(...)):
    try:
        async with AsyncClient("https://api.mainnet-beta.solana.com") as client:
            pubkey = Pubkey.from_string(wallet_address)
            response = await client.get_balance(pubkey)
            lamports = response.value
            sol_balance = lamports / 1_000_000_000
            return {"wallet": wallet_address, "balance": sol_balance}
    except Exception as e:
        return {"error": str(e)}

@app.get("/top-tokens")
def get_top_tokens(limit: int = 5):
    try:
        url = "https://api.coingecko.com/api/v3/coins/markets"
        params = {
            "vs_currency": "usd",
            "order": "market_cap_desc",
            "per_page": limit,
            "page": 1,
            "sparkline": "false"
        }
        resp = requests.get(url, params=params, timeout=5)
        data = resp.json()
        return [{"id": coin["id"], "name": coin["name"]} for coin in data]
    except Exception as e:
        return {"error": str(e)}

@app.get("/all-tokens")
def get_all_tokens():
    try:
        response = requests.get("https://quote-api.jup.ag/v4/tokens")
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@app.get("/sol-price-history")
def sol_price_history(days: int = 7):
    try:
        url = f"https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days={days}"
        response = requests.get(url)
        data = response.json()

        prices = [{"timestamp": ts, "price": price} for ts, price in data.get("prices", [])]
        return {"sol_price_history": prices}
    except Exception as e:
        return {"error": str(e)}
