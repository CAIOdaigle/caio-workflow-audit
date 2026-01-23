import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Clock, Calendar, Lightbulb } from 'lucide-react';
import { getCategoryById } from '../../data/categories';
import { CategoryBadge } from '../CategoryGuide/CategoryReference';
import { getEntriesByDate, formatHours } from '../../utils/calculations';
import { ENTRY_CONSTRAINTS } from '../../constants/app';

const formatTimeDisplay = (time) => {
  const [hour, min] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
};

export const EntryList = ({ entries, onEdit, onDelete }) => {
  const groupedEntries = getEntriesByDate(entries);
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-[#0038ff]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to audit your workflow</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Track how you spent your time over the past {ENTRY_CONSTRAINTS.MAX_DAYS_BACK} days to discover where your hours really go.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" aria-hidden="true" />
            Tips for getting started
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>Open your calendar to reconstruct where your time went</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>Focus on blocks of 30+ minutes — don't sweat the small stuff</span>
            </li>
            <li className="flex items-start gap-2">
              <Edit2 size={14} className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>Be honest — this audit is for your insight, not anyone else's</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(date => {
        const dayEntries = groupedEntries[date];
        const dayTotal = dayEntries.reduce((sum, e) => sum + e.duration, 0);

        return (
          <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <span className="text-sm text-gray-500">{formatHours(dayTotal)}</span>
            </div>

            <ul className="divide-y divide-gray-100" role="list" aria-label="Time entries">
              {dayEntries.map((entry, index) => {
                const category = getCategoryById(entry.categoryId);
                return (
                  <li
                    key={entry.id}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors focus-within:bg-blue-50"
                    role="listitem"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm text-gray-500">
                            {formatTimeDisplay(entry.startTime)} - {formatTimeDisplay(entry.endTime)}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({formatHours(entry.duration)})
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 truncate">{entry.activity}</p>
                        {entry.notes && (
                          <p className="text-sm text-gray-500 mt-1 truncate">{entry.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <CategoryBadge category={category} size="sm" />
                        <div className="flex items-center gap-1" role="group" aria-label="Entry actions">
                          <button
                            onClick={() => onEdit(entry)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Edit entry (E)"
                            aria-label={`Edit ${entry.activity}`}
                            onKeyDown={(e) => {
                              if (e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                                onEdit(entry);
                              }
                            }}
                          >
                            <Edit2 size={16} className="text-gray-600" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Delete entry (D)"
                            aria-label={`Delete ${entry.activity}`}
                            onKeyDown={(e) => {
                              if (e.key === 'd' || e.key === 'D' || e.key === 'Delete') {
                                e.preventDefault();
                                onDelete(entry.id);
                              }
                            }}
                          >
                            <Trash2 size={16} className="text-gray-600 hover:text-red-600" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
