import { useState } from 'react';
import { Download, FileText, Table, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { categories, getCategoryById, caioTrapBenchmark } from '../../data/categories';
import {
  calculateCategoryTotals,
  calculateCategoryPercentages,
  getTotalHours,
  getHighValuePercentage,
  getAutomatablePercentage,
  formatHours
} from '../../utils/calculations';
import { exportToPDF } from '../../utils/exportPDF';
import { exportToCSV } from '../../utils/exportCSV';
import { CategoryPieChart, BenchmarkComparison, HighValueVsAutomatable } from '../Dashboard/Charts';
import { WORKFLOW_THRESHOLDS } from '../../constants/app';

export const SummaryReport = ({ entries, reflections, onComplete }) => {
  const [exportStatus, setExportStatus] = useState(null);

  const handleExportPDF = () => {
    const result = exportToPDF(entries, reflections);
    if (result?.success === false) {
      setExportStatus({ type: 'error', message: result.error });
      setTimeout(() => setExportStatus(null), 4000);
    }
  };

  const handleExportCSV = () => {
    const result = exportToCSV(entries);
    if (result?.success === false) {
      setExportStatus({ type: 'error', message: result.error });
      setTimeout(() => setExportStatus(null), 4000);
    }
  };
  const totals = calculateCategoryTotals(entries);
  const percentages = calculateCategoryPercentages(entries);
  const totalHours = getTotalHours(entries);
  const highValuePercent = getHighValuePercentage(entries);
  const automatablePercent = getAutomatablePercentage(entries);

  const surprisingCategory = reflections.mostSurprisingCategory
    ? getCategoryById(Number(reflections.mostSurprisingCategory))
    : null;

  // Determine if they're in the "CAIO Trap"
  const isInTrap = automatablePercent >= WORKFLOW_THRESHOLDS.TRAP_THRESHOLD;
  const isBalanced = highValuePercent >= WORKFLOW_THRESHOLDS.HEALTHY_HIGH_VALUE &&
                     automatablePercent <= WORKFLOW_THRESHOLDS.HEALTHY_AUTOMATABLE;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Workflow Audit Summary</h2>
            <p className="text-gray-500 mt-1">Based on {formatHours(totalHours)} analyzed across {entries.length} time blocks</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#0038ff] text-white rounded-lg hover:bg-[#0030dd] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FileText size={18} aria-hidden="true" />
              Export PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Table size={18} aria-hidden="true" />
              Export CSV
            </button>
          </div>
          {exportStatus?.type === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
              Export failed: {exportStatus.message}
            </div>
          )}
        </div>

        {/* Status Banner */}
        {isInTrap ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-amber-900">You may be in "The CAIO Trap"</p>
              <p className="text-sm text-amber-700 mt-1">
                {automatablePercent}% of your time goes to Communication and Administration.
                The goal is to flip this ratio using AI assistance.
              </p>
            </div>
          </div>
        ) : isBalanced ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-green-900">Your time allocation looks healthy</p>
              <p className="text-sm text-green-700 mt-1">
                {highValuePercent}% of your time goes to high-value work. Keep optimizing!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-blue-900">Room for improvement</p>
              <p className="text-sm text-blue-700 mt-1">
                You have opportunities to increase high-value work from {highValuePercent}% toward 50%+.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">{formatHours(totalHours)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Entries Logged</p>
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">High-Value Work</p>
          <p className="text-2xl font-bold text-blue-600">{highValuePercent}%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Automatable Work</p>
          <p className="text-2xl font-bold text-amber-600">{automatablePercent}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPieChart entries={entries} />
        <BenchmarkComparison entries={entries} />
      </div>

      <HighValueVsAutomatable entries={entries} />

      {/* Category Details Table - Responsive */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Category Details</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Your %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">CAIO Trap %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map(cat => {
                const diff = percentages[cat.id] - caioTrapBenchmark[cat.id];
                return (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatHours(totals[cat.id])}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {percentages[cat.id]}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {caioTrapBenchmark[cat.id]}%
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      cat.isHighValue
                        ? diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500'
                        : diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {diff > 0 ? '+' : ''}{diff}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden divide-y divide-gray-100">
          {categories.map(cat => {
            const diff = percentages[cat.id] - caioTrapBenchmark[cat.id];
            return (
              <div key={cat.id} className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-gray-900">{cat.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Hours: </span>
                    <span className="text-gray-900">{formatHours(totals[cat.id])}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Your %: </span>
                    <span className="font-medium text-gray-900">{percentages[cat.id]}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">CAIO Trap: </span>
                    <span className="text-gray-600">{caioTrapBenchmark[cat.id]}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Diff: </span>
                    <span className={`font-medium ${
                      cat.isHighValue
                        ? diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500'
                        : diff < 0 ? 'text-green-600' : diff > 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {diff > 0 ? '+' : ''}{diff}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reflection Responses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Your Reflections</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Most Surprising Category</p>
            <p className="text-gray-900 font-medium">
              {surprisingCategory?.name || 'Not specified'}
            </p>
            {reflections.surpriseExplanation && (
              <p className="text-gray-600 mt-2">{reflections.surpriseExplanation}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Biggest Opportunity to Reclaim Time</p>
            <p className="text-gray-600">{reflections.biggestOpportunity || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
        <p className="text-blue-100 mb-4">
          In the next lesson, you'll select your top 5 time-consuming workflows and map them in detail
          — the same process mapping methodology from Week 3, now applied to yourself.
        </p>
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          Mark Complete & Continue
        </button>
      </div>
    </div>
  );
};
