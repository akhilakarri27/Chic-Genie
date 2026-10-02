import React from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-alert-pill">
          <span>{toast.icon || '✨'}</span>
          <span>{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)} 
            style={{ color: '#FFFFFF', opacity: 0.7, marginLeft: '0.5rem', display: 'flex' }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
