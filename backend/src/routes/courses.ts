import { Router, Response } from 'express';
import Course from '../models/Course';
import Lesson from '../models/Lesson';
import Enrollment from '../models/Enrollment';
import Progress from '../models/Progress';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/courses — list all published courses (no auth required)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructorId', 'name')
      .lean();

    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const lessonCount = await Lesson.countDocuments({ courseId: course._id });
        return { ...course, instructor: course.instructorId, _count: { lessons: lessonCount } };
      })
    );

    res.json(coursesWithCount);
  } catch {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id — get a single course with its lessons
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name')
      .lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const lessons = await Lesson.find({ courseId: req.params.id })
      .sort({ orderIndex: 1 })
      .lean();

    res.json({ ...course, instructor: course.instructorId, lessons });
  } catch {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses — create a course (instructors and admins only)
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const course = await Course.create({
      title,
      description,
      instructorId: req.user!.userId
    });
    res.status(201).json(course);
  } catch {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PATCH /api/courses/:id/publish
router.patch('/:id/publish', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isPublished: req.body.isPublished },
      { new: true }
    );
    res.json(course);
  } catch {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// POST /api/courses/:id/enroll — student enrolls in a course
router.post('/:id/enroll', authenticate, authorize('student'), async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await Enrollment.create({
      studentId: req.user!.userId,
      courseId:  req.params.id as string
    });
    res.status(201).json(enrollment);
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ error: 'Already enrolled' });
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// GET /api/courses/:id/progress
router.get('/:id/progress', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.id }).lean();
    const lessonIds = lessons.map(l => l._id);

    const completedCount = await Progress.countDocuments({
      studentId: req.user!.userId,
      lessonId:  { $in: lessonIds },
      completed: true
    });

    const enrollment = await Enrollment.findOne({
      studentId: req.user!.userId,
      courseId:  req.params.id
    }).lean();

    res.json({
      totalLessons:     lessons.length,
      completedLessons: completedCount,
      percentage:       lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0,
      isEnrolled:       !!enrollment
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
