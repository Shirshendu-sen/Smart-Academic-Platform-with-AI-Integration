import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Allow requests from your backend only
CORS(app, origins=[
    "http://localhost:3001",
    "https://*.vercel.app"
])

# ── CONFIGURE GEMINI ─────────────────────────────────────────────────
# FIX: 'gemini-pro' is deprecated and throws an error.
# Use 'gemini-1.5-flash' — it's faster, cheaper, and still free tier.
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")  # ← FIXED: gemini-1.5-flash and 2.0-flash deprecated/quota-exceeded


def clean_json(text: str) -> str:
    """
    FIX: Gemini sometimes wraps its JSON response in markdown code blocks
    like ```json ... ```. This causes json.loads() to crash.
    This function strips those wrappers before parsing.
    """
    text = text.strip()
    # Remove ```json at the start and ``` at the end
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return text.strip()


def call_gemini(prompt: str) -> dict | list:
    """
    Wrapper for all Gemini calls with error handling.
    Returns the parsed JSON, or raises an exception with a clear message.
    """
    try:
        response = model.generate_content(prompt)
        # Check for prompt feedback / block reasons
        if hasattr(response, 'prompt_feedback') and response.prompt_feedback:
            print(f"[Gemini prompt_feedback] {response.prompt_feedback}")
        raw_text = response.text
    except Exception as e:
        print(f"[Gemini API Error] {type(e).__name__}: {e}")
        raise

    cleaned = clean_json(raw_text)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {str(e)}\nRaw response: {raw_text[:200]}")


# ─── HEALTH CHECK ──────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": "gemini-2.5-flash"})


# ─── FEATURE 1: AI QUIZ GENERATOR ─────────────────────────────────────
@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    """
    Input:  { "content": "lecture notes text..." }
    Output: { "questions": [ { "question", "options"[], "correct_answer", "explanation" } ] }
    """
    try:
        data = request.get_json()
        if not data or not data.get('content'):
            return jsonify({"error": "Request body must include 'content' field."}), 400

        lesson_content = data['content']

        prompt = f"""
You are an expert educator. Read the following lecture notes carefully and generate
exactly 10 multiple-choice questions to test student understanding.

LECTURE NOTES:
{lesson_content}

IMPORTANT RULES:
- Questions must be based ONLY on the provided notes.
- Each question must have exactly 4 options (A, B, C, D).
- Only one option is correct.
- Include a clear, 1-sentence explanation for why the correct answer is right.
- Vary difficulty: mix easy, medium, and hard questions.

Return ONLY a valid JSON array. No introductory text. No markdown. No code blocks.
Format exactly like this:
[
  {{
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Option A is correct because..."
  }}
]
"""
        questions = call_gemini(prompt)

        # Validate the response has the right shape
        if not isinstance(questions, list) or len(questions) == 0:
            return jsonify({"error": "AI returned an unexpected format."}), 500

        return jsonify({"questions": questions})

    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"[generate-quiz error] {e}")
        return jsonify({"error": "AI service error. Please try again."}), 500


# ─── FEATURE 2: AI LECTURE SUMMARIZER ─────────────────────────────────
@app.route('/summarize', methods=['POST'])
def summarize():
    """
    Input:  { "content": "long lecture text..." }
    Output: { "overview", "key_points"[], "terms"[{"term","definition"}] }
    """
    try:
        data = request.get_json()
        if not data or not data.get('content'):
            return jsonify({"error": "Request body must include 'content' field."}), 400

        content = data['content']

        prompt = f"""
Summarize the following lecture notes for a student who needs to revise quickly.

LECTURE NOTES:
{content}

Return ONLY a valid JSON object. No markdown. No code blocks. No extra text.
Format exactly like this:
{{
  "overview": "2-sentence summary of the entire lecture",
  "key_points": [
    "Key point 1 that students must remember",
    "Key point 2 that students must remember",
    "Key point 3 that students must remember",
    "Key point 4 that students must remember",
    "Key point 5 that students must remember"
  ],
  "terms": [
    {{"term": "Technical Term", "definition": "Simple, clear definition"}},
    {{"term": "Technical Term 2", "definition": "Simple, clear definition"}},
    {{"term": "Technical Term 3", "definition": "Simple, clear definition"}}
  ]
}}
"""
        result = call_gemini(prompt)
        return jsonify(result)

    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"[summarize error] {e}")
        return jsonify({"error": "AI service error. Please try again."}), 500


