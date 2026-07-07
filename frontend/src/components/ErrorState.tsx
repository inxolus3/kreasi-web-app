/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Gagal memuat data dari server.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-rose-200/20 bg-rose-500/5 max-w-lg mx-auto my-8">
      <div className="bg-rose-500/10 border border-rose-500/20 p-3 mb-4 rounded-none text-rose-500 shrink-0">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-mono text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">
        Koneksi Gagal
      </h3>
      <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
        {message} Pastikan server backend Anda menyala dan coba muat kembali halaman ini.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:text-slate-950 text-white font-mono font-black text-[10px] tracking-widest px-5 py-3 transition-colors cursor-pointer uppercase"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
