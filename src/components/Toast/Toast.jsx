import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-500'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500'
  }
};

export const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${colors.bg} ${colors.border}`}>
        <Icon size={20} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />
        <p className={`flex-1 text-sm font-medium ${colors.text}`}>{message}</p>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${colors.text}`}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
