/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Billboard } from '../types';
import { MapPin, Maximize2, Lightbulb, Navigation, Eye, X, Compass, CheckCircle, ChevronRight, ImageIcon, MessageSquare} from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface BillboardMapProps {
  billboards: Billboard[];
  selectedBillboard: Billboard | null;
  onSelectBillboard: (billboard: Billboard | null) => void;
  isDarkMode: boolean;
  center?: [number, number];
  zoom?: number;
}

// Utility to create custom marker icon
const createCustomIcon = (isSelected: boolean) => {
  const colorClass = 'bg-brand';
  const pulseColorClass = 'bg-brand/80';
  const borderClass = 'border-brand/20 dark:border-brand-secondary/40';

  const ringStyles = isSelected 
    ? 'ring-[4px] ring-brand dark:ring-brand-secondary scale-125 shadow-xl z-[999]' 
    : 'shadow-md scale-100 hover:scale-110';

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

// Map controller to handle programmatical centering, flying, and fit-bounds logic
function MapViewController({
  billboards,
  selectedBillboard,
  onSelectBillboard
}: {
  billboards: Billboard[];
  selectedBillboard: Billboard | null;
  onSelectBillboard: (billboard: Billboard | null) => void;
}) {
  const map = useMap();
  const prevBillboardsRef = useRef<string>('');

  useEffect(() => {
    if (selectedBillboard) {
      // Direct fly to selected marker
      map.setView([selectedBillboard.latitude, selectedBillboard.longitude], 15, {
        animate: true,
        duration: 0.8
      });
    } else if (billboards.length > 0) {
      // Dynamic fit bounds for filtered list
      const idsString = billboards.map(b => b.id).sort().join(',');
      if (prevBillboardsRef.current !== idsString) {
        prevBillboardsRef.current = idsString;
        const group = L.featureGroup(
          billboards.map(bb => L.marker([bb.latitude, bb.longitude]))
        );
        map.fitBounds(group.getBounds(), {
          padding: [50, 50],
          maxZoom: 15,
          animate: true,
          duration: 0.8
        });
      }
    }
  }, [selectedBillboard, billboards, map]);

  return null;
}

// Sub-component that registers markers in L.markerClusterGroup programmatically
function ClusteredMarkers({
  billboards,
  selectedBillboard,
  onSelect
}: {
  billboards: Billboard[];
  selectedBillboard: Billboard | null;
  onSelect: (billboard: Billboard) => void;
}) {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);
  const markersMapRef = useRef<{ [id: number]: L.Marker }>({});

  useEffect(() => {
    // Instantiate Marker Cluster Group once
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 40,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-brand/20 bg-brand/90 dark:bg-brand-secondary/90 text-white dark:text-slate-950 font-mono font-black text-xs shadow-lg transition-transform hover:scale-110">
                <span>${count}</span>
              </div>
            `,
            className: 'custom-cluster-icon',
            iconSize: [40, 40],
          });
        }
      });
      map.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();
    markersMapRef.current = {};

    // Generate markers
    billboards.forEach((bb) => {
      const isSel = selectedBillboard?.id === bb.id;
      const icon = createCustomIcon(isSel);
      const marker = L.marker([bb.latitude, bb.longitude], { icon });

      marker.on('click', () => {
        onSelect(bb);
      });

      markersMapRef.current[bb.id] = marker;
      clusterGroup.addLayer(marker);
    });

    return () => {
      // Clean up layer on component destroy if needed
    };
  }, [billboards, map, onSelect]);

  // Adjust marker styles when selectedBillboard state changes
  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup) return;

    billboards.forEach((bb) => {
      const marker = markersMapRef.current[bb.id];
      if (marker) {
        const isSel = selectedBillboard?.id === bb.id;
        marker.setIcon(createCustomIcon(isSel));
        if (isSel) {
          try {
            clusterGroup.zoomToShowLayer(marker, () => {
              // Smooth pan
            });
          } catch {
            // fallback
          }
        }
      }
    });
  }, [selectedBillboard, billboards]);

  return null;
}

export default function BillboardMap({
  billboards,
  selectedBillboard,
  onSelectBillboard,
  isDarkMode,
  center = [-0.305, 100.369], // Default Bukittinggi
  zoom = 13
}: BillboardMapProps) {
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // High fidelity tiles for elegant aesthetics
  const tileLayerUrl = isDarkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileLayerAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const getWhatsAppLink = (name: string) => {
    const text = `Halo Kreasi Advertising, saya tertarik dengan lokasi billboard ${name}. Apakah lokasi tersebut tersedia untuk disewa?`;
    return `https://wa.me/628116682226?text=${encodeURIComponent(text)}`;
  };

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  // Scroll smoothly to detail section below the map
  const handleScrollToDetail = () => {
    document.getElementById('selected-billboard-detail')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full relative" id="billboard-interactive-map-wrapper">
      
      {/* 1. Leaflet Map Element */}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px] md:min-h-0"
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution={tileLayerAttribution}
          url={tileLayerUrl}
        />
        
        {/* Render programmatically clustered markers */}
        <ClusteredMarkers
          billboards={billboards}
          selectedBillboard={selectedBillboard}
          onSelect={onSelectBillboard}
        />

        {/* Adjust center/bounds dynamically */}
        <MapViewController
          billboards={billboards}
          selectedBillboard={selectedBillboard}
          onSelectBillboard={onSelectBillboard}
        />
      </MapContainer>

      {/* 2. DESKTOP: Floating Popup Card (Right Side Overlay) */}
      {selectedBillboard && (
        <div 
          className="absolute right-4 top-4 bottom-4 w-80 bg-white/95 dark:bg-[#070B19]/95 backdrop-blur-md shadow-2xl z-[10] border border-slate-200/80 dark:border-white/10 p-5 hidden md:flex flex-col justify-between overflow-y-auto"
          id={`desktop-map-popup-${selectedBillboard.id}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="font-mono text-[10px] font-black text-brand dark:text-brand-secondary uppercase tracking-widest block mb-0.5">
                {selectedBillboard.type}
              </span>
            </div>
            <button
              onClick={() => onSelectBillboard(null)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup panel"
              id="btn-close-desktop-popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Gallery / Thumbnail */}
          <div className="mb-3.5 flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
            {selectedBillboard.gallery && selectedBillboard.gallery.length > 0 ? (
              selectedBillboard.gallery.slice(0, 3).map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative aspect-square w-1/3 shrink-0 overflow-hidden bg-slate-100 border border-slate-100 dark:border-white/5 shadow-sm cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`${selectedBillboard.name} - ${idx}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-[16/10] bg-slate-100 dark:bg-[#0E1528] flex flex-col items-center justify-center text-slate-400 dark:text-neutral-500 border border-slate-200 dark:border-white/5">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tidak Ada Foto</span>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tight mb-1.5 line-clamp-2">
              {selectedBillboard.name}
            </h4>
            <div className="inline-block mb-1.5 text-[9px] font-black uppercase tracking-wider bg-brand/10 text-brand px-1.5 py-0.5">
              {selectedBillboard.type}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium mb-3 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
              <span className="line-clamp-2">{selectedBillboard.district}, {selectedBillboard.city}</span>
            </p>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 gap-2.5 border-t border-b border-slate-100 dark:border-white/5 py-3 mb-4 text-[10px] text-slate-600 dark:text-neutral-300 font-bold">
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Dimensi: {selectedBillboard.size}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-slate-400" />
                <span>Lampu: {selectedBillboard.lighting}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Lalu Lintas: {selectedBillboard.traffic || 'Sedang'}</span>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-150 dark:border-white/5 flex flex-col gap-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Hubungi untuk informasi harga
            </div>
            <a
              href={getWhatsAppLink(selectedBillboard.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 py-3 px-3 text-[10px] font-black uppercase tracking-widest transition-opacity"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a
              href={getDirectionsUrl(selectedBillboard.latitude, selectedBillboard.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1 border border-slate-250 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 py-2 px-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white transition-colors"
              id="btn-maps-desktop"
            >
              <Navigation className="w-3 h-3" />
              Rute Peta
            </a>
          </div>
        </div>
      )}

      {/* 3. MOBILE: Bottom Sheet (Bottom Overlay on Mobile) */}
      {selectedBillboard && (
        <div 
          className="absolute bottom-0 left-0 right-0 max-h-[75%] bg-white dark:bg-[#070B19] rounded-t-2xl shadow-2xl z-[10] border-t border-slate-200/80 dark:border-white/10 p-5 flex md:hidden flex-col justify-between overflow-y-auto"
          id={`mobile-map-popup-${selectedBillboard.id}`}
        >
          {/* Draggable Indicator visual bar */}
          <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-4 shrink-0" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3 shrink-0">
            <div>
              <span className="font-mono text-[10px] font-black text-brand dark:text-brand-secondary uppercase tracking-widest block mb-0.5">
                {selectedBillboard.type}
              </span>
            </div>
            <button
              onClick={() => onSelectBillboard(null)}
              className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup panel"
              id="btn-close-mobile-popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Info Columns */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 overflow-y-auto mb-4">
            {/* Image Column */}
            <div className="w-full sm:w-1/3 aspect-[16/10] sm:aspect-square flex gap-1 overflow-x-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
              {selectedBillboard.gallery && selectedBillboard.gallery.length > 0 ? (
                selectedBillboard.gallery.map((img, idx) => (
                  <div 
                    key={idx}
                    className="relative aspect-square w-1/2 sm:w-full shrink-0 overflow-hidden bg-slate-100 border border-slate-150 dark:border-white/5 rounded cursor-pointer"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={img}
                      alt={`${selectedBillboard.name} - ${idx}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))
              ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-[#0E1528] flex flex-col items-center justify-center text-slate-400 border border-slate-200 dark:border-white/5 rounded">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Tidak Ada Foto</span>
                </div>
              )}
            </div>

            {/* Specs / Desc Column */}
            <div className="flex-1">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tight mb-2">
                {selectedBillboard.name}
              </h4>
              <div className="inline-block mb-1.5 text-[9px] font-black uppercase tracking-wider bg-brand/10 text-brand px-1.5 py-0.5">
                {selectedBillboard.type}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium mb-3 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>{selectedBillboard.address}</span>
              </p>

              {/* Grid specs */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-neutral-300 font-bold border-t border-b border-slate-100 dark:border-white/5 py-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dimensi: {selectedBillboard.size}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lampu: {selectedBillboard.lighting}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Arus Jalan: {selectedBillboard.traffic || 'Sedang'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-150 dark:border-white/5 flex flex-col gap-3 shrink-0">
            <a
              href={getWhatsAppLink(selectedBillboard.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 py-3 px-3 text-[10px] font-black uppercase tracking-widest transition-opacity"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            <a
              href={getDirectionsUrl(selectedBillboard.latitude, selectedBillboard.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1 border border-slate-250 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 py-2.5 px-3 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white transition-colors"
              id="btn-maps-mobile"
            >
              <Navigation className="w-3 h-3" />
              Petunjuk Rute
            </a>
          </div>
        </div>
      )}

      {selectedBillboard?.gallery && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={selectedBillboard.gallery.map(src => ({ src }))}
        />
      )}

    </div>
  );
}
