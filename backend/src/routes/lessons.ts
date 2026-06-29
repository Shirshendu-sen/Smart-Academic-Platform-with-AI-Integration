import { Router, Response } from 'express';
import Lesson from '../models/Lesson';
import Quiz from '../models/Quiz';
import QuizAttempt from '../models/QuizAttempt';
import Progress from '../models/Progress';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/lessons — create a lesson (instructors only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, content, videoUrl, orderIndex } = req.body;
    if (!courseId || !title) return res.status(400).json({ error: 'courseId and title are required' });

    const lesson = await Lesson.create({ courseId, title, content, videoUrl, orderIndex: orderIndex || 0 });
    res.status(201).json(lesson);
  } catch {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// GET /api/lessons/:id — get a lesson with its quiz
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).lean();
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const quiz = await Quiz.findOne({ lessonId: req.params.id }).lean();
    res.json({ ...lesson, quiz });
  } catch {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// POST /api/lessons/:id/complete — student marks lesson done
router.post('/:id/complete', authenticate, authorize('student'), async (req: AuthRequest, res: Response) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { studentId: req.user!.userId, lessonId: req.params.id },
      { completed: true, completedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch {
    res.status(500).json({ error: 'Failed to mark complete' });
  }
});

// POST /api/lessons/:id/quiz-attempt — student submits quiz answers
router.post('/:id/quiz-attempt', authenticate, authorize('student'), async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.id });
    if (!quiz) return res.status(404).json({ error: 'No quiz for this lesson' });

    const { answers, score } = req.body;
    const attempt = await QuizAttempt.create({
      quizId:    quiz._id,
      studentId: req.user!.userId,
      score,
      totalQ:    quiz.questions.length,
      answers
    });
    res.status(201).json(attempt);
  } catch {
    res.status(500).json({ error: 'Failed to save quiz attempt' });
  }
});

export default router;
