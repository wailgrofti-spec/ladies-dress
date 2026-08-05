'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Dialog({
  open, onClose, title, children, footer,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-admin-surface2"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="text-charcoal-700/50 hover:text-charcoal-800 dark:text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="mt-3 text-sm text-charcoal-700 dark:text-gray-300">{children}</div>
            {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
