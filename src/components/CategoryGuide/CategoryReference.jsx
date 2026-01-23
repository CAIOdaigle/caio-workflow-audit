import { useEffect, useRef } from 'react';
import { X, Info } from 'lucide-react';
import { categories } from '../../data/categories';

export const CategoryReference = ({ isOpen, onClose }) => {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when panel opens
      closeButtonRef.current?.focus();

      // Handle escape key
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
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="bg-white h-full w-full max-w-md overflow-y-auto shadow-xl"
        role="document"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-blue-600" aria-hidden="true" />
            <h2 id="category-guide-title" className="font-semibold text-gray-900">
              Category Guide
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close category guide"
          >
            <X size={20} className="text-gray-600" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {categories.map(category => (
            <article
              key={category.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
              aria-labelledby={`category-${category.id}-name`}
            >
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ backgroundColor: category.bgColor }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
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

              <div className="px-4 py-3 space-y-3">
                <p className="text-sm text-gray-600">{category.description}</p>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Examples
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1" aria-label={`Examples for ${category.name}`}>
                    {category.examples.map((example, idx) => (
                      <li key={`${category.id}-example-${idx}`} className="flex items-start gap-2">
                        <span className="text-gray-400" aria-hidden="true">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2" role="group" aria-label="Category attributes">
                  {category.isHighValue && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      High Value
                    </span>
                  )}
                  {category.isAutomatable && (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                      Automatable
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
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
