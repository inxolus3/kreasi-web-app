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
const createCustomIcon = (isSelected: boolean) => {
  const colorClass = 'bg-brand';
  const pulseColorClass = 'bg-brand/80';
  const borderClass = 'border-brand/20 dark:border-brand-secondary/40';

  // Selection states: highlight with brand color ring
  const ringStyles = isSelected 
    ? 'ring-[3px] ring-brand dark:ring-brand-secondary scale-115 shadow-xl z-[999]' 
    : 'shadow-md';

  return L.divIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${borderClass} border-2 bg-white dark:bg-[#070B19] transition-all duration-300 ${ringStyles}">
        <span class="absolute w-2.5 h-2.5 rounded-full ${colorClass}"></span>
        ${isSelected ? `<span class="absolute w-2.5 h-2.5 rounded-full ${pulseColorClass} animate-ping opacity-75"></span>` : ''}
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
      const map = (markerRef.current as L.Marker & { _map?: L.Map })._map;
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
      icon={createCustomIcon(isSelected)}
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
