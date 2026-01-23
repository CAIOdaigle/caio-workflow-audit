import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';
import { X, Plus, Clock } from 'lucide-react';
import { categories } from '../../data/categories';
import { formatDuration } from '../../utils/calculations';
import { ENTRY_CONSTRAINTS, TIME_PICKER } from '../../constants/app';

const timeOptions = [];
for (let hour = TIME_PICKER.START_HOUR; hour <= TIME_PICKER.END_HOUR; hour++) {
  for (let min = 0; min < 60; min += TIME_PICKER.INCREMENT_MINUTES) {
    const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    timeOptions.push(time);
  }
}

const formatTimeDisplay = (time) => {
  const [hour, min] = time.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
};

export const EntryForm = ({ onSubmit, onCancel, editingEntry = null }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const minDate = format(subDays(new Date(), ENTRY_CONSTRAINTS.MAX_DAYS_BACK), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    date: editingEntry?.date || today,
    startTime: editingEntry?.startTime || '09:00',
    endTime: editingEntry?.endTime || '10:00',
    activity: editingEntry?.activity || '',
    categoryId: editingEntry?.categoryId || 1,
    notes: editingEntry?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const duration = formatDuration(formData.startTime, formData.endTime);
  const isValidDuration = duration > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.activity.trim()) {
      newErrors.activity = 'Activity description is required';
    }
    if (formData.activity.length > ENTRY_CONSTRAINTS.MAX_ACTIVITY_LENGTH) {
      newErrors.activity = `Activity description must be less than ${ENTRY_CONSTRAINTS.MAX_ACTIVITY_LENGTH} characters`;
    }
    if (!isValidDuration) {
      newErrors.time = 'End time must be after start time';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const entry = {
      id: editingEntry?.id || uuidv4(),
      ...formData,
      duration,
      createdAt: editingEntry?.createdAt || new Date().toISOString()
    };

    onSubmit(entry);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {editingEntry ? 'Edit Time Block' : 'Add Time Block'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Close form"
          >
            <X size={18} className="text-gray-600" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Date */}
        <div>
          <label htmlFor="entry-date" className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="entry-date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={minDate}
            max={today}
            required
            aria-required="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="entry-start-time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="entry-start-time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              required
              aria-required="true"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="entry-end-time" className="block text-sm font-medium text-gray-700 mb-1">
              End Time <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="entry-end-time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              required
              aria-required="true"
              aria-invalid={!isValidDuration}
              aria-describedby={!isValidDuration ? 'time-error' : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration Display */}
        <div
          id="time-error"
          className={`flex items-center gap-2 text-sm ${isValidDuration ? 'text-gray-600' : 'text-red-600'}`}
          role={isValidDuration ? 'status' : 'alert'}
        >
          <Clock size={16} aria-hidden="true" />
          {isValidDuration ? (
            <span>Duration: {duration} {duration === 1 ? 'hour' : 'hours'}</span>
          ) : (
            <span>End time must be after start time</span>
          )}
        </div>

        {/* Activity */}
        <div>
          <label htmlFor="entry-activity" className="block text-sm font-medium text-gray-700 mb-1">
            Activity Description <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="entry-activity"
            type="text"
            value={formData.activity}
            onChange={(e) => handleChange('activity', e.target.value)}
            placeholder="e.g., Client strategy call with Acme Corp"
            required
            aria-required="true"
            aria-invalid={!!errors.activity}
            aria-describedby={errors.activity ? 'activity-error' : 'activity-count'}
            maxLength={ENTRY_CONSTRAINTS.MAX_ACTIVITY_LENGTH}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.activity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.activity ? (
              <p id="activity-error" className="text-sm text-red-600" role="alert">
                {errors.activity}
              </p>
            ) : (
              <span />
            )}
            <span
              id="activity-count"
              className={`text-xs ${
                formData.activity.length > ENTRY_CONSTRAINTS.MAX_ACTIVITY_LENGTH * 0.9
                  ? 'text-amber-600'
                  : 'text-gray-400'
              }`}
              aria-live="polite"
            >
              {formData.activity.length}/{ENTRY_CONSTRAINTS.MAX_ACTIVITY_LENGTH}
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="entry-category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="entry-category"
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', Number(e.target.value))}
            required
            aria-required="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.id}. {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="entry-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="entry-notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any additional context..."
            rows={2}
            maxLength={ENTRY_CONSTRAINTS.MAX_NOTES_LENGTH}
            aria-describedby="notes-count"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="flex justify-end mt-1">
            <span
              id="notes-count"
              className={`text-xs ${
                formData.notes.length > ENTRY_CONSTRAINTS.MAX_NOTES_LENGTH * 0.9
                  ? 'text-amber-600'
                  : 'text-gray-400'
              }`}
              aria-live="polite"
            >
              {formData.notes.length}/{ENTRY_CONSTRAINTS.MAX_NOTES_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isValidDuration}
          className="px-4 py-2 bg-[#0038ff] text-white rounded-lg hover:bg-[#0030dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} aria-hidden="true" />
          {editingEntry ? 'Update Entry' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
};
