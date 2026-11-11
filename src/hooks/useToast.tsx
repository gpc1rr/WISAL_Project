import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, description?: string) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message, description }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const value = {
    toast: addToast,
    success: (msg: string, desc?: string) => addToast(msg, 'success', desc),
    error: (msg: string, desc?: string) => addToast(msg, 'error', desc),
    info: (msg: string, desc?: string) => addToast(msg, 'info', desc),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-elevated backdrop-blur-md transition-all duration-300 animate-slide-up ${
              t.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-700/60 shadow-emerald-950/20'
                : t.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700/60 shadow-rose-950/20'
                : 'bg-[#172B26]/95 text-white border-gold-500/40 shadow-black/20'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-gold-400" />}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-semibold">{t.message}</p>
              {t.description && <p className="text-xs opacity-90 mt-0.5">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
