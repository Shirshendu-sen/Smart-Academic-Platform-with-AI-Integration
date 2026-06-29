import os
import sys
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
is_ci   = os.environ.get("CI") == "true"

if not api_key and not is_ci:
    print("ERROR: GEMINI_API_KEY is not set in your .env file", file=sys.stderr)
    print("   Get a free key at: https://aistudio.google.com/app/apikey", file=sys.stderr)
    sys.exit(1)

if api_key:
    genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel("gemini-2.5-flash") if api_key else None


def clean_json_response(text: str) -> str:
    """Remove markdown code fences that Gemini sometimes wraps around JSON."""
    text = text.strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```\s*',     '', text)
    text = re.sub(r'\s*```$',     '', text)
    return text.strip()


@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    data          = request.get_json()
    lecture_notes = data.get('lecture_notes', '')
    num_questions = data.get('num_questions', 10)

    if not lecture_notes:
        return jsonify({"error": "lecture_notes is required"}), 400

    prompt = f"""
You are an expert educator. Generate {num_questions} multiple-choice questions based on the following lecture notes.

LECTURE NOTES:
{lecture_notes}

Return ONLY a JSON array with no extra text. Format:
[
  {{
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct_answer": "A) ...",
    "explanation": "..."
  }}
]
"""
    try:
        response  = model.generate_content(prompt)
        cleaned   = clean_json_response(response.text)
        questions = json.loads(cleaned)
        return jsonify({"questions": questions})
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to parse AI response: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/summarize', methods=['POST'])
def summarize():
    data    = request.get_json()
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "content is required"}), 400

    prompt = f"""
Summarize the following lecture content. Return ONLY a JSON object with no extra text:
{{
  "overview": "2-3 sentence high-level summary",
  "key_points": ["point 1", "point 2"],
  "important_terms": ["term: definition"]
}}

CONTENT:
{content}
"""
    try:
        response = model.generate_content(prompt)
        cleaned  = clean_json_response(response.text)
        return jsonify(json.loads(cleaned))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    data           = request.get_json()
    question       = data.get('question', '')
    lesson_context = data.get('lesson_context', '')
    history        = data.get('history', [])

    if not question:
        return jsonify({"error": "question is required"}), 400

    history_text = "\n".join(
        [f"{m['role'].upper()}: {m['content']}" for m in history[-6:]]
    )

    prompt = f"""
You are a helpful AI tutor. Answer ONLY based on the lesson content provided.
If the question is not covered in the lesson, say so clearly.

LESSON CONTENT:
{lesson_context}

CONVERSATION HISTORY:
{history_text}

STUDENT QUESTION: {question}

Provide a clear, educational answer:
"""
    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/analyze-student', methods=['POST'])
def analyze_student():
    data         = request.get_json()
    student_data = data.get('student_data', {})

    if not student_data:
        return jsonify({"error": "student_data is required"}), 400

    prompt = f"""
You are an academic advisor AI. Analyze this student's performance data and return ONLY a JSON object:
{{
  "overall_assessment": "...",
  "strengths": ["..."],
  "areas_to_improve": ["..."],
  "recommendations": ["..."],
  "risk_flag": "none"
}}
risk_flag must be one of: "none", "low", "medium", "high"

STUDENT DATA:
{json.dumps(student_data, indent=2)}
"""
    try:
        response = model.generate_content(prompt)
        cleaned  = clean_json_response(response.text)
        return jsonify(json.loads(cleaned))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, port=port)
