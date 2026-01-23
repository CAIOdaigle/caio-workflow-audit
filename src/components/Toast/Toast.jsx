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
    bg: 'bg-primary-light',
    border: 'border-primary/20',
    text: 'text-primary-dark',
    icon: 'text-primary'
  }
};

export const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = iconMap[type];
  const colors = colorMap[type];

  // Trigger enter animation on mount
  useEffect(() => {
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`transform transition-all duration-300 ease-out ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : isLeaving
          ? 'translate-x-4 opacity-0'
          : 'translate-x-8 opacity-0'
      }`}
    >
      <div className={`flex items-start gap-3 p-4 rounded-card border shadow-card-hover ${colors.bg} ${colors.border}`}>
        <Icon size={20} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />
        <p className={`flex-1 text-sm font-medium ${colors.text}`}>{message}</p>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 transition-colors ${colors.text}`}
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
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
