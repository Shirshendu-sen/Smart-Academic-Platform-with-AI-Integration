'use client';
import { useQuery } from '@tanstack/react-query';
import api  from '@/lib/api';
import Link from 'next/link';

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn:  () => api.get('/courses').then(r => r.data)
  });

  if (isLoading) return <div className="p-8 text-center">Loading courses...</div>;
  if (error)     return <div className="p-8 text-center text-red-600">Failed to load courses.</div>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      {courses?.length === 0 && (
        <p className="text-gray-500">No courses published yet. Check back soon!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses?.map((course: any) => (
          <Link key={course._id} href={`/courses/${course._id}`}>
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer">
              <h2 className="font-bold text-lg mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <p className="text-xs text-indigo-600">By {course.instructor?.name}</p>
              <p className="text-xs text-gray-400 mt-1">{course._count?.lessons || 0} lessons</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
