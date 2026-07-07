/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  title = 'Tidak Ada Data Ditemukan', 
  description = 'Saat ini belum ada data yang sesuai dengan filter Anda.', 
  actionText, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1226] max-w-lg mx-auto my-8">
      <div className="bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-white/5 p-3.5 mb-4 rounded-none text-slate-450 shrink-0">
        <HelpCircle className="w-6 h-6 text-brand dark:text-brand-secondary" />
      </div>
      <h3 className="font-mono text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-neutral-450 max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="border border-brand text-brand dark:border-brand-secondary dark:text-brand-secondary px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white dark:hover:bg-brand-secondary dark:hover:text-slate-950 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
