/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Billboard } from '../types';
import BillboardPopup from './BillboardPopup';

interface BillboardMarkerProps {
  billboard: Billboard;
  isSelected: boolean;
  onSelect: (billboard: Billboard) => void;
}

// Custom Leaflet DivIcon creator to avoid broken default marker image URLs in bundlers
const createCustomIcon = (status: Billboard['status'], isSelected: boolean) => {
  let colorClass = 'bg-emerald-500';
  let pulseColorClass = 'bg-emerald-400';
  let borderClass = 'border-emerald-200 dark:border-emerald-950';
  
  if (status === 'BOOKED') {
    colorClass = 'bg-rose-500';
    pulseColorClass = 'bg-rose-400';
    borderClass = 'border-rose-200 dark:border-rose-950';
  } else if (status === 'MAINTENANCE') {
    colorClass = 'bg-amber-500';
    pulseColorClass = 'bg-amber-400';
    borderClass = 'border-amber-200 dark:border-amber-950';
  } else if (status === 'INACTIVE') {
    colorClass = 'bg-slate-400';
    pulseColorClass = 'bg-slate-300';
    borderClass = 'border-slate-200 dark:border-slate-800';
  }

  // Selection states: highlight with brand color or secondary brand color ring
  const ringStyles = isSelected 
    ? 'ring-[3px] ring-brand dark:ring-brand-secondary scale-115 shadow-xl z-[999]' 
    : 'shadow-md';

  return L.divIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${borderClass} border-2 bg-white dark:bg-[#070B19] transition-all duration-300 ${ringStyles}">
        <span class="absolute w-2.5 h-2.5 rounded-full ${colorClass}"></span>
        ${status === 'AVAILABLE' || isSelected ? `<span class="absolute w-2.5 h-2.5 rounded-full ${pulseColorClass} animate-ping opacity-75"></span>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export default function BillboardMarker({ billboard, isSelected, onSelect }: BillboardMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  // Auto-open marker popup if selected from outside the map (e.g. sidebar cards)
  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
      // Center the map view on the selected marker
      const map = markerRef.current._map;
      if (map) {
        map.setView([billboard.latitude, billboard.longitude], 15, {
          animate: true,
          duration: 0.6
        });
      }
    }
  }, [isSelected, billboard.latitude, billboard.longitude]);

  return (
    <Marker
      ref={markerRef}
      position={[billboard.latitude, billboard.longitude]}
      icon={createCustomIcon(billboard.status, isSelected)}
      eventHandlers={{
        click: () => onSelect(billboard)
      }}
    >
      <Popup className="custom-leaflet-popup">
        <BillboardPopup billboard={billboard} onSelect={onSelect} />
      </Popup>
    </Marker>
  );
}
