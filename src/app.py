from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from trendsage_ai import TrendSageAI
import json

app = Flask(__name__)
CORS(app)

ai = TrendSageAI()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    analysis = ai.analyze_query(user_message)
    response = ai.get_recommendation(analysis)
    ai.update_conversation_history(user_message, response)
    
    return jsonify({
        'response': response,
        'analysis': analysis
    })

@app.route('/api/crypto-data')
def get_crypto_data():
    return jsonify(ai.crypto_db)

@app.route('/api/compare')
def compare_cryptos():
    return jsonify({
        'comparison': ai.compare_cryptos()
    })

if __name__ == '__main__':
    app.run(debug=True) 