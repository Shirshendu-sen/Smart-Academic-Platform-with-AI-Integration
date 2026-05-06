import express, { Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';  // FIX: was missing in original
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();  // FIX: prisma was used but never instantiated
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// Helper: forward request to AI service with timeout and error handling
async function callAI(endpoint: string, body: object) {
  const response = await axios.post(`${AI_URL}${endpoint}`, body, {
    timeout: 25000,  // 25 second timeout (Gemini can be slow on first call)
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}

// ── POST /api/ai/generate-quiz ──────────────────────────────────
router.post('/generate-quiz', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId, content } = req.body;

    if (!lessonId || !content) {
      res.status(400).json({ error: 'lessonId and content are required.' });
      return;
    }

    // Check if a quiz already exists for this lesson
    const existingQuiz = await prisma.quiz.findUnique({
      where: { lessonId: parseInt(lessonId) }
    });

    if (existingQuiz) {
      // Return the existing quiz instead of generating a new one (saves API calls)
      res.json(existingQuiz);
      return;
    }

    // Call AI service to generate questions
    const aiResult = await callAI('/generate-quiz', { content });

    // Save generated quiz to DB so we don't regenerate it every time
    const quiz = await prisma.quiz.create({
      data: {
        lessonId: parseInt(lessonId),
        questions: aiResult.questions
      }
    });

    res.json(quiz);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[AI Quiz Error]', error.response?.data || error.message);
      res.status(503).json({ error: 'AI service is unavailable. Please try again.' });
    } else {
      console.error('[Generate Quiz Error]', error);
      res.status(500).json({ error: 'Could not generate quiz.' });
    }
  }
});

// ── POST /api/ai/submit-quiz ─────────────────────────────────────
router.post('/submit-quiz', authenticate, authorize('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quizId, answers } = req.body;
    // answers: { "0": "Option A", "1": "Option C", ... }

    const quiz = await prisma.quiz.findUnique({ where: { id: parseInt(quizId) } });
    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found.' });
      return;
    }

    const questions = quiz.questions as Array<{
      question: string; options: string[];
      correct_answer: string; explanation: string;
    }>;

    // Calculate score
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i.toString()] === q.correct_answer) score++;
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: parseInt(quizId),
        studentId: req.user!.userId,
        score,
        totalQ: questions.length,
        answers
      }
    });

    res.json({ attempt, score, total: questions.length, percentage: Math.round((score / questions.length) * 100) });
  } catch (error) {
    console.error('[Submit Quiz Error]', error);
    res.status(500).json({ error: 'Could not submit quiz.' });
  }
});

// ── POST /api/ai/summarize ────────────────────────────────────────
router.post('/summarize', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'content is required.' });
      return;
    }
    const result = await callAI('/summarize', { content });
    res.json(result);
  } catch (error) {
    console.error('[Summarize Error]', error);
    res.status(503).json({ error: 'AI service unavailable. Please try again.' });
  }
});

// ── POST /api/ai/chat ─────────────────────────────────────────────
router.post('/chat', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { question, context, history } = req.body;
    if (!question) {
      res.status(400).json({ error: 'question is required.' });
      return;
    }
    const result = await callAI('/chat', { question, context: context || '', history: history || [] });
    res.json(result);
  } catch (error) {
    console.error('[Chat Error]', error);
    res.status(503).json({ error: 'AI service unavailable. Please try again.' });
  }
});

// ── POST /api/ai/analyze-student ─────────────────────────────────
router.post('/analyze-student', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.userId;

    // Gather real student data from the database
    const [totalLessons, completedLessons, quizAttempts] = await Promise.all([
      prisma.lesson.count(),
      prisma.progress.count({ where: { studentId, completed: true } }),
      prisma.quizAttempt.findMany({
        where: { studentId },
        orderBy: { attemptedAt: 'desc' },
        take: 10
      })
    ]);

    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + (a.score / a.totalQ * 100), 0) / quizAttempts.length)
      : 0;

    const lastAttempt = quizAttempts[0]?.attemptedAt;
    const daysInactive = lastAttempt
      ? Math.floor((Date.now() - new Date(lastAttempt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const result = await callAI('/analyze-student', {
      student_data: {
        completion: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        avg_score: avgScore,
        lessons_completed: completedLessons,
        days_inactive: daysInactive
      }
    });

    res.json(result);
  } catch (error) {
    console.error('[Analyze Student Error]', error);
    res.status(503).json({ error: 'AI service unavailable. Please try again.' });
  }
});

export default router;
