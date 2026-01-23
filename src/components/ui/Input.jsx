import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const baseInputStyles = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';
const normalBorder = 'border-gray-300';
const errorBorder = 'border-red-500 focus:ring-red-500 focus:border-red-500';

const Input = forwardRef(function Input({
  label,
  error,
  required = false,
  className = '',
  ...props
}, ref) {
  const inputStyles = `${baseInputStyles} ${error ? errorBorder : normalBorder} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={inputStyles}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

// Select variant
export const Select = forwardRef(function Select({
  label,
  error,
  required = false,
  className = '',
  children,
  ...props
}, ref) {
  const selectStyles = `${baseInputStyles} ${error ? errorBorder : normalBorder} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={selectStyles}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

// Textarea variant
export const Textarea = forwardRef(function Textarea({
  label,
  error,
  required = false,
  className = '',
  ...props
}, ref) {
  const textareaStyles = `${baseInputStyles} resize-none ${error ? errorBorder : normalBorder} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={textareaStyles}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
