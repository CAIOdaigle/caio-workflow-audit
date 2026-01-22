import { X, Info } from 'lucide-react';
import { categories } from '../../data/categories';

export const CategoryReference = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
      <div className="bg-white h-full w-full max-w-md overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Category Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ backgroundColor: category.bgColor }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: category.color }}
                >
                  {category.id}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: category.color, color: 'white' }}
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
                  <ul className="text-sm text-gray-700 space-y-1">
                    {category.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
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
            </div>
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
    >
      {category.shortCode}
    </span>
  );
};
