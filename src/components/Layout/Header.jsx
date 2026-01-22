import { Clock, BarChart3, MessageSquare, FileText } from 'lucide-react';

const steps = [
  { id: 'entry', label: 'Time Entry', icon: Clock },
  { id: 'review', label: 'Review', icon: BarChart3 },
  { id: 'reflect', label: 'Reflect', icon: MessageSquare },
  { id: 'summary', label: 'Summary', icon: FileText }
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
        <nav className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentIndex;
            const isClickable = canNavigate(step.id);

            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepChange(step.id)}
                disabled={!isClickable}
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
                <Icon size={18} />
                <span className="font-medium text-sm hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
