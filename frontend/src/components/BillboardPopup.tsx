/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Billboard } from '../types';
import { MapPin, Maximize2, Lightbulb, MessageSquare } from 'lucide-react';

interface BillboardPopupProps {
  billboard: Billboard;
  onSelect: (billboard: Billboard) => void;
}

export default function BillboardPopup({ billboard, onSelect }: BillboardPopupProps) {
  const getWhatsAppLink = (name: string) => {
    const text = `Halo Kreasi Advertising, saya tertarik dengan lokasi billboard ${name}. Apakah lokasi tersebut tersedia untuk disewa?`;
    return `https://wa.me/628116682226?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-60 p-1 flex flex-col font-sans text-slate-800 dark:text-neutral-100" id={`popup-container-${billboard.id}`}>
      

      {/* 2. Title */}
      <h5 className="text-xs font-black text-slate-900 dark:text-white leading-tight line-clamp-2 mb-1.5 hover:text-brand dark:hover:text-brand-secondary cursor-pointer" onClick={() => onSelect(billboard)}>
        {billboard.name}
      </h5>

      {/* 3. Location info */}
      <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
        <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
        <span className="line-clamp-2">{billboard.district}, {billboard.city}</span>
      </div>

      {/* 4. Specifications */}
      <div className="flex flex-col gap-1 py-1.5 border-t border-b border-slate-100 dark:border-white/5 mb-2.5 text-[10px] text-slate-600 dark:text-neutral-300 font-semibold">
        <div className="flex items-center gap-1.5">
          <Maximize2 className="w-3 h-3 text-slate-400" />
          <span>Dimensi: {billboard.size} ({billboard.orientation})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3 h-3 text-slate-400" />
          <span>Penerangan: {billboard.lighting}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
          Hubungi untuk informasi harga
        </div>
        <a
          href={getWhatsAppLink(billboard.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 transition-colors"
        >
          <MessageSquare className="w-3 h-3" />
          WhatsApp
        </a>
      </div>

    </div>
  );
}
