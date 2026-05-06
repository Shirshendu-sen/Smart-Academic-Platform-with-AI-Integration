'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: number; title: string; description: string;
  thumbnailUrl?: string; instructor: { name: string };
  progress?: number; _count: { lessons: number };
}

export default function DashboardPage() {
  const { data: courses = [], isLoading, error } = useQuery<Course[]>({
    queryKey: ['my-courses'],
    queryFn: () => api.get('/courses/my/enrolled').then(r => r.data)
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64" />
      ))}
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500">
      Failed to load courses. Please refresh the page.
    </div>
  );

  if (courses.length === 0) return (
    <div className="p-6 text-center">
      <p className="text-gray-500 mb-4">{"You haven't enrolled in any courses yet."}</p>
      <Link href="/courses" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Browse Courses
      </Link>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {course.thumbnailUrl
                ? <Image src={course.thumbnailUrl} alt={course.title} width={500} height={300} className="w-full h-full object-cover" />
                : <span className="text-white text-4xl">📚</span>
              }
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-1 line-clamp-2">{course.title}</h3>
              <p className="text-gray-500 text-sm mb-1">by {course.instructor.name}</p>
              <p className="text-gray-400 text-xs mb-3">{course._count.lessons} lessons</p>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{course.progress ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress ?? 0}%` }}
                  />
                </div>
              </div>

              <Link
                href={`/courses/${course.id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                {(course.progress ?? 0) > 0 ? 'Continue Learning' : 'Start Course'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
