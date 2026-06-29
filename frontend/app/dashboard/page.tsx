'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const { user, logout, restoreAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    restoreAuth();
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.push('/login');
  }, [router]);

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Welcome, {user.name}!</h1>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
          >
            Log Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <p className="text-gray-600">
            Logged in as <span className="font-semibold text-indigo-600">{user.email}</span> · Role:{' '}
            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-medium capitalize">
              {user.role}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/courses">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <h2 className="text-xl font-bold mb-2">📚 Browse Courses</h2>
              <p className="text-gray-600 text-sm">Explore all available courses and enroll.</p>
            </div>
          </Link>

          {user.role === 'instructor' && (
            <Link href="/instructor">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-bold mb-2">🎓 Instructor Panel</h2>
                <p className="text-gray-600 text-sm">Create and manage your courses and lessons.</p>
              </div>
            </Link>
          )}

          {user.role === 'admin' && (
            <Link href="/admin">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-bold mb-2">⚙️ Admin Portal</h2>
                <p className="text-gray-600 text-sm">Manage users and platform settings.</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
