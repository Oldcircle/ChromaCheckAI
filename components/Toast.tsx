import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-up">
      <div className="bg-green-500 rounded-full p-1">
        <Check size={12} className="text-white" />
      </div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Toast;