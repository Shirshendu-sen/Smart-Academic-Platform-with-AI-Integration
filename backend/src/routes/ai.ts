import { Router, Response } from 'express';
import axios from 'axios';
import Lesson      from '../models/Lesson';
import Quiz        from '../models/Quiz';
import Enrollment  from '../models/Enrollment';
import Progress    from '../models/Progress';
import QuizAttempt from '../models/QuizAttempt';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router     = Router();
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:5001';
const AI_TIMEOUT = 25000;

// POST /api/ai/generate-quiz — instructor only
router.post('/generate-quiz', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId, lecture_notes } = req.body;
    if (!lessonId || !lecture_notes) {
      return res.status(400).json({ error: 'lessonId and lecture_notes are required' });
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/generate-quiz`,
      { lecture_notes },
      { timeout: AI_TIMEOUT }
    );
    const { questions } = aiResponse.data;

    const quiz = await Quiz.findOneAndUpdate(
      { lessonId },
      { questions },
      { upsert: true, new: true }
    );

    res.json(quiz);
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Failed to generate quiz';
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

// POST /api/ai/summarize — any logged-in user
router.post('/summarize', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    const aiResponse = await axios.post(
      `${AI_SERVICE}/summarize`,
      { content },
      { timeout: AI_TIMEOUT }
    );
    res.json(aiResponse.data);
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Summarization failed';
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

// POST /api/ai/chat — any logged-in user
router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { question, lessonId, history } = req.body;

    let lesson_context = '';
    if (lessonId) {
      const lesson = await Lesson.findById(lessonId).select('content title');
      lesson_context = lesson?.content || '';
    }

    const aiResponse = await axios.post(
      `${AI_SERVICE}/chat`,
      { question, lesson_context, history: history || [] },
      { timeout: AI_TIMEOUT }
    );
    res.json(aiResponse.data);
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Chat failed';
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

// POST /api/ai/analyze-student — any logged-in user (analyzes own data only)
router.post('/analyze-student', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user!.userId;

    const enrollments  = await Enrollment.find({ studentId }).lean();
    const progress     = await Progress.find({ studentId }).lean();
    const quizAttempts = await QuizAttempt.find({ studentId })
      .sort({ attemptedAt: -1 })
      .limit(20)
      .lean();

    const student_data = {
      totalEnrollments: enrollments.length,
      completedLessons: progress.filter(p => p.completed).length,
      quizAttempts:     quizAttempts.map(a => ({ score: a.score, totalQ: a.totalQ })),
      averageQuizScore: quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, a) => sum + (a.score / a.totalQ * 100), 0) / quizAttempts.length
          )
        : 0
    };

    const aiResponse = await axios.post(
      `${AI_SERVICE}/analyze-student`,
      { student_data },
      { timeout: AI_TIMEOUT }
    );
    res.json(aiResponse.data);
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Analysis failed';
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

export default router;
