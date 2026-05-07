import express, { Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// ── POST /api/lessons — Create a lesson inside a course ────────────
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, content, videoUrl, orderIndex } = req.body;

    if (!courseId || !title) {
      res.status(400).json({ error: 'courseId and title are required.' });
      return;
    }

    const parsedCourseId = parseInt(courseId);
    if (isNaN(parsedCourseId)) {
      res.status(400).json({ error: 'Invalid courseId.' });
      return;
    }

    // Verify the instructor owns this course before allowing lesson creation
    const course = await prisma.course.findUnique({ where: { id: parsedCourseId } });
    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }
    if (req.user!.role === 'instructor' && course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'You can only add lessons to your own courses.' });
      return;
    }

    const lesson = await prisma.lesson.create({
      data: { courseId: parsedCourseId, title, content, videoUrl, orderIndex: orderIndex || 0 }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Could not create lesson.' });
  }
});

// ── PATCH /api/lessons/:id/complete — Mark a lesson as completed ───
router.patch('/:id/complete', authenticate, authorize('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lessonId = parseInt(req.params.id as string);
    if (isNaN(lessonId)) {
      res.status(400).json({ error: 'Invalid lesson ID.' });
      return;
    }

    const progress = await prisma.progress.upsert({
      where: { studentId_lessonId: { studentId: req.user!.userId, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { studentId: req.user!.userId, lessonId, completed: true, completedAt: new Date() }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Could not update progress.' });
  }
});

export default router;
