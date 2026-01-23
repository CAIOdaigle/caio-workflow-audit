import { categories } from '../../data/categories';
import { calculateCategoryTotals, calculateCategoryPercentages, formatHours } from '../../utils/calculations';
import { Card } from '../ui';

export const CategoryBreakdown = ({ entries }) => {
  const totals = calculateCategoryTotals(entries);
  const percentages = calculateCategoryPercentages(entries);

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Category Breakdown</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {categories.map(cat => (
          <div key={cat.id} className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {formatHours(totals[cat.id])} ({percentages[cat.id]}%)
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentages[cat.id]}%`,
                  backgroundColor: cat.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const QuickStats = ({ entries }) => {
  const totals = calculateCategoryTotals(entries);
  const totalHours = Object.values(totals).reduce((sum, h) => sum + h, 0);

  // High-value work: Categories 1 & 2
  const highValueHours = totals[1] + totals[2];
  const highValuePercent = totalHours > 0 ? Math.round((highValueHours / totalHours) * 100) : 0;

  // Automatable work: Categories 5 & 6
  const automatableHours = totals[5] + totals[6];
  const automatablePercent = totalHours > 0 ? Math.round((automatableHours / totalHours) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card padding="sm">
        <div className="text-sm text-gray-500 mb-1">High-Value Work</div>
        <div className="text-2xl font-bold text-primary">{highValuePercent}%</div>
        <div className="text-xs text-gray-400 mt-1">
          Advisory + Pilot Management
        </div>
      </Card>

      <Card padding="sm">
        <div className="text-sm text-gray-500 mb-1">Automatable Work</div>
        <div className="text-2xl font-bold text-amber-600">{automatablePercent}%</div>
        <div className="text-xs text-gray-400 mt-1">
          Communication + Administration
        </div>
      </Card>
    </div>
  );
};
