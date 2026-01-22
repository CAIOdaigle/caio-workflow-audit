import { SummaryReport } from '../components/Export/SummaryReport';

export const SummaryPage = ({ entries, reflections, onComplete, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SummaryReport
          entries={entries}
          reflections={reflections}
          onComplete={onComplete}
        />

        {/* Back Button */}
        <div className="max-w-4xl mx-auto mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Reflection
          </button>
        </div>
      </div>
    </div>
  );
};
