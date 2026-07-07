import { useState } from 'react';
import { TabType, Project } from '../types';
import { Filter, ArrowUpRight, Download, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LazyImage from './LazyImage';

interface PortfolioSectionProps {
  setActiveTab: (tab: TabType) => void;
}

export default function PortfolioSection({ setActiveTab }: PortfolioSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('SEMUA');

  const locations = ['SEMUA', 'BUKITTINGGI', 'AGAM', 'PADANG PANJANG', 'PAYAKUMBUH'];

  const projects: Project[] = [
    {
      id: 'p1',
      title: 'Yamaha Campaign',
      client: 'Yamaha Motor Sumatera',
      location: 'BUKITTINGGI',
      category: 'Billboard',
      image: 'https://picsum.photos/seed/p1/800/600',
      featured: true,
      stats: 'Daily Traffic: 25K+',
      desc: 'Kampanye promosi motor sport Yamaha di persimpangan padat bypass Belakang Balok Bukittinggi.'
    },
    {
      id: 'p2',
      title: 'Indosat Ooredoo Promotion',
      client: 'Indosat Ooredoo Hutchison',
      location: 'PADANG PANJANG',
      category: 'Spanduk',
      image: 'https://picsum.photos/seed/p2/800/600',
      featured: false,
      desc: 'Cetak dan pemasangan spanduk/reklame jalan raya serentak di 15 titik strategis Padang Panjang.'
    },
    {
      id: 'p3',
      title: 'Oxygen Denim Launch',
      client: 'Oxygen Apparel',
      location: 'AGAM',
      category: 'Billboard',
      image: 'https://picsum.photos/seed/p3/800/600',
      featured: true,
      stats: '15K+ Impressions/day',
      desc: 'Papan iklan ukuran raksasa di gerbang masuk Kabupaten Agam untuk koleksi kasual terbaru.'
    },
    {
      id: 'p4',
      title: 'Miss Glam Grand Opening',
      client: 'Miss Glam Beauty Indonesia',
      location: 'BUKITTINGGI',
      category: 'Neon Box',
      image: 'https://picsum.photos/seed/p4/800/600',
      featured: false,
      desc: 'Pembuatan neon box eksklusif dan balon promosi untuk peluncuran toko kecantikan termegah.'
    },
    {
      id: 'p5',
      title: 'Konvermex Health Series',
      client: 'Konvermex Farma',
      location: 'PAYAKUMBUH',
      category: 'Branding',
      image: 'https://picsum.photos/seed/p5/800/600',
      featured: true,
      stats: 'Long-term 12 months',
      desc: 'Branding total fasad ruko dan spanduk toko obat di jalur lintas Payakumbuh - Pekanbaru.'
    },
    {
      id: 'p6',
      title: 'Honda Motor Exhibition',
      client: 'Honda Hayati Pratama',
      location: 'AGAM',
      category: 'Spanduk',
      image: 'https://picsum.photos/seed/p6/800/600',
      featured: false,
      desc: 'Promosi event pameran motor matik baru dengan spanduk baliho semi-permanen.'
    },
    {
      id: 'p7',
      title: 'Telkomsel 5G Launch',
      client: 'Telkomsel Sumatera Barat',
      location: 'BUKITTINGGI',
      category: 'Neon Box',
      image: 'https://picsum.photos/seed/p7/800/600',
      featured: false,
      desc: 'Instalasi pilar reklame LED menyala di pusat kuliner malam Pasar Atas Bukittinggi.'
    },
    {
      id: 'p8',
      title: 'Kebab Turki Store Front',
      client: 'Kebab Turki Baba Rafi',
      location: 'PAYAKUMBUH',
      category: 'Branding',
      image: 'https://picsum.photos/seed/p8/800/600',
      featured: false,
      desc: 'Branding gerobak custom dan instalasi neon box penunjuk arah di depan outlet Payakumbuh.'
    }
  ];

  const filteredProjects = selectedLocation === 'SEMUA'
    ? projects
    : projects.filter(p => p.location === selectedLocation);

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPricelist = () => {
    alert('Katalog & Price List PDF berhasil disiapkan! Mengunduh dokumen penawaran...');
  };

  return (
    <div className="space-y-20 pb-20 font-sans" id="portfolio-section-container">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-slate-50 dark:bg-[#050813] py-16 transition-colors duration-300 border-b-2 border-slate-200 dark:border-white/10" id="portfolio-header-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            PROJECT_PORTFOLIO
          </span>
          <h1 className="text-4xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter" id="portfolio-title">
            PORTFOLIO PROYEK KAMI
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Membantu puluhan merek lokal dan nasional mendominasi pasar Sumatera Barat. Telusuri hasil pekerjaan riil kami yang dipasang dengan presisi di berbagai kota.
          </p>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="portfolio-filter-section">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b-2 border-slate-250 dark:border-white/10 pb-6">
          <div className="flex items-center gap-2 text-brand dark:text-brand-secondary font-mono font-black text-xs uppercase tracking-widest">
            <Filter className="w-4 h-4 shrink-0" />
            <span>Filter Wilayah:</span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center" id="location-filters">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 py-2 text-[10px] font-black font-mono tracking-[0.15em] transition-all duration-300 focus:outline-none rounded-none border cursor-pointer ${
                  selectedLocation === loc
                    ? 'bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 border-brand dark:border-brand-secondary'
                    : 'bg-slate-50 text-neutral-600 border-slate-200 hover:bg-slate-100 hover:text-brand dark:bg-neutral-900 dark:text-neutral-300 dark:border-white/10 dark:hover:bg-[#0c1226] dark:hover:text-brand-secondary dark:hover:border-brand-secondary'
                }`}
                id={`filter-${loc.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="portfolio-grid-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="portfolio-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 overflow-hidden group hover:border-brand dark:hover:border-brand-secondary hover:shadow-lg transition-all duration-300 flex flex-col justify-between rounded-none shadow-sm"
                id={`portfolio-card-${p.id}`}
              >
                <div>
                  <div className="relative overflow-hidden">
                    <LazyImage 
                      src={p.image} 
                      alt={p.title} 
                      aspectRatio="aspect-[4/3]"
                      className="rounded-none"
                    />
                    
                    {/* Category Overlay */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-brand text-white border border-white/10 text-[8px] font-mono font-black px-2.5 py-1 rounded-none uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span className="bg-brand-secondary text-slate-950 border border-black/10 text-[8px] font-mono font-black px-2.5 py-1 rounded-none uppercase tracking-wider">
                        {p.location}
                      </span>
                    </div>

                    {/* Stats Widget Overlay if featured */}
                    {p.featured && p.stats && (
                      <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-brand-secondary/40 text-brand-secondary backdrop-blur-sm text-[8px] font-mono font-black px-3 py-1.5 rounded-none flex items-center gap-1.5 shadow-md">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0 text-brand-secondary" />
                        {p.stats}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-2">
                    <p className="text-[9px] font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                      {p.client}
                    </p>
                    <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase leading-tight group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => handleNavClick('kontak')}
                    className="flex items-center gap-1.5 text-[10px] font-mono font-black tracking-widest text-brand hover:text-brand-hover dark:text-brand-secondary dark:hover:text-white uppercase cursor-pointer"
                    id={`portfolio-btn-${p.id}`}
                  >
                    BAHAS KAMPANYE SERUPA
                    <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. METRICS / STATS BANNER */}
      <section className="bg-brand text-white py-16 dark:bg-[#050813] border-y-2 border-brand/20 dark:border-white/10" id="portfolio-stats-banner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" id="portfolio-stats-grid">
            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl font-mono font-black text-brand-secondary">500+</span>
              <p className="text-[9px] sm:text-xs text-blue-100 dark:text-neutral-400 font-bold tracking-[0.2em] uppercase">PRODUK SELESAI</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl font-mono font-black text-brand-secondary">120+</span>
              <p className="text-[9px] sm:text-xs text-blue-100 dark:text-neutral-400 font-bold tracking-[0.2em] uppercase">BILLBOARD AKTIF</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl font-mono font-black text-brand-secondary">15+</span>
              <p className="text-[9px] sm:text-xs text-blue-100 dark:text-neutral-400 font-bold tracking-[0.2em] uppercase">TAHUN PENGALAMAN</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl font-mono font-black text-brand-secondary">100%</span>
              <p className="text-[9px] sm:text-xs text-blue-100 dark:text-neutral-400 font-bold tracking-[0.2em] uppercase">KEPUASAN KLIEN</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HERO CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="portfolio-cta-section">
        <div className="bg-brand text-white dark:bg-[#0c132a] border-l-8 border-brand-secondary rounded-none p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl" id="portfolio-cta-box">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

          <div className="space-y-3 max-w-xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tighter text-white dark:text-brand-secondary">
              INGIN PROYEK ANDA MENDOMINASI JALANAN?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-neutral-300 font-semibold leading-relaxed max-w-xl mx-auto">
              Dapatkan proposal penawaran titik baliho & billboard strategis terbaik lengkap dengan data estimasi lalu lintas jalan raya.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10" id="portfolio-cta-actions">
            <button
              onClick={() => handleNavClick('kontak')}
              className="bg-brand-secondary text-slate-950 hover:bg-[#e09b18] dark:bg-brand-secondary dark:text-slate-950 dark:hover:bg-white dark:hover:text-black font-mono font-black text-xs tracking-[0.2em] px-8 py-4 rounded-none transition-all duration-300 flex items-center gap-2 uppercase cursor-pointer border border-transparent shadow-xl"
              id="portfolio-cta-consult"
            >
              Mulai Konsultasi Sekarang
            </button>
            <button
              onClick={handleDownloadPricelist}
              className="bg-transparent hover:bg-white hover:text-brand dark:hover:bg-black dark:hover:text-brand-secondary dark:border-white/20 text-white dark:text-white border-2 border-white/20 font-mono font-black text-xs tracking-[0.2em] px-8 py-4 rounded-none transition-all duration-300 flex items-center gap-2 uppercase cursor-pointer"
              id="portfolio-cta-download"
            >
              <Download className="w-4 h-4 shrink-0" />
              Download Price List
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
