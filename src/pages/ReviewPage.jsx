import { CategoryBreakdown, QuickStats } from '../components/Dashboard/CategoryBreakdown';
import { CategoryPieChart, BenchmarkComparison, HighValueVsAutomatable } from '../components/Dashboard/Charts';
import { EntryList } from '../components/TimeEntry/EntryList';
import { getTotalHours, formatHours } from '../utils/calculations';
import { Button, Card } from '../components/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ReviewPage = ({ entries, onEdit, onDelete, onBack, onContinue }) => {
  const totalHours = getTotalHours(entries);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Review Your Data</h2>
          <p className="text-gray-600">
            You've logged <span className="font-semibold text-primary">{formatHours(totalHours)}</span> across{' '}
            <span className="font-semibold">{entries.length} entries</span>.
            Review your time distribution before moving to the reflection questions.
          </p>
        </Card>

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
        <Card padding="none" className="overflow-hidden mb-6">
          <details>
            <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
              View All Entries ({entries.length})
            </summary>
            <div className="border-t border-gray-100 p-4">
              <EntryList
                entries={entries}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </details>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={onBack}
            size="lg"
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back to Entry
          </Button>
          <Button
            onClick={onContinue}
            size="lg"
            className="gap-2"
          >
            Continue to Reflection
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
