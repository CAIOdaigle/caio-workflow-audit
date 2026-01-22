import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays } from 'date-fns';
import { X, Plus, Clock } from 'lucide-react';
import { categories } from '../../data/categories';
import { formatDuration } from '../../utils/calculations';

const timeOptions = [];
for (let hour = 6; hour <= 22; hour++) {
  for (let min = 0; min < 60; min += 15) {
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
  const twoWeeksAgo = format(subDays(new Date(), 14), 'yyyy-MM-dd');

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
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            min={twoWeeksAgo}
            max={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <select
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <select
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
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
        <div className={`flex items-center gap-2 text-sm ${isValidDuration ? 'text-gray-600' : 'text-red-600'}`}>
          <Clock size={16} />
          {isValidDuration ? (
            <span>Duration: {duration} {duration === 1 ? 'hour' : 'hours'}</span>
          ) : (
            <span>End time must be after start time</span>
          )}
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Description
          </label>
          <input
            type="text"
            value={formData.activity}
            onChange={(e) => handleChange('activity', e.target.value)}
            placeholder="e.g., Client strategy call with Acme Corp"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.activity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.activity && (
            <p className="mt-1 text-sm text-red-600">{errors.activity}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', Number(e.target.value))}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any additional context..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isValidDuration}
          className="px-4 py-2 bg-[#0038ff] text-white rounded-lg hover:bg-[#0030dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={18} />
          {editingEntry ? 'Update Entry' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
};
