import { useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';
import { categories } from '../../data/categories';
import { Card } from '../ui';

export const CategoryReference = ({ isOpen, onClose }) => {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-guide-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="bg-white h-full w-full max-w-md overflow-y-auto shadow-panel animate-slide-in-right"
        role="document"
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
              <Info size={18} className="text-primary" aria-hidden="true" />
            </div>
            <h2 id="category-guide-title" className="font-semibold text-gray-900">
              Category Guide
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close category guide"
          >
            <X size={20} className="text-gray-500" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {categories.map(category => (
            <Card
              key={category.id}
              padding="none"
              className="overflow-hidden"
              aria-labelledby={`category-${category.id}-name`}
            >
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ backgroundColor: category.bgColor }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                >
                  {category.id}
                </div>
                <div>
                  <h3 id={`category-${category.id}-name`} className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: category.color, color: 'white' }}
                    aria-label={`Code: ${category.shortCode}`}
                  >
                    {category.shortCode}
                  </span>
                </div>
              </div>

              <div className="px-4 py-4 space-y-3">
                <p className="text-sm text-gray-600">{category.description}</p>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Examples
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1.5" aria-label={`Examples for ${category.name}`}>
                    {category.examples.map((example, idx) => (
                      <li key={`${category.id}-example-${idx}`} className="flex items-start gap-2">
                        <span className="text-gray-300 mt-0.5" aria-hidden="true">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-1" role="group" aria-label="Category attributes">
                  {category.isHighValue && (
                    <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      High Value
                    </span>
                  )}
                  {category.isAutomatable && (
                    <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                      Automatable
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export const CategoryBadge = ({ category, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };

  return (
    <span
      className={`font-medium rounded-full ${sizeClasses[size]}`}
      style={{ backgroundColor: category.bgColor, color: category.color }}
      aria-label={`Category: ${category.name}`}
    >
      {category.shortCode}
    </span>
  );
};
