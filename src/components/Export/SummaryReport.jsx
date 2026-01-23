import { useState } from 'react';
import { Download, FileText, Table, CheckCircle, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
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
import { Button, Card } from '../ui';

export const SummaryReport = ({ entries, reflections, onComplete }) => {
  const [exportStatus, setExportStatus] = useState(null);
  const [isExporting, setIsExporting] = useState({ pdf: false, csv: false });

  const handleExportPDF = async () => {
    setIsExporting(prev => ({ ...prev, pdf: true }));
    await new Promise(resolve => setTimeout(resolve, 50));

    const result = exportToPDF(entries, reflections);
    setIsExporting(prev => ({ ...prev, pdf: false }));

    if (result?.success === false) {
      setExportStatus({ type: 'error', message: result.error });
      setTimeout(() => setExportStatus(null), 4000);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(prev => ({ ...prev, csv: true }));
    await new Promise(resolve => setTimeout(resolve, 50));

    const result = exportToCSV(entries);
    setIsExporting(prev => ({ ...prev, csv: false }));

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

  const isInTrap = automatablePercent >= WORKFLOW_THRESHOLDS.TRAP_THRESHOLD;
  const isBalanced = highValuePercent >= WORKFLOW_THRESHOLDS.HEALTHY_HIGH_VALUE &&
                     automatablePercent <= WORKFLOW_THRESHOLDS.HEALTHY_AUTOMATABLE;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Workflow Audit Summary</h2>
            <p className="text-gray-500 mt-1">Based on {formatHours(totalHours)} analyzed across {entries.length} time blocks</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting.pdf}
              className="gap-2"
            >
              {isExporting.pdf ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <FileText size={18} aria-hidden="true" />
              )}
              {isExporting.pdf ? 'Generating...' : 'Export PDF'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportCSV}
              disabled={isExporting.csv}
              className="gap-2"
            >
              {isExporting.csv ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Table size={18} aria-hidden="true" />
              )}
              {isExporting.csv ? 'Generating...' : 'Export CSV'}
            </Button>
          </div>
        </div>

        {exportStatus?.type === 'error' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700" role="alert">
            Export failed: {exportStatus.message}
          </div>
        )}

        {/* Status Banner */}
        {isInTrap ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
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
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-green-900">Your time allocation looks healthy</p>
              <p className="text-sm text-green-700 mt-1">
                {highValuePercent}% of your time goes to high-value work. Keep optimizing!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-primary-light border border-primary/20 rounded-xl flex items-start gap-3">
            <TrendingUp className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-primary-dark">Room for improvement</p>
              <p className="text-sm text-gray-700 mt-1">
                You have opportunities to increase high-value work from {highValuePercent}% toward 50%+.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">{formatHours(totalHours)}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-500">Entries Logged</p>
          <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-500">High-Value Work</p>
          <p className="text-2xl font-bold text-primary">{highValuePercent}%</p>
        </Card>
        <Card padding="sm">
          <p className="text-sm text-gray-500">Automatable Work</p>
          <p className="text-2xl font-bold text-amber-600">{automatablePercent}%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPieChart entries={entries} />
        <BenchmarkComparison entries={entries} />
      </div>

      <HighValueVsAutomatable entries={entries} />

      {/* Category Details Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Category Details</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hours</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Your %</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">CAIO Trap %</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map(cat => {
                const diff = percentages[cat.id] - caioTrapBenchmark[cat.id];
                return (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-600">
                      {formatHours(totals[cat.id])}
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-gray-900">
                      {percentages[cat.id]}%
                    </td>
                    <td className="px-5 py-4 text-right text-gray-500">
                      {caioTrapBenchmark[cat.id]}%
                    </td>
                    <td className={`px-5 py-4 text-right font-medium ${
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
      </Card>

      {/* Reflection Responses */}
      <Card>
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
      </Card>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-primary to-primary-hover rounded-card p-6 text-white shadow-card">
        <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
        <p className="text-blue-100 mb-4">
          In the next lesson, you'll select your top 5 time-consuming workflows and map them in detail
          — the same process mapping methodology from Week 3, now applied to yourself.
        </p>
        <Button
          onClick={onComplete}
          variant="secondary"
          className="bg-white text-primary hover:bg-blue-50"
        >
          Mark Complete & Continue
        </Button>
      </div>
    </div>
  );
};
