export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Tailwind Test</h1>
        <p className="text-gray-600 mb-6">If you can see this styled, Tailwind works!</p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Click Me
        </button>
      </div>
    </div>
  );
}
