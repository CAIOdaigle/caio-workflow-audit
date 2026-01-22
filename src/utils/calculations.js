import { categories } from '../data/categories';

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

  // Categories 1 (Advisory) and 2 (Pilot Management) are high-value
  const highValueHours = totals[1] + totals[2];
  return Math.round((highValueHours / totalHours) * 100);
};

export const getAutomatablePercentage = (entries) => {
  const totals = calculateCategoryTotals(entries);
  const totalHours = getTotalHours(entries);

  if (totalHours === 0) return 0;

  // Categories 5 (Communication) and 6 (Administration) are most automatable
  const automatableHours = totals[5] + totals[6];
  return Math.round((automatableHours / totalHours) * 100);
};

export const formatHours = (hours) => {
  if (hours === 0) return '0 hrs';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return '1 hr';
  return `${hours.toFixed(1)} hrs`;
};

export const formatDuration = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const durationMinutes = endMinutes - startMinutes;
  return durationMinutes / 60;
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
