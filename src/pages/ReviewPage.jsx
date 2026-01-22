import { CategoryBreakdown, QuickStats } from '../components/Dashboard/CategoryBreakdown';
import { CategoryPieChart, BenchmarkComparison, HighValueVsAutomatable } from '../components/Dashboard/Charts';
import { EntryList } from '../components/TimeEntry/EntryList';
import { getTotalHours, formatHours } from '../utils/calculations';

export const ReviewPage = ({ entries, onEdit, onDelete, onBack, onContinue }) => {
  const totalHours = getTotalHours(entries);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Review Your Data</h2>
          <p className="text-gray-600">
            You've logged <span className="font-semibold">{formatHours(totalHours)}</span> across{' '}
            <span className="font-semibold">{entries.length} entries</span>.
            Review your time distribution before moving to the reflection questions.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <QuickStats entries={entries} />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <CategoryPieChart entries={entries} />
          <BenchmarkComparison entries={entries} />
        </div>

        {/* Value Analysis */}
        <div className="mb-6">
          <HighValueVsAutomatable entries={entries} />
        </div>

        {/* Category Breakdown */}
        <div className="mb-6">
          <CategoryBreakdown entries={entries} />
        </div>

        {/* Entry List (collapsed by default) */}
        <details className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
            View All Entries ({entries.length})
          </summary>
          <div className="border-t border-gray-200 p-4">
            <EntryList
              entries={entries}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </details>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Entry
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-[#0038ff] text-white font-medium rounded-lg hover:bg-[#0030dd] transition-colors"
          >
            Continue to Reflection
          </button>
        </div>
      </div>
    </div>
  );
};
