import { Clock, BarChart3, MessageSquare, FileText, Check } from 'lucide-react';
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
    <header className="bg-white shadow-card sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="ChiefAIOfficer.com" className="h-10" />
            <div className="border-l border-gray-200 pl-4">
              <h1 className="text-lg font-bold text-gray-900">Workflow Audit</h1>
              <p className="text-xs text-gray-500">Week 6, Module 1</p>
            </div>
          </div>
        </div>

        {/* Progress Steps with connecting line */}
        <nav className="relative" aria-label="Audit progress">
          {/* Background connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden sm:block" style={{ left: '10%', right: '10%' }} />

          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentIndex;
              const isClickable = canNavigate(step.id);
              const showTooltip = !isClickable && step.tooltip;

              return (
                <div key={step.id} className="relative group flex flex-col items-center">
                  {/* Step number circle */}
                  <button
                    onClick={() => isClickable && onStepChange(step.id)}
                    disabled={!isClickable}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`${step.label}${!isClickable && step.tooltip ? ` - ${step.tooltip}` : ''}`}
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all font-semibold text-sm ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : isCompleted
                        ? 'bg-primary text-white'
                        : isClickable
                        ? 'bg-white border-2 border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} aria-hidden="true" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>

                  {/* Step label */}
                  <div className="mt-2 flex flex-col items-center">
                    <Icon
                      size={16}
                      className={`mb-1 ${
                        isActive || isCompleted ? 'text-primary' : 'text-gray-400'
                      }`}
                      aria-hidden="true"
                    />
                    <span className={`font-medium text-xs hidden sm:block ${
                      isActive ? 'text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {step.tooltip}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
