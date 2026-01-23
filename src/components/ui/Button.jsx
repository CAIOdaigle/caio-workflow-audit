import PropTypes from 'prop-types';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98]',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
  danger: 'bg-transparent text-red-600 hover:bg-red-50 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
