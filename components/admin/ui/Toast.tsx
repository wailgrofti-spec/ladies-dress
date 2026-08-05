'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; type: ToastType; message: string; }

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++idCounter;
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 4000);
  }, []);

  function dismiss(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 rtl:right-auto rtl:left-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
              className="pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-blush-200 bg-white p-3 shadow-lg dark:border-admin-border dark:bg-admin-surface2"
            >
              {item.type === 'success' && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-500" />}
              {item.type === 'error' && <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />}
              {item.type === 'info' && <Info size={18} className="mt-0.5 shrink-0 text-rosegold-400" />}
              <p className="flex-1 text-sm text-charcoal-800 dark:text-gray-100">{item.message}</p>
              <button onClick={() => dismiss(item.id)} className="text-charcoal-700/50 hover:text-charcoal-800 dark:text-gray-500">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
