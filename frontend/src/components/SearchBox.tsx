/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder = 'Cari berdasarkan kode, nama, jalan...' }: SearchBoxProps) {
  return (
    <div className="relative w-full" id="search-box-container">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-neutral-500">
        <Search className="h-5 w-5" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-[#0E1528] text-slate-800 dark:text-white pl-11 pr-11 py-3.5 text-sm rounded-none border border-slate-200 dark:border-white/5 focus:border-brand dark:focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand dark:focus:ring-brand-secondary transition-all duration-300 placeholder-slate-400 dark:placeholder-neutral-600 font-medium"
        id="billboard-search-input"
      />

      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 cursor-pointer focus:outline-none"
          title="Clear search"
          id="clear-search-button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
