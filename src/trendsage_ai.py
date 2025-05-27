# TrendSage AI: Your AI-powered crypto sidekick
bot_name = "TrendSage AI"
bot_intro = "Hey there! I'm TrendSage AI 🤖 — your AI-powered crypto sidekick! Let's find you a green and growing coin! 🚀"

print(bot_intro)

crypto_db = {
    "Bitcoin": {
        "price_trend": "rising",
        "market_cap": "high",
        "energy_use": "high",
        "sustainability_score": 3/10
    },
    "Ethereum": {
        "price_trend": "stable",
        "market_cap": "high",
        "energy_use": "medium",
        "sustainability_score": 6/10
    },
    "Cardano": {
        "price_trend": "rising",
        "market_cap": "medium",
        "energy_use": "low",
        "sustainability_score": 8/10
    }
}

while True:
    user_query = input("\nYou: ").lower()

    if "sustainable" in user_query:
        recommend = max(crypto_db, key=lambda x: crypto_db[x]["sustainability_score"])
        print(f"{bot_name}: Invest in {recommend}! 🌱 It’s eco-friendly and has long-term potential!")
    
    elif "trending" in user_query or "rising" in user_query:
        trending = [name for name, data in crypto_db.items() if data["price_trend"] == "rising"]
        print(f"{bot_name}: These cryptos are trending up 📈: {', '.join(trending)}")
    
    elif "best" in user_query or "growth" in user_query:
        for name, data in crypto_db.items():
            if data["price_trend"] == "rising" and data["market_cap"] == "high":
                print(f"{bot_name}: {name} looks promising for long-term growth! 🚀")
    
    elif "exit" in user_query or "bye" in user_query:
        print(f"{bot_name}: Alright, happy investing! 💰")
        break
    
    else:
        print(f"{bot_name}: I'm not sure about that. Try asking about sustainability or trends.")

disclaimer = "\n⚠️ Crypto is risky—always do your own research!"
print(disclaimer) 


