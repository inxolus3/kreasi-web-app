/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Billboard } from '../types';
import { billboardApi } from '../api/billboard.api';
import {
  usePublicBillboards,
  useBillboardDetail,
  useBillboardCities,
  useBillboardTypes,
  useBillboardLightings,
} from '../api/hooks/useBillboards';
import SearchBox from './SearchBox';
import FilterBar from './FilterBar';
import LocationCard from './LocationCard';
const BillboardMap = lazy(() => import('./BillboardMap'));
import LazyImage from './LazyImage';
import ErrorState from './ErrorState';
import Skeleton, { LocationCardSkeleton } from './Skeleton';
import { 
  MapPin, Maximize2, Lightbulb, MessageSquare, Compass, 
  HelpCircle, ArrowUpRight, CheckCircle2, Navigation, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LocationsSectionProps {
  isDarkMode: boolean;
}

export default function LocationsSection({ isDarkMode }: LocationsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // TanStack Query to fetch all public billboards
  const { data: billboardsData, isLoading, isError, refetch } = usePublicBillboards();

  const { data: citiesData } = useQuery({
    queryKey: ['billboards', 'cities'],
    queryFn: () => billboardApi.getCities(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: typesData } = useQuery({
    queryKey: ['billboards', 'types'],
    queryFn: () => billboardApi.getTypes(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: lightingsData } = useQuery({
    queryKey: ['billboards', 'lightings'],
    queryFn: () => billboardApi.getLightings(),
    staleTime: 10 * 60 * 1000,
  });

  const billboards = useMemo(() => billboardsData?.data || [], [billboardsData]);

  // Handle setting initial selected billboard slug
  useEffect(() => {
    if (billboards.length > 0 && !selectedSlug) {
      setSelectedSlug(billboards[0].slug);
    }
  }, [billboards, selectedSlug]);

  // TanStack Query to fetch selected billboard detail by slug
  const { data: detailData, isLoading: isDetailLoading, isError: isDetailError } = useQuery({
    queryKey: ['billboardDetail', selectedSlug],
    queryFn: () => billboardApi.getBillboardBySlug(selectedSlug!),
    enabled: !!selectedSlug,
  });

  const selectedBillboard = detailData?.data || null;

  // Dynamic filter lists
  const cities = useMemo(() => citiesData?.data || [], [citiesData]);
  const types = useMemo(() => typesData?.data || [], [typesData]);
  const lightings = useMemo(() => lightingsData?.data || [], [lightingsData]);

  // Handle dynamic filtering logic
  const filteredBillboards = useMemo(() => {
    return billboards.filter((bb) => {
      const matchesSearch = 
        bb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bb.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bb.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bb.district.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = selectedCity ? bb.city === selectedCity : true;
      const matchesType = selectedType ? bb.type === selectedType : true;
      const matchesLighting = selectedLighting ? bb.lighting === selectedLighting : true;

      return matchesSearch && matchesCity && matchesType && matchesLighting;
    });
  }, [billboards, searchQuery, selectedCity, selectedType, selectedLighting]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedLighting('');
    if (filteredBillboards.length > 0) {
      setSelectedSlug(filteredBillboards[0].slug);
    }
  };

  // Select billboard details
  const handleSelectBillboard = (billboard: Billboard) => {
    setSelectedSlug(billboard.slug);
    setActiveImageIndex(0);
  };

  // Google Maps Directions link
  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const getWhatsAppDetailLink = (bb: Billboard) => {
    const text = `Halo Kreasi Advertising, saya tertarik menyewa Billboard - ${bb.name} yang berlokasi di ${bb.address}. Bolehkah saya berkonsultasi mengenai ketersediaan dan detail harga sewanya?`;
    return `https://wa.me/628116682226?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-slate-50 dark:bg-[#070B19] transition-colors duration-300" id="locations-section-wrapper">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-16 dark:border-white/5 dark:bg-dark-bg sm:py-24" id="locations-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-10 dark:opacity-20 pointer-events-none">
          <Compass className="w-96 h-96 animate-spin-slow text-brand dark:text-brand-secondary shrink-0" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary mb-6 border border-brand/10 dark:border-brand-secondary/20 rounded-none">
              <Compass className="w-3.5 h-3.5" />
              Peta Jaringan Reklame
            </span>
            <h1 className="font-mono text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl uppercase leading-[0.95]" id="locations-title">
              Lokasi <span className="text-brand dark:text-brand-secondary">Billboard</span> Strategis
            </h1>
            <p className="mt-6 text-base font-medium leading-relaxed text-slate-500 dark:text-neutral-400 max-w-2xl">
              Telusuri titik-titik media luar ruang terbaik kami di Bukittinggi, Agam, Padang Panjang, dan seluruh wilayah Sumatera Barat. Dapatkan visibilitas 24/7 di persimpangan protokol dengan volume kendaraan tertinggi.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="search-filter-section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-4 md:p-5 flex items-center shadow-sm">
            <SearchBox value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="lg:col-span-2">
            <FilterBar 
              cities={cities}
              types={types}
              lightings={lightings}
              selectedCity={selectedCity}
              selectedType={selectedType}
              selectedLighting={selectedLighting}
              onCityChange={setSelectedCity}
              onTypeChange={setSelectedType}
              onLightingChange={setSelectedLighting}
              onReset={handleResetFilters}
              totalCount={billboards.length}
              filteredCount={filteredBillboards.length}
            />
          </div>
        </div>
      </section>

      {/* 3. SPLIT MAP AND CONTENT WORKSPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="locations-workspace">
        {isError ? (
          <ErrorState message="Gagal memuat daftar lokasi billboard dari server." onRetry={refetch} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Skeletons for map/details and list */}
            <div className="lg:col-span-7 flex flex-col gap-6" id="map-and-details-column-skeleton">
              <Skeleton className="h-[450px] md:h-[500px] w-full" />
              <div className="bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-6 flex flex-col md:flex-row gap-6">
                <Skeleton className="w-full md:w-[45%] aspect-[4/3]" />
                <div className="w-full md:w-[55%] space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4" id="billboards-list-column-skeleton">
              <div className="h-6 w-1/3 mb-2 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              <LocationCardSkeleton />
              <LocationCardSkeleton />
              <LocationCardSkeleton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* A. MAP LAYER AND DETAIL CARD CONTAINER (Left Column: 7/12 width) */}
          <div className="lg:col-span-12 flex flex-col gap-12" id="map-and-details-column">
            
            {/* Interactive Map Wrapper */}
            <div className="h-[450px] md:h-[500px] w-full bg-slate-200 dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 shadow-md overflow-hidden relative">
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#070B19] gap-3">
                  <Compass className="w-10 h-10 animate-spin-slow text-brand dark:text-brand-secondary" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">Memuat Peta Interaktif...</span>
                </div>
              }>
                <BillboardMap 
                  billboards={filteredBillboards}
                  selectedBillboard={selectedBillboard}
                  onSelectBillboard={handleSelectBillboard}
                  isDarkMode={isDarkMode}
                />
              </Suspense>
              
              {filteredBillboards.length === 0 && (
                <div className="absolute inset-0 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                  <HelpCircle className="w-12 h-12 text-rose-500 mb-3" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">
                    Tidak Ada Lokasi Cocok
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-xs">
                    Coba sesuaikan pencarian atau bersihkan filter di atas untuk menampilkan semua titik billboard.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 border border-brand text-brand dark:border-brand-secondary dark:text-brand-secondary px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white dark:hover:bg-brand-secondary dark:hover:text-slate-950 transition-all cursor-pointer"
                  >
                    Tampilkan Semua
                  </button>
                </div>
              )}
            </div>

            {/* Selected Billboard Detailed Panel */}
            <AnimatePresence mode="wait">
              {selectedBillboard && (
                <motion.div
                  key={selectedBillboard.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-dark-bg border border-slate-200/80 dark:border-white/5 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8"
                  id="selected-billboard-detail"
                >
                  {/* Gallery/Photo column (45%) */}
                  <div className="w-full md:w-[45%] flex flex-col gap-2">
                    <div className="relative overflow-hidden border border-slate-100 dark:border-white/5">
                      <LazyImage
                        src={selectedBillboard.gallery[activeImageIndex] || selectedBillboard.thumbnail || 'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?auto=format&fit=crop&q=80&w=600'}
                        alt={selectedBillboard.name}
                        aspectRatio="aspect-[4/3]"
                      />
                    </div>
                    {/* Small Gallery Thumbnails */}
                    {selectedBillboard.gallery.length > 1 && (
                      <div className="flex gap-2" id="gallery-thumbnails">
                        {selectedBillboard.gallery.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-16 h-12 border cursor-pointer focus:outline-none transition-all ${
                              activeImageIndex === idx 
                                ? 'border-brand dark:border-brand-secondary scale-105' 
                                : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specification/Detail descriptions column (55%) */}
                  <div className="w-full md:w-[55%] flex flex-col justify-between">
                    <div>
                      {/* Badge / Code Row */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-brand dark:text-brand-secondary bg-brand/5 dark:bg-brand-secondary/10 border border-brand/10 dark:border-brand-secondary/20 px-2 py-0.5">
                          {selectedBillboard.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
                        {selectedBillboard.name}
                      </h3>

                      {/* Detailed address */}
                      <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-neutral-400 mb-4">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{selectedBillboard.address}</span>
                      </div>

                      {/* Description Paragraph */}
                      {selectedBillboard.description && (
                        <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium leading-relaxed mb-6">
                          {selectedBillboard.description}
                        </p>
                      )}

                      {/* Tech Specs Block */}
                      <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-white/5 py-4 mb-6">
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-neutral-500 text-[10px] font-black uppercase tracking-wider mb-1">
                            <Maximize2 className="w-3.5 h-3.5" />
                            Dimensi & Orientasi
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                            {selectedBillboard.size} ({selectedBillboard.orientation})
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-neutral-500 text-[10px] font-black uppercase tracking-wider mb-1">
                            <Lightbulb className="w-3.5 h-3.5" />
                            Tipe & Pencahayaan
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                            {selectedBillboard.type} - {selectedBillboard.lighting}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-neutral-500 text-[10px] font-black uppercase tracking-wider mb-1">
                            <Eye className="w-3.5 h-3.5" />
                            Kepadatan Arus Lalu Lintas
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                            {selectedBillboard.traffic}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={getDirectionsUrl(selectedBillboard.latitude, selectedBillboard.longitude)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-white transition-colors cursor-pointer"
                        id="btn-directions"
                      >
                        <Navigation className="w-4 h-4" />
                        Rute Petunjuk Jalan
                      </a>
                      <a
                        href={getWhatsAppDetailLink(selectedBillboard)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover text-white dark:text-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors"
                        id="btn-rent-whatsapp"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Ajukan Sewa Lokasi
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>


        </div>
        )}
      </section>

      {/* 4. CALL-TO-ACTION AND SERVICE STANDARDS */}
      <section className="bg-white dark:bg-dark-bg border-t border-b border-slate-200/80 dark:border-white/5 py-16" id="locations-cta-standards">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Grid of Corporate Quality Benchmarks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="flex gap-4">
              <div className="bg-brand/5 dark:bg-brand-secondary/10 border border-brand/15 dark:border-brand-secondary/15 p-3 h-fit text-brand dark:text-brand-secondary shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">Legalitas & Izin Resmi</h4>
                <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">Seluruh titik reklame kami mengantongi perizinan resmi dari pemerintah daerah (PPRD/DPMTSP) dan jaminan kepatuhan pajak daerah 100% aman.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-brand/5 dark:bg-brand-secondary/10 border border-brand/15 dark:border-brand-secondary/15 p-3 h-fit text-brand dark:text-brand-secondary shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">Konstruksi Standar PU</h4>
                <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">Kekuatan tiang baja utama bersertifikat PU, dilapisi cat anti karat kelas industri, dan pondasi beton bertulang yang teruji tahan angin kencang.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-brand/5 dark:bg-brand-secondary/10 border border-brand/15 dark:border-brand-secondary/15 p-3 h-fit text-brand dark:text-brand-secondary shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-2">Asuransi & Maintenance</h4>
                <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">Dukungan jaminan asuransi pihak ketiga bagi keselamatan publik serta tim teknis siaga 24 jam untuk pemeliharaan rutin penerangan sorot LED.</p>
              </div>
            </div>
          </div>

          {/* CTA Banner Area */}
          <div className="relative bg-slate-950 text-white py-12 px-8 md:px-16 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8" id="cta-block">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="relative max-w-xl">
              <h3 className="font-mono text-xl md:text-2xl font-black uppercase tracking-tight mb-2">
                Punya Lahan Strategis di Sumatera Barat?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Kerjasamakan kepemilikan titik lahan strategis Anda bersama kami. Kami menawarkan pembagian hasil sewa menarik, pengelolaan reklame profesional, dan penanganan urusan izin formal 100% rapi.
              </p>
            </div>
            <div className="relative shrink-0">
              <a
                href="https://wa.me/628116682226?text=Halo%20Kreasi%20Advertising%2C%20saya%20tertarik%20mengajukan%20penawaran%20kerjasama%20lahan%20lokasi%20titik%20billboard."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-secondary hover:bg-brand-secondary-hover text-slate-950 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-colors shadow-lg"
              >
                Hubungi Kerjasama WA
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
