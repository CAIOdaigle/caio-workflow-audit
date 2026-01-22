import { useState } from 'react';
import { Plus, HelpCircle, Trash2 } from 'lucide-react';
import { EntryForm } from '../components/TimeEntry/EntryForm';
import { EntryList } from '../components/TimeEntry/EntryList';
import { CategoryBreakdown, QuickStats } from '../components/Dashboard/CategoryBreakdown';
import { CategoryPieChart } from '../components/Dashboard/Charts';
import { CategoryReference } from '../components/CategoryGuide/CategoryReference';
import { getTotalHours, formatHours } from '../utils/calculations';

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
  const targetHours = 80; // Two weeks of full-time work
  const progress = Math.min((totalHours / targetHours) * 100, 100);

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
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {formatHours(totalHours)} logged
            </span>
            <span className="text-sm text-gray-500">
              Target: ~{targetHours} hrs (two weeks)
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0038ff] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {totalHours >= 20 && (
            <p className="text-xs text-green-600 mt-2">
              You have enough data for meaningful insights. Feel free to continue to the review step.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Entry Form & List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingEntry(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0038ff] text-white rounded-lg hover:bg-[#0030dd] transition-colors"
              >
                <Plus size={18} />
                Add Time Block
              </button>

              <div className="flex items-center gap-2">
                {entries.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowGuide(true)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HelpCircle size={18} />
                  Category Guide
                </button>
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

            {entries.length >= 5 && (
              <button
                onClick={onContinue}
                className="w-full px-4 py-3 bg-[#0038ff] text-white font-medium rounded-lg hover:bg-[#0030dd] transition-colors"
              >
                Continue to Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Guide Sidebar */}
      <CategoryReference isOpen={showGuide} onClose={() => setShowGuide(false)} />

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear All Entries?</h3>
            <p className="text-gray-600 mb-6">
              This will delete all {entries.length} time entries. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
