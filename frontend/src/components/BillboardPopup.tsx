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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusLabel = (status: Billboard['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Tersedia</span>;
      case 'BOOKED':
        return <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20">Disewa</span>;
      case 'MAINTENANCE':
        return <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">Perawatan</span>;
      default:
        return <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-500/10 text-slate-500 border border-slate-500/20">Tidak Aktif</span>;
    }
  };

  const text = `Halo Kreasi Advertising, saya tertarik dengan lokasi Billboard Kode [${billboard.code}] - ${billboard.name}. Apakah lokasi tersebut tersedia untuk disewa?`;
  const whatsappUrl = `https://wa.me/628116682226?text=${encodeURIComponent(text)}`;

  return (
    <div className="w-60 p-1 flex flex-col font-sans text-slate-800 dark:text-neutral-100" id={`popup-container-${billboard.id}`}>
      
      {/* 1. Header with code & status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-black tracking-wider uppercase text-brand dark:text-brand-secondary">
          {billboard.code}
        </span>
        {getStatusLabel(billboard.status)}
      </div>

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
          <span>Dimensi: {billboard.width}x{billboard.height} m ({billboard.orientation})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3 h-3 text-slate-400" />
          <span>Penerangan: {billboard.lighting}</span>
        </div>
      </div>

      {/* 5. Pricing & CTA */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500">Tarif Sewa</span>
          <span className="text-xs font-black text-slate-900 dark:text-brand-secondary">{formatPrice(billboard.price)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelect(billboard)}
            className="px-2 py-1 text-[8px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
          >
            Pilih
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 px-2 py-1 text-[8px] font-black uppercase tracking-wider bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 transition-colors"
          >
            <MessageSquare className="w-2.5 h-2.5" />
            WA
          </a>
        </div>
      </div>

    </div>
  );
}
