import { ReflectionForm } from '../components/Reflection/ReflectionForm';

export const ReflectionPage = ({ entries, reflections, onUpdateReflections, onBack, onContinue }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Reflect on Your Findings</h2>
          <p className="text-gray-600">
            Your audit reveals two things: your current reality, and your automation opportunities.
            Take a moment to reflect on what the data shows.
          </p>
        </div>

        {/* Reflection Form */}
        <ReflectionForm
          entries={entries}
          reflections={reflections}
          onUpdate={onUpdateReflections}
          onContinue={onContinue}
        />

        {/* Back Button */}
        <div className="max-w-2xl mx-auto mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Review
          </button>
        </div>
      </div>
    </div>
  );
};
