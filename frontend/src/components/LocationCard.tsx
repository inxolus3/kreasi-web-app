/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Billboard } from '../types';
import LazyImage from './LazyImage';
import { MapPin, Maximize2, Lightbulb, MessageSquare, ExternalLink } from 'lucide-react';

interface LocationCardProps {
  billboard: Billboard;
  isSelected: boolean;
  onSelect: (billboard: Billboard) => void;
  onFocusMap?: (billboard: Billboard) => void;
}

export default function LocationCard({ billboard, isSelected, onSelect, onFocusMap }: LocationCardProps) {
  const getWhatsAppLink = (name: string) => {
    const text = `Halo Kreasi Advertising, saya tertarik dengan lokasi billboard ${name}. Apakah lokasi tersebut tersedia untuk disewa?`;
    return `https://wa.me/628116682226?text=${encodeURIComponent(text)}`;
  };

  const hasThumbnail = !!billboard.thumbnail;
  const imageSrc = hasThumbnail ? billboard.thumbnail! : 'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&q=80&w=600';

  return (
    <div 
      className={`group bg-white dark:bg-[#070B19] border transition-all duration-300 flex flex-col h-full rounded-none overflow-hidden ${
        isSelected 
          ? 'border-brand dark:border-brand-secondary ring-1 ring-brand dark:ring-brand-secondary shadow-lg' 
          : 'border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 hover:shadow-md'
      }`}
      id={`billboard-card-${billboard.id}`}
    >
      {/* 1. Thumbnail / Status Block */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onSelect(billboard)} id={`billboard-thumb-${billboard.id}`}>
        <LazyImage 
          src={imageSrc} 
          alt={billboard.name} 
          aspectRatio="aspect-[4/3]"
          className="group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Detail Body */}
      <div className="p-5 flex-grow flex flex-col justify-between" id={`billboard-body-${billboard.id}`}>
        
        <div>
          {/* Title & Location Header */}
          <div className="mb-4">
            <h4 
              onClick={() => onSelect(billboard)}
              className="text-sm font-black tracking-tight text-slate-800 dark:text-white group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors duration-300 line-clamp-2 cursor-pointer leading-tight mb-2"
              id={`billboard-title-${billboard.id}`}
            >
              {billboard.name}
            </h4>
            <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-neutral-400" id={`billboard-loc-${billboard.id}`}>
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
              <span className="line-clamp-2">
                {billboard.district}, {billboard.city}
              </span>
            </div>
          </div>

          {/* Quick Technical Specs Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4 border-t border-b border-slate-100 dark:border-white/5 mb-4 text-xs font-medium" id={`billboard-specs-${billboard.id}`}>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 shrink-0" />
              <span className="text-slate-600 dark:text-neutral-300 truncate">
                {billboard.size} ({billboard.orientation})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 shrink-0" />
              <span className="text-slate-600 dark:text-neutral-300 truncate">
                {billboard.type} - {billboard.lighting}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Pricing and Bottom CTA Row */}
        <div>
          <div className="mb-4" id={`billboard-contact-${billboard.id}`}>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500 mb-0.5">
              Hubungi untuk informasi harga
            </div>
            <a
              href={getWhatsAppLink(billboard.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 rounded-none"
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2" id={`billboard-actions-${billboard.id}`}>
            {/* Action 1: Focus/Detail Select */}
            <button
              onClick={() => {
                onSelect(billboard);
                if (onFocusMap) onFocusMap(billboard);
              }}
              className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-white/10 px-3 py-2.5 text-[9px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-300 transition-colors focus:outline-none cursor-pointer"
              id={`detail-btn-${billboard.id}`}
            >
              Fokus Peta
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* Action 2: WA Contact */}
            <a
              href={getWhatsAppLink(billboard.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-hover dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover text-white dark:text-slate-950 px-3 py-2.5 text-[9px] font-black uppercase tracking-wider transition-colors"
              id={`wa-btn-${billboard.id}`}
            >
              <MessageSquare className="w-3 h-3" />
              Tanya Sewa
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
