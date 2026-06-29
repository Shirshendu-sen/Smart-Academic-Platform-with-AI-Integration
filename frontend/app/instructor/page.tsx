'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

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

  useEffect(() => { restoreAuth(); }, []);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.push('/login');
  }, [router]);

  const { data: courses } = useQuery({
    queryKey: ['my-courses'],
    queryFn:  () => api.get('/courses').then(r => r.data),
    enabled:  !!user
  });

  const createCourseMutation = useMutation({
    mutationFn: () => api.post('/courses', { title: courseTitle, description: courseDesc }),
    onSuccess: (res) => {
      setStatusMsg(`✅ Course "${res.data.title}" created! Now publish it below.`);
      setCourseTitle('');
      setCourseDesc('');
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
    },
    onError: (err: any) => setStatusMsg(`❌ ${err.response?.data?.error || 'Failed to create course'}`)
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/courses/${id}/publish`, { isPublished: true }),
    onSuccess: () => {
      setStatusMsg('✅ Course published! Students can now see it.');
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
      setStatusMsg('✅ Lesson created!');
      setLessonTitle('');
      setLessonContent('');
    },
    onError: (err: any) => setStatusMsg(`❌ ${err.response?.data?.error || 'Failed to create lesson'}`)
  });

  if (!user) return <div className="p-8 text-center">Loading...</div>;
  if (user.role !== 'instructor' && user.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Access denied — instructors only.</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">🎓 Instructor Panel</h1>
      <p className="text-gray-500 mb-8">Create courses and lessons here.</p>

      {statusMsg && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-sm">{statusMsg}</div>
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
              <span className="font-medium">{c.title}</span>
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
          ))}
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
    </main>
  );
}
