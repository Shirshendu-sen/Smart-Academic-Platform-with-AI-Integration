from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found in environment variables")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Service',
        'model_configured': model is not None
    })

@app.route('/api/generate', methods=['POST'])
def generate_content():
    """Generate content using Gemini API"""
    if not model:
        return jsonify({
            'error': 'AI model not configured. Please set GEMINI_API_KEY.'
        }), 500
    
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Generate response
        response = model.generate_content(prompt)
        
        return jsonify({
            'response': response.text,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint for conversational AI"""
    if not model:
        return jsonify({
            'error': 'AI model not configured. Please set GEMINI_API_KEY.'
        }), 500
    
    try:
        data = request.json
        message = data.get('message', '')
        history = data.get('history', [])
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Start chat with history if provided
        chat = model.start_chat(history=history)
        response = chat.send_message(message)
        
        return jsonify({
            'response': response.text,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('NODE_ENV', 'development') == 'development'
    
    print(f"Starting AI Service on port {port}")
    print(f"Debug mode: {debug}")
    print(f"Model configured: {model is not None}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
