# TrendSage AI: Your AI-powered crypto sidekick
import json
from datetime import datetime
import random
from typing import Dict, List, Optional

class TrendSageAI:
    def __init__(self):
        self.bot_name = "TrendSage AI"
        self.bot_intro = "Hey there! I'm TrendSage AI 🤖 — your AI-powered crypto sidekick! Let's find you a green and growing coin! 🚀"
        self.crypto_db = {
            "Bitcoin": {
                "price_trend": "rising",
                "market_cap": "high",
                "energy_use": "high",
                "sustainability_score": 3/10,
                "volatility": "medium",
                "last_updated": "2024-03-20",
                "sentiment": "positive",
                "key_features": ["store of value", "institutional adoption", "limited supply"]
            },
            "Ethereum": {
                "price_trend": "stable",
                "market_cap": "high",
                "energy_use": "medium",
                "sustainability_score": 6/10,
                "volatility": "medium",
                "last_updated": "2024-03-20",
                "sentiment": "positive",
                "key_features": ["smart contracts", "defi", "nft platform"]
            },
            "Cardano": {
                "price_trend": "rising",
                "market_cap": "medium",
                "energy_use": "low",
                "sustainability_score": 8/10,
                "volatility": "high",
                "last_updated": "2024-03-20",
                "sentiment": "positive",
                "key_features": ["proof of stake", "research-driven", "scalable"]
            }
        }
        self.conversation_history = []
        self.user_preferences = {}

    def analyze_query(self, query: str) -> Dict:
        """Analyze user query for key terms and context."""
        query = query.lower()
        analysis = {
            "sustainability": "sustainable" in query or "eco" in query,
            "trending": "trending" in query or "rising" in query,
            "growth": "best" in query or "growth" in query,
            "risk": "risk" in query or "safe" in query,
            "features": "feature" in query or "what can" in query,
            "compare": "compare" in query or "difference" in query
        }
        return analysis

    def get_recommendation(self, analysis: Dict) -> str:
        """Generate personalized recommendation based on analysis."""
        if analysis["sustainability"]:
            recommend = max(self.crypto_db, key=lambda x: self.crypto_db[x]["sustainability_score"])
            return f"Invest in {recommend}! 🌱 It's eco-friendly and has long-term potential!"
        
        elif analysis["trending"]:
            trending = [name for name, data in self.crypto_db.items() if data["price_trend"] == "rising"]
            return f"These cryptos are trending up 📈: {', '.join(trending)}"
        
        elif analysis["growth"]:
            growth_coins = [name for name, data in self.crypto_db.items() 
                          if data["price_trend"] == "rising" and data["market_cap"] == "high"]
            return f"These look promising for long-term growth! 🚀: {', '.join(growth_coins)}"
        
        elif analysis["risk"]:
            low_risk = [name for name, data in self.crypto_db.items() 
                       if data["volatility"] == "low" and data["market_cap"] == "high"]
            return f"For lower risk, consider: {', '.join(low_risk)}"
        
        elif analysis["features"]:
            features = []
            for coin, data in self.crypto_db.items():
                features.append(f"{coin}: {', '.join(data['key_features'])}")
            return "Key features:\n" + "\n".join(features)
        
        elif analysis["compare"]:
            return self.compare_cryptos()
        
        return "I'm not sure about that. Try asking about sustainability, trends, or features."

    def compare_cryptos(self) -> str:
        """Generate a comparison of cryptocurrencies."""
        comparison = []
        for coin, data in self.crypto_db.items():
            comparison.append(f"{coin}:\n"
                           f"  • Sustainability: {data['sustainability_score']}/10\n"
                           f"  • Market Cap: {data['market_cap']}\n"
                           f"  • Volatility: {data['volatility']}\n"
                           f"  • Sentiment: {data['sentiment']}")
        return "\n\n".join(comparison)

    def update_conversation_history(self, query: str, response: str):
        """Maintain conversation history for context."""
        self.conversation_history.append({
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "response": response
        })

    def run(self):
        """Main interaction loop."""
        print(self.bot_intro)
        
        while True:
            user_query = input("\nYou: ").lower()
            
            if "exit" in user_query or "bye" in user_query:
                print(f"{self.bot_name}: Alright, happy investing! 💰")
                break
            
            analysis = self.analyze_query(user_query)
            response = self.get_recommendation(analysis)
            self.update_conversation_history(user_query, response)
            
            print(f"{self.bot_name}: {response}")

        disclaimer = "\n⚠️ Crypto is risky—always do your own research!"
        print(disclaimer)

if __name__ == "__main__":
    ai = TrendSageAI()
    ai.run() 


