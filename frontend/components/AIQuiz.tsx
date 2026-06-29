'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Question {
  question:       string;
  options:        string[];
  correct_answer: string;
  explanation:    string;
}

export default function AIQuiz({ lessonId, lessonContent, role }: {
  lessonId:      string;
  lessonContent: string;
  role:          'student' | 'instructor' | 'admin';
}) {
  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [selected,   setSelected]   = useState<Record<number, string>>({});
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [score,      setScore]      = useState(0);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-quiz', { lessonId, lecture_notes: lessonContent });
      setQuestions(res.data.questions);
      setSelected({});
      setSubmitted(false);
    } catch {
      alert('Failed to generate quiz. Make sure you are logged in as an instructor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lessons/${lessonId}`);
      if (res.data.quiz?.questions?.length > 0) {
        setQuestions(res.data.quiz.questions);
      } else {
        alert('No quiz available for this lesson yet. Ask your instructor to generate one first.');
      }
    } catch {
      alert('Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const correctCount = questions.filter((q, i) => selected[i] === q.correct_answer).length;
    setScore(correctCount);
    setSubmitted(true);
    try {
      await api.post(`/lessons/${lessonId}/quiz-attempt`, {
        answers: selected,
        score:   correctCount
      });
    } catch { /* Score display is more important than saving */ }
  };

  if (questions.length === 0) {
    return (
      <div className="mt-6 p-6 bg-indigo-50 rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-4">
          {role === 'student' ? '📝 Test Your Knowledge' : '🤖 Generate a Quiz for Students'}
        </h3>
        <button
          onClick={role === 'student' ? fetchQuiz : generateQuiz}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading
            ? '⏳ Loading...'
            : role === 'student' ? 'Load Quiz' : 'Generate AI Quiz'}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-bold">📝 AI-Generated Quiz</h3>
      {submitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-700">
            Score: {score}/{questions.length} ({Math.round(score / questions.length * 100)}%)
          </p>
        </div>
      )}
      {questions.map((q, i) => (
        <div key={i} className="p-5 bg-white border rounded-xl shadow-sm">
          <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => {
              let cls = 'w-full text-left px-4 py-2 rounded-lg border ';
              if (submitted) {
                if (opt === q.correct_answer)   cls += 'bg-green-100 border-green-400';
                else if (opt === selected[i])   cls += 'bg-red-100 border-red-400';
                else                            cls += 'border-gray-200';
              } else {
                cls += selected[i] === opt ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-50 border-gray-200';
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => !submitted && setSelected(p => ({ ...p, [i]: opt }))}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              💡 {q.explanation}
            </p>
          )}
        </div>
      ))}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selected).length < questions.length}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          Submit Answers
        </button>
      )}
      {submitted && (
        <button
          onClick={() => role === 'student' ? fetchQuiz() : generateQuiz()}
          className="w-full py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50"
        >
          🔄 {role === 'student' ? 'Reload Quiz' : 'Generate New Quiz'}
        </button>
      )}
    </div>
  );
}
