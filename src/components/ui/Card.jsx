import PropTypes from 'prop-types';

export default function Card({
  as: Component = 'div',
  hover = false,
  padding = 'md',
  className = '',
  children,
  ...props
}) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles = 'bg-white rounded-card shadow-card';
  const hoverStyles = hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : '';

  return (
    <Component
      className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

Card.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node,
};

// Card.Header for consistent card headers
Card.Header = function CardHeader({ className = '', children }) {
  return (
    <div className={`pb-4 mb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

Card.Header.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Card.Title for consistent titles
Card.Title = function CardTitle({ className = '', children }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

Card.Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
