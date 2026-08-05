'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({
  open, onClose, title, children, widthClass = 'max-w-md',
}: { open: boolean; onClose: () => void; title: string; children: ReactNode; widthClass?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className={`relative h-full w-full ${widthClass} overflow-y-auto bg-white p-6 shadow-2xl dark:bg-admin-surface2 rtl:right-auto`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-charcoal-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-blush-100 dark:hover:bg-admin-surface">
                <X size={18} className="dark:text-gray-300" />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
