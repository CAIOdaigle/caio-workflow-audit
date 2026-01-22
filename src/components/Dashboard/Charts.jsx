import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { categories, caioTrapBenchmark } from '../../data/categories';
import { calculateCategoryPercentages, calculateCategoryTotals, formatHours } from '../../utils/calculations';

export const CategoryPieChart = ({ entries }) => {
  const percentages = calculateCategoryPercentages(entries);
  const totals = calculateCategoryTotals(entries);

  const data = categories.map(cat => ({
    name: cat.name,
    value: percentages[cat.id],
    hours: totals[cat.id],
    color: cat.color
  })).filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center h-64">
        <p className="text-gray-400">Add entries to see your distribution</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Time Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${value}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value}% (${formatHours(props.payload.hours)})`,
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BenchmarkComparison = ({ entries }) => {
  const percentages = calculateCategoryPercentages(entries);
  const totalHours = Object.values(calculateCategoryTotals(entries)).reduce((sum, h) => sum + h, 0);

  if (totalHours === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center h-64">
        <p className="text-gray-400">Add entries to see benchmark comparison</p>
      </div>
    );
  }

  const data = categories.map(cat => ({
    name: cat.shortCode,
    fullName: cat.name,
    yours: percentages[cat.id],
    trap: caioTrapBenchmark[cat.id],
    color: cat.color
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">vs. "The CAIO Trap"</h3>
        <p className="text-sm text-gray-500">
          Compare your distribution to the common pattern where 50% goes to low-value work
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" domain={[0, 60]} unit="%" />
          <YAxis type="category" dataKey="name" width={40} />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name === 'yours' ? 'Your Time' : 'CAIO Trap']}
            labelFormatter={(label) => data.find(d => d.name === label)?.fullName}
          />
          <Legend />
          <Bar dataKey="yours" name="Your Time" fill="#2563eb" radius={[0, 4, 4, 0]} />
          <Bar dataKey="trap" name="CAIO Trap" fill="#94a3b8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const HighValueVsAutomatable = ({ entries }) => {
  const totals = calculateCategoryTotals(entries);
  const totalHours = Object.values(totals).reduce((sum, h) => sum + h, 0);

  if (totalHours === 0) return null;

  const highValue = totals[1] + totals[2];
  const automatable = totals[5] + totals[6];
  const other = totalHours - highValue - automatable;

  const highValuePercent = Math.round((highValue / totalHours) * 100);
  const automatablePercent = Math.round((automatable / totalHours) * 100);
  const otherPercent = 100 - highValuePercent - automatablePercent;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Value Analysis</h3>

      <div className="h-8 flex rounded-full overflow-hidden mb-4">
        <div
          className="bg-blue-600 flex items-center justify-center"
          style={{ width: `${highValuePercent}%` }}
        >
          {highValuePercent > 10 && (
            <span className="text-xs text-white font-medium">{highValuePercent}%</span>
          )}
        </div>
        <div
          className="bg-gray-300 flex items-center justify-center"
          style={{ width: `${otherPercent}%` }}
        >
          {otherPercent > 10 && (
            <span className="text-xs text-gray-600 font-medium">{otherPercent}%</span>
          )}
        </div>
        <div
          className="bg-amber-500 flex items-center justify-center"
          style={{ width: `${automatablePercent}%` }}
        >
          {automatablePercent > 10 && (
            <span className="text-xs text-white font-medium">{automatablePercent}%</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs text-gray-600">High-Value</span>
          </div>
          <p className="font-semibold text-blue-600">{formatHours(highValue)}</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-600">Other</span>
          </div>
          <p className="font-semibold text-gray-600">{formatHours(other)}</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-600">Automatable</span>
          </div>
          <p className="font-semibold text-amber-600">{formatHours(automatable)}</p>
        </div>
      </div>
    </div>
  );
};
