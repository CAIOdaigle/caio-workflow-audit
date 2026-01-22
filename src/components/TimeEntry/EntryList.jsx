import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { categories, getCategoryById } from '../../data/categories';
import { CategoryBadge } from '../CategoryGuide/CategoryReference';
import { getEntriesByDate, formatHours } from '../../utils/calculations';

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
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries yet</h3>
        <p className="text-gray-500">
          Start by adding time blocks from your last two weeks.
          <br />
          Pull up your calendar to help reconstruct where your time went.
        </p>
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

            <ul className="divide-y divide-gray-100">
              {dayEntries.map(entry => {
                const category = getCategoryById(entry.categoryId);
                return (
                  <li key={entry.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
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
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(entry)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 size={16} className="text-gray-400" />
                          </button>
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
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
