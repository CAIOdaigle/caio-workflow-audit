import { Clock, BarChart3, MessageSquare, FileText } from 'lucide-react';
import { MIN_ENTRIES_FOR_REVIEW } from '../../constants/app';

const steps = [
  { id: 'entry', label: 'Time Entry', icon: Clock, tooltip: null },
  { id: 'review', label: 'Review', icon: BarChart3, tooltip: `Add at least ${MIN_ENTRIES_FOR_REVIEW} entries to unlock` },
  { id: 'reflect', label: 'Reflect', icon: MessageSquare, tooltip: 'Complete the Review step first' },
  { id: 'summary', label: 'Summary', icon: FileText, tooltip: 'Complete the Reflect step first' }
];

export const Header = ({ currentStep, onStepChange, canNavigate }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="ChiefAIOfficer.com" className="h-10" />
            <div className="border-l border-gray-200 pl-4">
              <h1 className="text-lg font-bold text-gray-900">Workflow Audit</h1>
              <p className="text-xs text-gray-500">Week 6, Module 1</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <nav className="flex items-center justify-between" aria-label="Audit progress">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentIndex;
            const isClickable = canNavigate(step.id);
            const showTooltip = !isClickable && step.tooltip;

            return (
              <div key={step.id} className="relative group">
                <button
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${step.label}${!isClickable && step.tooltip ? ` - ${step.tooltip}` : ''}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#0038ff] text-white'
                      : isCompleted
                      ? 'bg-blue-100 text-[#0038ff] hover:bg-blue-200'
                      : isClickable
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="font-medium text-sm hidden sm:inline">{step.label}</span>
                </button>
                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    {step.tooltip}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
