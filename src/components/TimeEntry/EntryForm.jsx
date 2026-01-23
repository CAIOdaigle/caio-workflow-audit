import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';
import { X, Plus, Clock } from 'lucide-react';
import { categories } from '../../data/categories';
import { formatDuration } from '../../utils/calculations';
import { ENTRY_CONSTRAINTS, TIME_PICKER } from '../../constants/app';
import { Button, Card } from '../ui';

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

  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors";
  const errorInputStyles = "w-full px-3 py-2 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500";

  return (
    <Card as="form" onSubmit={handleSubmit} padding="none">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          {editingEntry ? 'Edit Time Block' : 'Add Time Block'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X size={18} className="text-gray-500" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* Date */}
        <div>
          <label htmlFor="entry-date" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            className={inputStyles}
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="entry-start-time" className="block text-sm font-medium text-gray-700 mb-1.5">
              Start Time <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="entry-start-time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              required
              aria-required="true"
              className={inputStyles}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="entry-end-time" className="block text-sm font-medium text-gray-700 mb-1.5">
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
              className={inputStyles}
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
          className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg ${
            isValidDuration
              ? 'bg-gray-50 text-gray-600'
              : 'bg-red-50 text-red-600'
          }`}
          role={isValidDuration ? 'status' : 'alert'}
        >
          <Clock size={16} aria-hidden="true" />
          {isValidDuration ? (
            <span>Duration: <strong>{duration} {duration === 1 ? 'hour' : 'hours'}</strong></span>
          ) : (
            <span>End time must be after start time</span>
          )}
        </div>

        {/* Activity */}
        <div>
          <label htmlFor="entry-activity" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            className={errors.activity ? errorInputStyles : inputStyles}
          />
          <div className="flex justify-between mt-1.5">
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
          <label htmlFor="entry-category" className="block text-sm font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="entry-category"
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', Number(e.target.value))}
            required
            aria-required="true"
            className={inputStyles}
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
          <label htmlFor="entry-notes" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            className={`${inputStyles} resize-none`}
          />
          <div className="flex justify-end mt-1.5">
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

      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-card">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!isValidDuration}
          className="gap-2"
        >
          <Plus size={18} aria-hidden="true" />
          {editingEntry ? 'Update Entry' : 'Add Entry'}
        </Button>
      </div>
    </Card>
  );
};
