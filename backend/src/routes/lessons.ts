import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// ── POST /api/lessons — Create a lesson inside a course ────────────
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, content, videoUrl, orderIndex } = req.body;

    if (!courseId || !title) {
      res.status(400).json({ error: 'courseId and title are required.' });
      return;
    }

    const lesson = await prisma.lesson.create({
      data: { courseId: parseInt(courseId), title, content, videoUrl, orderIndex: orderIndex || 0 }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Could not create lesson.' });
  }
});

// ── PATCH /api/lessons/:id/complete — Mark a lesson as completed ───
router.patch('/:id/complete', authenticate, authorize('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progress = await prisma.progress.upsert({
      where: { studentId_lessonId: { studentId: req.user!.userId, lessonId: parseInt(req.params.id) } },
      update: { completed: true, completedAt: new Date() },
      create: { studentId: req.user!.userId, lessonId: parseInt(req.params.id), completed: true, completedAt: new Date() }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Could not update progress.' });
  }
});

export default router;
