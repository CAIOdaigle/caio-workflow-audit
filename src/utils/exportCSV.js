import { getCategoryById } from '../data/categories';
import { format } from 'date-fns';

export const exportToCSV = (entries) => {
  try {
    const headers = ['Date', 'Start Time', 'End Time', 'Duration (hrs)', 'Activity', 'Category', 'Notes'];

    const rows = entries.map(entry => {
      const category = getCategoryById(entry.categoryId);
      return [
        entry.date,
        entry.startTime,
        entry.endTime,
        entry.duration,
        `"${entry.activity.replace(/"/g, '""')}"`,
        category?.name || 'Unknown',
        `"${(entry.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caio-workflow-audit-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('CSV export failed:', error);
    return { success: false, error: error.message || 'Failed to generate CSV' };
  }
};
