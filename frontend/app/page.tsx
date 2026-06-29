import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700">SmartLMS</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
            Log In
          </Link>
          <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Learn Smarter with <span className="text-indigo-600">AI-Powered</span> Education
        </h2>
        <p className="text-xl text-gray-600 mb-10">
          AI-generated quizzes, instant doubt resolution, personalized progress analysis — all in one platform.
        </p>
        <Link href="/courses" className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-semibold hover:bg-indigo-700">
          Browse Courses →
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 pb-24">
        {[
          { title: '🤖 AI Quiz Generator', desc: 'Auto-generate MCQs from lecture notes in seconds.' },
          { title: '💬 AI Doubt Chatbot',  desc: 'Get instant answers grounded in your course material.' },
          { title: '📊 Progress Analyzer', desc: 'Personalized feedback and risk detection from your AI advisor.' }
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
