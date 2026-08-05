'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

interface MenuAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export default function DropdownMenu({ actions }: { actions: MenuAction[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full p-1.5 hover:bg-blush-100 dark:hover:bg-admin-surface"
        aria-label="Actions"
      >
        <MoreVertical size={16} className="dark:text-gray-300" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute end-0 top-9 z-30 w-48 overflow-hidden rounded-xl border border-blush-200 bg-white py-1 shadow-lg dark:border-admin-border dark:bg-admin-surface2"
          >
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => { a.onClick(); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-start text-sm hover:bg-blush-50 dark:hover:bg-admin-surface ${
                  a.danger ? 'text-red-500' : 'text-charcoal-800 dark:text-gray-200'
                }`}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
