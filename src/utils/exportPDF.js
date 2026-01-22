import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { categories, getCategoryById, caioTrapBenchmark } from '../data/categories';
import { calculateCategoryTotals, calculateCategoryPercentages, getTotalHours, getHighValuePercentage, getAutomatablePercentage, formatHours } from './calculations';

export const exportToPDF = (entries, reflections) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const totals = calculateCategoryTotals(entries);
  const percentages = calculateCategoryPercentages(entries);
  const totalHours = getTotalHours(entries);
  const highValuePercent = getHighValuePercentage(entries);
  const automatablePercent = getAutomatablePercentage(entries);

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CAIO Workflow Audit', margin, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Week 6, Module 1 | Generated ${format(new Date(), 'MMMM d, yyyy')}`, margin, y);
  y += 15;

  // Summary Stats
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Hours Analyzed: ${formatHours(totalHours)}`, margin, y);
  y += 6;
  doc.text(`Total Entries: ${entries.length}`, margin, y);
  y += 6;
  doc.text(`High-Value Work (Categories 1 & 2): ${highValuePercent}%`, margin, y);
  y += 6;
  doc.text(`Automatable Work (Categories 5 & 6): ${automatablePercent}%`, margin, y);
  y += 15;

  // Category Breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Category Breakdown', margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Category', margin, y);
  doc.text('Hours', margin + 80, y);
  doc.text('Your %', margin + 105, y);
  doc.text('CAIO Trap %', margin + 130, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  categories.forEach(cat => {
    doc.text(`${cat.id}. ${cat.name}`, margin, y);
    doc.text(formatHours(totals[cat.id]), margin + 80, y);
    doc.text(`${percentages[cat.id]}%`, margin + 105, y);
    doc.text(`${caioTrapBenchmark[cat.id]}%`, margin + 130, y);
    y += 6;
  });
  y += 10;

  // Reflections
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Reflection Responses', margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. High-Value Work Percentage:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`${highValuePercent}% of time on Client Advisory and Pilot Management`, margin + 5, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('2. Automatable Work Percentage:', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`${automatablePercent}% of time on Communication and Administration`, margin + 5, y);
  y += 10;

  if (reflections.mostSurprisingCategory) {
    const surprisingCat = getCategoryById(Number(reflections.mostSurprisingCategory));
    doc.setFont('helvetica', 'bold');
    doc.text('3. Most Surprising Category:', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`${surprisingCat?.name || 'Not selected'}`, margin + 5, y);
    y += 6;
    if (reflections.surpriseExplanation) {
      const lines = doc.splitTextToSize(reflections.surpriseExplanation, pageWidth - margin * 2 - 5);
      lines.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin + 5, y);
        y += 5;
      });
    }
    y += 5;
  }

  if (reflections.biggestOpportunity) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text('4. Biggest Opportunity to Reclaim Time:', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(reflections.biggestOpportunity, pageWidth - margin * 2 - 5);
    lines.forEach(line => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin + 5, y);
      y += 5;
    });
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(128);
  doc.text('CAIO Certification Program - Week 6, Module 1', margin, 285);

  // Save
  doc.save(`caio-workflow-audit-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
