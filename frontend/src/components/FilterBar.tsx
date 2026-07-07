/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  cities: string[];
  types: string[];
  lightings: string[];
  selectedCity: string;
  selectedType: string;
  selectedLighting: string;
  onCityChange: (city: string) => void;
  onTypeChange: (type: string) => void;
  onLightingChange: (lighting: string) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({
  cities,
  types,
  lightings,
  selectedCity,
  selectedType,
  selectedLighting,
  onCityChange,
  onTypeChange,
  onLightingChange,
  onReset,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const isFiltered = selectedCity !== '' || selectedType !== '' || selectedLighting !== '';

  return (
    <div className="w-full bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-5 md:p-6 shadow-sm" id="filter-bar-container">
      <div className="flex flex-col gap-5">
        
        {/* Header with Icon and Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand dark:text-brand-secondary" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-neutral-300">
              Filter Lokasi
            </h3>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
            Menampilkan <span className="font-bold text-brand dark:text-brand-secondary">{filteredCount}</span> dari <span className="font-bold">{totalCount}</span> billboard
          </div>
        </div>

        {/* Filter Select Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="filter-selectors-grid">
          
          {/* Province (Readonly) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Provinsi
            </label>
            <div className="w-full bg-slate-100 dark:bg-[#0E1528]/50 text-slate-500 dark:text-neutral-400 px-3 py-2.5 text-xs rounded-none border border-slate-200 dark:border-white/5 font-medium cursor-not-allowed">
              Sumatera Barat
            </div>
          </div>

          {/* City Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Kota / Kabupaten
            </label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1528] text-slate-800 dark:text-white px-3 py-2.5 text-xs rounded-none border border-slate-200 dark:border-white/5 focus:border-brand dark:focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand dark:focus:ring-brand-secondary transition-all cursor-pointer font-medium"
              id="filter-city-select"
            >
              <option value="">Semua Kota</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Jenis Media
            </label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1528] text-slate-800 dark:text-white px-3 py-2.5 text-xs rounded-none border border-slate-200 dark:border-white/5 focus:border-brand dark:focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand dark:focus:ring-brand-secondary transition-all cursor-pointer font-medium"
              id="filter-type-select"
            >
              <option value="">Semua Jenis</option>
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Lighting Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Pencahayaan
            </label>
            <select
              value={selectedLighting}
              onChange={(e) => onLightingChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1528] text-slate-800 dark:text-white px-3 py-2.5 text-xs rounded-none border border-slate-200 dark:border-white/5 focus:border-brand dark:focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand dark:focus:ring-brand-secondary transition-all cursor-pointer font-medium"
              id="filter-lighting-select"
            >
              <option value="">Semua Pencahayaan</option>
              {lightings.map((lighting) => (
                <option key={lighting} value={lighting}>{lighting}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear Filters Button (conditional) */}
        {isFiltered && (
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/5">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 focus:outline-none cursor-pointer border border-rose-500/10 hover:border-rose-500/20 px-3 py-1.5 transition-all"
              id="reset-filters-button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
