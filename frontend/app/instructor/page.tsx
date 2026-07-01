'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AIChatbot from '@/components/AIChatbot';

export default function InstructorPage() {
  const { user, restoreAuth } = useAuthStore();
  const router       = useRouter();
  const queryClient  = useQueryClient();

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc,  setCourseDesc]  = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [viewingCourseId, setViewingCourseId] = useState('');
  const [activeLessonId, setActiveLessonId] = useState('');

  useEffect(() => { restoreAuth(); }, []);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.push('/login');
  }, [router]);

  const { data: courses } = useQuery({
    queryKey: ['my-courses'],
    queryFn:  () => api.get('/courses?instructor=me').then(r => r.data),
    enabled:  !!user
  });

  const { data: viewingCourse } = useQuery({
    queryKey: ['course-detail', viewingCourseId],
    queryFn:  () => api.get(`/courses/${viewingCourseId}`).then(r => r.data),
    enabled:  !!viewingCourseId
  });

  const createCourseMutation = useMutation({
    mutationFn: () => api.post('/courses', { title: courseTitle, description: courseDesc }),
    onSuccess: (res) => {
      setStatusMsg(`Course "${res.data.title}" created! Now publish it below.`);
      setCourseTitle('');
      setCourseDesc('');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (err: any) => setStatusMsg(err.response?.data?.error || 'Failed to create course')
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/courses/${id}/publish`, { isPublished: true }),
    onSuccess: () => {
      setStatusMsg('Course published! Students can now see it.');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    }
  });

  const createLessonMutation = useMutation({
    mutationFn: () => api.post('/lessons', {
      courseId: selectedCourseId,
      title:    lessonTitle,
      content:  lessonContent
    }),
    onSuccess: () => {
      setStatusMsg('Lesson created!');
      setLessonTitle('');
      setLessonContent('');
      queryClient.invalidateQueries({ queryKey: ['course-detail', selectedCourseId] });
    },
    onError: (err: any) => setStatusMsg(err.response?.data?.error || 'Failed to create lesson')
  });

  if (!user) return <div className="p-8 text-center">Loading...</div>;
  if (user.role !== 'instructor' && user.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access denied — instructors only.</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <nav className="flex items-center gap-4 mb-6 text-sm">
        <Link href="/dashboard" className="text-indigo-600 hover:underline">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <Link href="/courses" className="text-indigo-600 hover:underline">Courses</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">Instructor Panel</span>
      </nav>

      <h1 className="text-3xl font-bold text-indigo-700 mb-2">Instructor Panel</h1>
      <p className="text-gray-500 mb-8">Create courses and lessons here.</p>

      {statusMsg && (
        <div className={`mb-6 p-4 border rounded-xl text-sm ${
          statusMsg.startsWith('Failed') || statusMsg.startsWith('Error')
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {statusMsg}
          <button onClick={() => setStatusMsg('')} className="ml-3 text-gray-400 hover:text-gray-600">x</button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Create a New Course</h2>
        <input
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
          placeholder="Course title (required)"
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        <textarea
          value={courseDesc}
          onChange={e => setCourseDesc(e.target.value)}
          placeholder="Course description (optional)"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        <button
          onClick={() => createCourseMutation.mutate()}
          disabled={!courseTitle || createCourseMutation.isPending}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
        </button>
      </div>

      {courses && courses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Courses</h2>
          {courses.map((c: any) => (
            <div key={c._id} className="flex justify-between items-center py-3 border-b last:border-0">
              <button
                onClick={() => { setViewingCourseId(c._id); setActiveLessonId(''); }}
                className="font-medium text-left text-indigo-600 hover:underline"
              >
                {c.title}
              </button>
              <div className="flex items-center gap-2">
                {c.isPublished ? (
                  <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">Published</span>
                ) : (
                  <button
                    onClick={() => publishMutation.mutate(c._id)}
                    className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingCourse && viewingCourse.lessons?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Lessons in &ldquo;{viewingCourse.title}&rdquo;</h2>
          <div className="space-y-2 mb-4">
            {viewingCourse.lessons.map((lesson: any, idx: number) => (
              <button
                key={lesson._id}
                onClick={() => setActiveLessonId(lesson._id === activeLessonId ? '' : lesson._id)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                  activeLessonId === lesson._id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white hover:bg-indigo-50 border-gray-200'
                }`}
              >
                {idx + 1}. {lesson.title}
              </button>
            ))}
          </div>
          {activeLessonId && (() => {
            const lesson = viewingCourse.lessons.find((l: any) => l._id === activeLessonId);
            if (!lesson) return null;
            return (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">{lesson.title}</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{lesson.content || 'No content yet.'}</p>
              </div>
            );
          })()}
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Add a Lesson to a Course</h2>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">— Select a course —</option>
            {courses.map((c: any) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <input
            value={lessonTitle}
            onChange={e => setLessonTitle(e.target.value)}
            placeholder="Lesson title (required)"
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <textarea
            value={lessonContent}
            onChange={e => setLessonContent(e.target.value)}
            placeholder="Lesson content — the AI uses this to generate quizzes and answer questions"
            rows={6}
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <button
            onClick={() => createLessonMutation.mutate()}
            disabled={!selectedCourseId || !lessonTitle || createLessonMutation.isPending}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {createLessonMutation.isPending ? 'Adding...' : 'Add Lesson'}
          </button>
        </div>
      )}

      {activeLessonId && <AIChatbot lessonId={activeLessonId} />}
    </main>
  );
}
