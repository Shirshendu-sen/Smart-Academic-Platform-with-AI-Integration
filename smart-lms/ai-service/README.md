# AI Service

This service provides AI-powered features for the Smart Academic Platform using Google's Gemini API.

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
```

### 2. Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your actual values:
```bash
cp .env.example .env
```

Update `.env` with your Gemini API key:
```
GEMINI_API_KEY=your-actual-gemini-api-key-here
PORT=5001
```

### 5. Run the Service
**Development:**
```bash
python app.py
```

**Production:**
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

## Dependencies
- Flask - Web framework
- Flask-CORS - Cross-origin resource sharing
- Google Generative AI - Gemini API client
- python-dotenv - Environment variable management
- gunicorn - WSGI HTTP server

## API Endpoints
The service will provide AI-powered endpoints for:
- Content generation
- Question answering
- Study assistance
- And more...

## Getting a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file
