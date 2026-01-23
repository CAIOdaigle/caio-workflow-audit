import { useState } from 'react';
import { Plus, HelpCircle, Trash2, ArrowRight } from 'lucide-react';
import { EntryForm } from '../components/TimeEntry/EntryForm';
import { EntryList } from '../components/TimeEntry/EntryList';
import { CategoryBreakdown, QuickStats } from '../components/Dashboard/CategoryBreakdown';
import { CategoryPieChart } from '../components/Dashboard/Charts';
import { CategoryReference } from '../components/CategoryGuide/CategoryReference';
import { getTotalHours, formatHours } from '../utils/calculations';
import { TARGET_HOURS, MIN_ENTRIES_FOR_REVIEW, MIN_HOURS_FOR_INSIGHTS } from '../constants/app';
import { Button, Card } from '../components/ui';

export const TimeEntryPage = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onClearAll,
  onContinue
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalHours = getTotalHours(entries);
  const progress = Math.min((totalHours / TARGET_HOURS) * 100, 100);

  const handleSubmit = (entry) => {
    if (editingEntry) {
      onUpdateEntry(entry.id, entry);
    } else {
      onAddEntry(entry);
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Progress Bar */}
        <Card padding="sm" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatHours(totalHours)}
              </span>
              <span className="text-sm text-gray-500">logged</span>
            </div>
            <span className="text-sm text-gray-500">
              Target: ~{TARGET_HOURS} hrs (two weeks)
            </span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            {/* Progress percentage label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          {totalHours >= MIN_HOURS_FOR_INSIGHTS && (
            <p className="text-sm text-green-600 mt-3 font-medium">
              You have enough data for meaningful insights. Feel free to continue to the review step.
            </p>
          )}
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Entry Form & List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() => {
                  setEditingEntry(null);
                  setShowForm(true);
                }}
                className="gap-2"
              >
                <Plus size={18} />
                Add Time Block
              </Button>

              <div className="flex items-center gap-2">
                {entries.length > 0 && (
                  <Button
                    variant="danger"
                    onClick={() => setShowClearConfirm(true)}
                    className="gap-2"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setShowGuide(true)}
                  className="gap-2"
                >
                  <HelpCircle size={18} />
                  Category Guide
                </Button>
              </div>
            </div>

            {/* Entry Form */}
            {showForm && (
              <EntryForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                editingEntry={editingEntry}
              />
            )}

            {/* Entry List */}
            <EntryList
              entries={entries}
              onEdit={handleEdit}
              onDelete={onDeleteEntry}
            />
          </div>

          {/* Right Column - Dashboard */}
          <div className="space-y-6">
            <QuickStats entries={entries} />
            <CategoryPieChart entries={entries} />
            <CategoryBreakdown entries={entries} />

            {entries.length >= MIN_ENTRIES_FOR_REVIEW && (
              <Button
                onClick={onContinue}
                size="lg"
                className="w-full gap-2"
              >
                Continue to Review
                <ArrowRight size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category Guide Sidebar */}
      <CategoryReference isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-dialog-title"
          aria-describedby="clear-dialog-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowClearConfirm(false);
            }
          }}
        >
          <Card className="max-w-md w-full" role="document">
            <h3 id="clear-dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
              Clear All Entries?
            </h3>
            <p id="clear-dialog-description" className="text-gray-600 mb-6">
              This will delete all {entries.length} time entries. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Clear All
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
