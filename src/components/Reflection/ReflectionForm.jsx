import { useState } from 'react';
import { categories } from '../../data/categories';
import { getHighValuePercentage, getAutomatablePercentage } from '../../utils/calculations';
import { Button, Card } from '../ui';
import { ArrowRight } from 'lucide-react';

export const ReflectionForm = ({ entries, reflections, onUpdate, onContinue }) => {
  const highValuePercent = getHighValuePercentage(entries);
  const automatablePercent = getAutomatablePercentage(entries);

  const [formData, setFormData] = useState({
    mostSurprisingCategory: reflections.mostSurprisingCategory || '',
    surpriseExplanation: reflections.surpriseExplanation || '',
    biggestOpportunity: reflections.biggestOpportunity || ''
  });

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const canContinue = formData.mostSurprisingCategory && formData.surpriseExplanation.trim() && formData.biggestOpportunity.trim();

  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Reflection Questions</h2>

        <div className="space-y-8">
          {/* Question 1 - Auto calculated */}
          <div className="p-5 bg-primary-light rounded-xl">
            <p className="text-sm font-medium text-primary-dark mb-2">
              1. What percentage of your time went to Categories 1 and 2 (highest-value work)?
            </p>
            <p className="text-4xl font-bold text-primary">{highValuePercent}%</p>
            <p className="text-sm text-gray-700 mt-2">
              This is your time spent on Client Advisory and Pilot Management — the work clients actually hire you for.
            </p>
          </div>

          {/* Question 2 - Auto calculated */}
          <div className="p-5 bg-amber-50 rounded-xl">
            <p className="text-sm font-medium text-amber-900 mb-2">
              2. What percentage went to Categories 5 and 6 (most automatable)?
            </p>
            <p className="text-4xl font-bold text-amber-600">{automatablePercent}%</p>
            <p className="text-sm text-amber-700 mt-2">
              This is your time spent on Communication and Administration — work that AI can help automate.
            </p>
          </div>

          {/* Question 3 - User input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              3. Which single category surprised you most?
            </label>
            <select
              value={formData.mostSurprisingCategory}
              onChange={(e) => handleChange('mostSurprisingCategory', e.target.value)}
              className={`${inputStyles} mb-4`}
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.id}. {cat.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why did this surprise you?
            </label>
            <textarea
              value={formData.surpriseExplanation}
              onChange={(e) => handleChange('surpriseExplanation', e.target.value)}
              placeholder="Explain what you expected vs. what you found..."
              rows={3}
              className={`${inputStyles} resize-none`}
            />
          </div>

          {/* Question 4 - User input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              4. Where do you see the biggest opportunity to reclaim time?
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Think about specific tasks or workflows that could be automated, delegated, or eliminated.
            </p>
            <textarea
              value={formData.biggestOpportunity}
              onChange={(e) => handleChange('biggestOpportunity', e.target.value)}
              placeholder="e.g., Email responses could be templated, status updates could be automated..."
              rows={4}
              className={`${inputStyles} resize-none`}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!canContinue}
          size="lg"
          className="gap-2"
        >
          View Summary
          <ArrowRight size={18} />
        </Button>
      </div>

      {!canContinue && (
        <p className="text-sm text-gray-500 text-center">
          Please complete all reflection questions to continue.
        </p>
      )}
    </div>
  );
};