# ─── FEATURE 3: AI DOUBT CHATBOT ──────────────────────────────────────
@app.route('/chat', methods=['POST'])
def chat():
    """
    Input:  { "question": "...", "context": "lesson content...", "history": [...] }
    Output: { "answer": "..." }

    The chatbot only answers questions based on the provided lesson content.
    This prevents hallucination about topics not covered in the course.
    """
    try:
        data = request.get_json()
        if not data or not data.get('question'):
            return jsonify({"error": "Request body must include 'question' field."}), 400

        question = data['question']
        context = data.get('context', '')
        history = data.get('history', [])  # [{"role": "user"|"model", "content": "..."}]

        # Build multi-turn conversation history for Gemini
        # This allows the chatbot to remember what was said earlier in the conversation
        # Validate each history message has the required structure
        gemini_history = []
        for msg in history:
            if not isinstance(msg, dict):
                continue
            role = msg.get("role")
            content = msg.get("content")
            if role not in ("user", "model") or not isinstance(content, str):
                continue
            gemini_history.append({
                "role": role,
                "parts": [content]
            })

        chat_session = model.start_chat(history=gemini_history)

        # The system prompt is prepended to the question
        # It tells Gemini to stay on topic and not invent information
        prompt = f"""You are a helpful academic tutor assistant for an online course.

COURSE MATERIAL (answer ONLY based on this):
---
{context}
---

If the student's question is not covered in the course material above, say:
"This topic isn't covered in the current lesson material. Please refer to your instructor."

Student's question: {question}

Give a clear, helpful, and concise answer."""

        response = chat_session.send_message(prompt)
        return jsonify({"answer": response.text})

    except Exception as e:
        print(f"[chat error] {e}")
        return jsonify({"error": "AI service error. Please try again."}), 500


# ─── FEATURE 4: AI PROGRESS ANALYZER ─────────────────────────────────
@app.route('/analyze-student', methods=['POST'])
def analyze_student():
    """
    Input:  { "student_data": { "completion", "avg_score", "lessons_completed", "days_inactive" } }
    Output: { "performance_level", "message", "recommendations"[] }
    """
    try:
        data = request.get_json()
        student_data = data.get('student_data', {})

        if not student_data:
            return jsonify({"error": "student_data is required."}), 400

        prompt = f"""
You are an academic performance advisor. Analyze this student's learning data.

STUDENT DATA:
- Course completion: {student_data.get('completion', 0)}%
- Average quiz score: {student_data.get('avg_score', 0)}%
- Lessons completed: {student_data.get('lessons_completed', 0)}
- Days since last activity: {student_data.get('days_inactive', 0)}

Return ONLY valid JSON. No markdown. No code blocks.
{{
  "performance_level": "excellent" | "good" | "needs_improvement" | "at_risk",
  "message": "Personalized, encouraging message to this specific student based on their data",
  "recommendations": [
    "Specific, actionable recommendation 1",
    "Specific, actionable recommendation 2",
    "Specific, actionable recommendation 3"
  ]
}}
"""
        result = call_gemini(prompt)
        return jsonify(result)

    except ValueError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"[analyze-student error] {e}")
        return jsonify({"error": "AI service error. Please try again."}), 500


# ── WSGI entry point for Vercel ────────────────────────────────────────
# Vercel's @vercel/python builder looks for a variable named 'app' that
# is a WSGI callable. Flask's app object IS a WSGI callable, so this works.
if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    print(f"AI Service running on http://localhost:{port}")
    app.run(port=port, debug=debug)
