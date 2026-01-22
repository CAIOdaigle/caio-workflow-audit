import { categories } from '../data/categories';

// Category ID constants to avoid magic numbers
export const CATEGORY_IDS = {
  CLIENT_ADVISORY: 1,
  PILOT_MANAGEMENT: 2,
  RESEARCH_EVALUATION: 3,
  GOVERNANCE_DOCUMENTATION: 4,
  COMMUNICATION: 5,
  ADMINISTRATION: 6
};

// High-value category IDs (work clients pay for)
export const HIGH_VALUE_CATEGORY_IDS = [CATEGORY_IDS.CLIENT_ADVISORY, CATEGORY_IDS.PILOT_MANAGEMENT];

// Automatable category IDs (work AI can assist with)
export const AUTOMATABLE_CATEGORY_IDS = [CATEGORY_IDS.COMMUNICATION, CATEGORY_IDS.ADMINISTRATION];

export const calculateCategoryTotals = (entries) => {
  const totals = {};

  // Initialize all categories with 0
  categories.forEach(cat => {
    totals[cat.id] = 0;
  });

  // Sum up hours for each category
  entries.forEach(entry => {
    if (totals[entry.categoryId] !== undefined) {
      totals[entry.categoryId] += entry.duration;
    }
  });

  return totals;
};

export const calculateCategoryPercentages = (entries) => {
  const totals = calculateCategoryTotals(entries);
  const totalHours = Object.values(totals).reduce((sum, hours) => sum + hours, 0);

  if (totalHours === 0) {
    const percentages = {};
    categories.forEach(cat => {
      percentages[cat.id] = 0;
    });
    return percentages;
  }

  const percentages = {};
  categories.forEach(cat => {
    percentages[cat.id] = Math.round((totals[cat.id] / totalHours) * 100);
  });

  return percentages;
};

export const getTotalHours = (entries) => {
  return entries.reduce((sum, entry) => sum + entry.duration, 0);
};

export const getHighValuePercentage = (entries) => {
  const totals = calculateCategoryTotals(entries);
  const totalHours = getTotalHours(entries);

  if (totalHours === 0) return 0;

  // High-value categories: Advisory and Pilot Management
  const highValueHours = HIGH_VALUE_CATEGORY_IDS.reduce((sum, id) => sum + (totals[id] || 0), 0);
  return Math.round((highValueHours / totalHours) * 100);
};

export const getAutomatablePercentage = (entries) => {
  const totals = calculateCategoryTotals(entries);
  const totalHours = getTotalHours(entries);

  if (totalHours === 0) return 0;

  // Automatable categories: Communication and Administration
  const automatableHours = AUTOMATABLE_CATEGORY_IDS.reduce((sum, id) => sum + (totals[id] || 0), 0);
  return Math.round((automatableHours / totalHours) * 100);
};

export const formatHours = (hours) => {
  if (hours === 0) return '0 hrs';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return '1 hr';
  return `${hours.toFixed(1)} hrs`;
};

export const formatDuration = (startTime, endTime) => {
  // Validate inputs
  if (!startTime || !endTime || typeof startTime !== 'string' || typeof endTime !== 'string') {
    return 0;
  }

  const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
    return 0;
  }

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  // Guard against NaN
  if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) {
    return 0;
  }

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const durationMinutes = endMinutes - startMinutes;

  // Return 0 for negative durations (end before start)
  return durationMinutes > 0 ? durationMinutes / 60 : 0;
};

export const getChartData = (entries) => {
  const totals = calculateCategoryTotals(entries);
  const percentages = calculateCategoryPercentages(entries);

  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    shortCode: cat.shortCode,
    hours: totals[cat.id],
    percentage: percentages[cat.id],
    color: cat.color,
    isHighValue: cat.isHighValue,
    isAutomatable: cat.isAutomatable
  }));
};

export const getEntriesByDate = (entries) => {
  const grouped = {};

  entries.forEach(entry => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  });

  // Sort entries within each date by start time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return grouped;
};
