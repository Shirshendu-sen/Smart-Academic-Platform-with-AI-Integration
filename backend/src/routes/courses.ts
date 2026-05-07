import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// ── GET /api/courses — All published courses (public, no auth needed) ──
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const search = typeof req.query.search === 'string'
      ? req.query.search
      : Array.isArray(req.query.search)
        ? req.query.search[0] as string
        : undefined;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const where = search
      ? { isPublished: true, title: { contains: search, mode: 'insensitive' as const } }
      : { isPublished: true };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { lessons: true, enrollments: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    res.json({ courses, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error('[Get Courses Error]', error);
    res.status(500).json({ error: 'Could not fetch courses.' });
  }
});

// ── GET /api/courses/my/enrolled — All courses a student is enrolled in ──
// IMPORTANT: This route MUST be defined before /:id, otherwise "my" matches as :id
router.get('/my/enrolled', authenticateToken, authorize('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user!.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            _count: { select: { lessons: true } }
          }
        }
      }
    });

    // Compute progress percentage for each enrolled course
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = enrollment.course;

        const totalLessons = course._count.lessons;
        if (totalLessons === 0) {
          return { ...course, progress: 0 };
        }

        // Get lesson IDs for this course
        const lessons = await prisma.lesson.findMany({
          where: { courseId: course.id },
          select: { id: true }
        });

        const completedCount = await prisma.progress.count({
          where: {
            studentId,
            lessonId: { in: lessons.map(l => l.id) },
            completed: true
          }
        });

        return { ...course, progress: Math.round((completedCount / totalLessons) * 100) };
      })
    );

    res.json(coursesWithProgress);
  } catch (error: any) {
    console.error('[My Enrolled Error]', error);
    res.status(500).json({ error: 'Could not fetch enrolled courses.' });
  }
});

// ── GET /api/courses/:id — Single course with lessons ─────────────
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid course ID.' });
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, avatarUrl: true } },
        lessons: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true } }
      }
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    res.json(course);
  } catch (error: any) {
    res.status(500).json({ error: 'Could not fetch course.' });
  }
});

// ── POST /api/courses — Create course (instructors and admins only) ─
router.post('/', authenticateToken, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, thumbnailUrl } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Course title is required.' });
      return;
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnailUrl,
        instructorId: req.user!.id
      }
    });

    res.status(201).json(course);
  } catch (error: any) {
    console.error('[Create Course Error]', error);
    res.status(500).json({ error: 'Could not create course.' });
  }
});

// ── PATCH /api/courses/:id/publish — Toggle publish status ─────────
router.patch('/:id/publish', authenticateToken, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid course ID.' });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    // Instructors can only publish their own courses
    if (req.user!.role === 'instructor' && course.instructorId !== req.user!.id) {
      res.status(403).json({ error: 'You can only publish your own courses.' });
      return;
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { isPublished: !course.isPublished }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Could not update course.' });
  }
});

// ── POST /api/courses/:id/enroll — Student enrolls in a course ─────
router.post('/:id/enroll', authenticateToken, authorize('student'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = parseInt(req.params.id as string);
    if (isNaN(courseId)) {
      res.status(400).json({ error: 'Invalid course ID.' });
      return;
    }

    const studentId = req.user!.id;

    // Check the course exists and is published
    const course = await prisma.course.findFirst({
      where: { id: courseId, isPublished: true }
    });
    if (!course) {
      res.status(404).json({ error: 'Course not found or not yet published.' });
      return;
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } }
    });
    if (existing) {
      res.status(409).json({ error: 'You are already enrolled in this course.' });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId }
    });

    res.status(201).json({ message: 'Enrolled successfully!', enrollment });
  } catch (error: any) {
    console.error('[Enroll Error]', error);
    res.status(500).json({ error: 'Enrollment failed.' });
  }
});

// ── GET /api/courses/:id/progress — Student's progress in a course ──
router.get('/:id/progress', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = parseInt(req.params.id as string);
    if (isNaN(courseId)) {
      res.status(400).json({ error: 'Invalid course ID.' });
      return;
    }

    const studentId = req.user!.id;

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true }
    });

    if (lessons.length === 0) {
      res.json({ total: 0, completed: 0, percentage: 0 });
      return;
    }

    const completedCount = await prisma.progress.count({
      where: {
        studentId,
        lessonId: { in: lessons.map(l => l.id) },
        completed: true
      }
    });

    const percentage = Math.round((completedCount / lessons.length) * 100);
    res.json({ total: lessons.length, completed: completedCount, percentage });
  } catch (error: any) {
    res.status(500).json({ error: 'Could not fetch progress.' });
  }
});

export default router;
