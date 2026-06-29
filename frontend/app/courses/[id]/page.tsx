'use client';
import { useParams }  from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState }  from 'react';
import { useRouter }  from 'next/navigation';
import api            from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import AIQuiz         from '@/components/AIQuiz';
import AIChatbot      from '@/components/AIChatbot';
import ProgressBar    from '@/components/ProgressBar';

export default function CourseDetailPage() {
  const { id }         = useParams();
  const { user, restoreAuth } = useAuthStore();
  const router         = useRouter();
  const queryClient    = useQueryClient();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => { restoreAuth(); }, []);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn:  () => api.get(`/courses/${id}`).then(r => r.data)
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', id],
    queryFn:  () => api.get(`/courses/${id}/progress`).then(r => r.data),
    enabled:  !!user
  });

  const enrollMutation = useMutation({
    mutationFn: () => api.post(`/courses/${id}/enroll`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['progress', id] })
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => api.post(`/lessons/${lessonId}/complete`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['progress', id] })
  });

  if (isLoading) return <div className="p-8 text-center">Loading course...</div>;
  if (!course)   return <div className="p-8 text-center text-red-600">Course not found.</div>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        <p className="text-sm text-indigo-600 mt-1">By {course.instructor?.name}</p>
      </div>

      {user?.role === 'student' && progress && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
          <ProgressBar
            percentage={progress.percentage}
            label={`Progress: ${progress.completedLessons}/${progress.totalLessons} lessons`}
          />
          {!progress.isEnrolled && (
            <button
              onClick={() => enrollMutation.mutate()}
              disabled={enrollMutation.isPending}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll in this Course'}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="font-bold text-lg mb-3">Lessons</h2>
          <div className="space-y-2">
            {course.lessons?.map((lesson: any, idx: number) => (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                  activeLesson?._id === lesson._id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white hover:bg-indigo-50 border-gray-200'
                }`}
              >
                {idx + 1}. {lesson.title}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {activeLesson ? (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">{activeLesson.title}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                {activeLesson.content || 'No content yet.'}
              </p>

              {user?.role === 'student' && (
                <button
                  onClick={() => completeMutation.mutate(activeLesson._id)}
                  disabled={completeMutation.isPending}
                  className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {completeMutation.isPending ? 'Saving...' : '✅ Mark as Complete'}
                </button>
              )}

              {user && (
                <AIQuiz
                  lessonId={activeLesson._id}
                  lessonContent={activeLesson.content || ''}
                  role={user.role}
                />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-sm text-center text-gray-400">
              Select a lesson from the list to start reading.
            </div>
          )}
        </div>
      </div>

      {user && activeLesson && <AIChatbot lessonId={activeLesson._id} />}
    </main>
  );
}
