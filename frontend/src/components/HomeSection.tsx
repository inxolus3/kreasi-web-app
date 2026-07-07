/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabType } from '../types';
import { ArrowRight, Trophy, Database, Layers, CheckCircle2, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import LazyImage from './LazyImage';
import TestimonialSection from './TestimonialSection';
import FAQSection from './FAQSection';
import ProjectHighlights from './ProjectHighlights';

interface HomeSectionProps {
  setActiveTab: (tab: TabType) => void;
}

export default function HomeSection({ setActiveTab }: HomeSectionProps) {
  // Client logos and campaign photos list
  const clients = [
    { 
      name: 'YAMAHA MOTOR', 
      logoText: 'YMH',
      themeColor: '#e10613',
      photo: 'https://picsum.photos/seed/yamaha_b/300/200',
      industry: 'Automotive'
    },
    { 
      name: 'INDOSAT OOREDOO', 
      logoText: 'INDST',
      themeColor: '#ffcc00',
      photo: 'https://picsum.photos/seed/indosat_b/300/200',
      industry: 'Telecommunication'
    },
    { 
      name: 'MISS GLAM', 
      logoText: 'GLAM',
      themeColor: '#ec4899',
      photo: 'https://picsum.photos/seed/missglam_b/300/200',
      industry: 'Cosmetics'
    },
    { 
      name: 'OXYGEN DENIM', 
      logoText: 'OXYG',
      themeColor: '#3b82f6',
      photo: 'https://picsum.photos/seed/oxygen_b/300/200',
      industry: 'Fashion'
    },
    { 
      name: 'PEMKAB AGAM', 
      logoText: 'AGAM',
      themeColor: '#10b981',
      photo: 'https://picsum.photos/seed/agam_b/300/200',
      industry: 'Government'
    },
    { 
      name: 'TELKOMSEL', 
      logoText: 'TSEL',
      themeColor: '#ef4444',
      photo: 'https://picsum.photos/seed/telkomsel_b/300/200',
      industry: 'Telecommunication'
    },
    { 
      name: 'BANK NAGARI', 
      logoText: 'NGR',
      themeColor: '#2563eb',
      photo: 'https://picsum.photos/seed/banknagari/300/200',
      industry: 'Banking'
    }
  ];

  // Values list
  const values = [
    {
      num: '01',
      title: 'Desain yang Menghasilkan',
      description: 'Kami tidak hanya membuat visual cantik, kami menciptakan komunikasi visual yang mendorong konversi dan kesadaran brand tinggi.'
    },
    {
      num: '02',
      title: 'Strategi Berbasis Data',
      description: 'Penempatan titik iklan kami didasarkan pada analisis traffic dan demografi audiens yang akurat di wilayah Bukittinggi dan sekitarnya.'
    },
    {
      num: '03',
      title: 'Eksekusi Skala Besar',
      description: 'Mampu menangani kampanye promosi dalam skala masif dengan ketepatan waktu dan kualitas material luar ruang yang terjamin prima.'
    }
  ];

  // Highlights of major services
  const services = [
    {
      title: 'Billboard & Baligo',
      desc: 'Papan iklan ukuran besar di titik strategis dengan visibilitas 24/7 untuk dampak promosi maksimal di jalanan protokol.',
      image: '/src/assets/images/billboard_hero_1782888227235.jpg',
      badge: 'POPULAR'
    },
    {
      title: 'Spanduk / Banner',
      desc: 'Solusi promosi cepat dan fleksibel dengan kualitas cetak premium yang tahan segala cuaca ekstrem di Sumatera Barat.',
      image: '/src/assets/images/banner_printing_1782888242213.jpg',
      badge: 'TERCEPAT'
    },
    {
      title: 'Neon Box & Signage',
      desc: 'Identitas visual yang menonjol di malam hari dengan pencahayaan LED hemat energi yang terang, tajam, dan elegan.',
      image: '/src/assets/images/neon_box_sign_1782888258089.jpg',
      badge: 'PRESTIGE'
    }
  ];

  // Recent project previews
  const recentProjects = [
    {
      client: 'YAMAHA MOTOR',
      title: 'BIG CAMPAIGN 2024',
      badge: 'Billboard',
      image: 'https://picsum.photos/seed/yamaha/800/600'
    },
    {
      client: 'PEMKAB AGAM',
      title: 'REGION EXPANSION',
      badge: 'Spanduk / Baliho',
      image: 'https://picsum.photos/seed/agam/800/600'
    },
    {
      client: 'MISS GLAM',
      title: 'STORE LAUNCH BUKITTINGGI',
      badge: 'Neon Box',
      image: 'https://picsum.photos/seed/missglam/800/600'
    },
    {
      client: 'OXYGEN DENIM',
      title: 'HOME CONNECTIVITY CAMPAIGN',
      badge: 'Branding Toko',
      image: 'https://picsum.photos/seed/oxygen/800/600'
    }
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-20 font-sans" id="home-section-container">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-dark-bg border-b-2 border-slate-200 dark:border-white/15 py-16 lg:py-24 transition-colors duration-350 bg-grid-pattern" id="hero-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-8" id="hero-left-col">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand/20 dark:border-brand-secondary/30 text-brand dark:text-brand-secondary text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded-none bg-white dark:bg-dark-bg" id="hero-badge">
                <span className="w-2 h-2 bg-brand dark:bg-brand-secondary animate-ping"></span>
                EST. 2024 / BUKITTINGGI
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black tracking-tighter text-slate-950 dark:text-white leading-[0.9] uppercase" id="hero-title">
                  SOLUSI PERIKLANAN <br />
                  <span className="dark-stroke-only" id="hero-title-stroke-span">LUAR RUANG</span> <br />
                  <span className="text-brand dark:text-brand-secondary">TERBAIK.</span>
                </h1>
                
                {/* Visual stats mini widget */}
                <div className="grid grid-cols-3 gap-4 border-y-2 border-brand/15 dark:border-white/10 py-8 font-mono" id="hero-stats-row">
                  <div className="text-center sm:text-left border-r border-brand/10 dark:border-white/5 pr-2">
                    <p className="text-3xl sm:text-5xl font-black text-brand dark:text-brand-secondary tracking-tight">450+</p>
                    <p className="text-[9px] text-neutral-500 dark:text-neutral-400 tracking-[0.15em] font-black mt-1">PROJECT SELESAI</p>
                  </div>
                  <div className="text-center sm:text-left border-r border-brand/10 dark:border-white/5 px-2">
                    <p className="text-3xl sm:text-5xl font-black text-brand dark:text-brand-secondary tracking-tight">15+</p>
                    <p className="text-[9px] text-neutral-500 dark:text-neutral-400 tracking-[0.15em] font-black mt-1">TITIK STRATEGIS</p>
                  </div>
                  <div className="text-center sm:text-left pl-2">
                    <p className="text-3xl sm:text-5xl font-black text-brand dark:text-brand-secondary tracking-tight">100%</p>
                    <p className="text-[9px] text-neutral-500 dark:text-neutral-400 tracking-[0.15em] font-black mt-1">KEPUASAN KLIEN</p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl" id="hero-description">
                  Meningkatkan jangkauan bisnis Anda melalui media promosi strategis dan berkualitas di jantung Sumatera Barat. Pastikan pesan Anda tersampaikan dengan dampak visual luar biasa.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4" id="hero-cta-group">
                <button
                  onClick={() => handleNavClick('layanan')}
                  className="bg-brand hover:bg-brand-hover text-white dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:text-slate-950 font-black px-8 py-4.5 transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase text-[11px] tracking-[0.2em] rounded-none shadow-lg border border-transparent dark:border-brand-secondary/20"
                  id="hero-btn-layanan"
                >
                  Pelajari Layanan Kami
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <button
                  onClick={() => handleNavClick('kontak')}
                  className="bg-transparent hover:bg-brand/5 border-2 border-brand text-brand dark:text-white dark:border-white/20 dark:hover:bg-white/5 font-black px-8 py-4.5 transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase text-[11px] tracking-[0.2em] rounded-none"
                  id="hero-btn-konsultasi"
                >
                  Konsultasi Gratis
                </button>
              </div>
            </div>

            {/* Right Column: Hero Graphic Framed */}
            <div className="lg:col-span-5 flex justify-center" id="hero-right-col">
              <div className="relative max-w-md w-full">
                {/* Structural Offset shadow element */}
                <div className="absolute top-4 left-4 w-full h-full border-2 border-brand/20 dark:border-brand-secondary/30 pointer-events-none z-0"></div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative z-10 p-2 bg-white dark:bg-dark-bg border-2 border-slate-300 dark:border-white/10 w-full shadow-2xl rounded-none"
                  id="hero-image-frame"
                >
                  <LazyImage
                    src="/src/assets/images/billboard_hero_1782888227235.jpg"
                    alt="Kreasi Billboard Hero"
                    aspectRatio="aspect-[4/5]"
                    className="rounded-none"
                  />
                  
                  {/* Overlay Floating Tag */}
                  <div className="absolute -bottom-4 -left-4 bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 px-5 py-3.5 shadow-xl flex items-center gap-2.5 font-mono font-black text-[10px] tracking-widest uppercase rounded-none border border-white/10 dark:border-black/10" id="hero-overlay-widget">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-secondary dark:text-brand" />
                    <span>PRESTISIUS & STRATEGIS</span>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CLIENT LOGO MARQUEE */}
      <section className="bg-slate-950 dark:bg-black py-12 overflow-hidden border-y border-slate-200 dark:border-white/10" id="clients-marquee-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-mono tracking-[0.25em] text-brand-secondary uppercase mb-8 font-black">
            DIPERCAYA OLEH BRAND TERKEMUKA & MITRA STRATEGIS
          </p>
          
          <div className="relative w-full overflow-hidden py-2" id="marquee-viewport">
            {/* Soft fade gradients for a smoother transition on edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent dark:from-black z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent dark:from-black z-10 pointer-events-none"></div>
            
            {/* The sliding marquee track */}
            <div className="animate-marquee flex gap-6 items-center" id="marquee-track">
              {/* Set 1 */}
              {clients.map((client, idx) => (
                <div 
                  key={`client-set1-${idx}`}
                  className="flex items-center gap-4 bg-white/5 dark:bg-white/5 border border-white/10 p-3 pr-6 transition-all duration-300 hover:border-brand-secondary/50 hover:bg-white/10 shrink-0 shadow-md rounded-none group select-none"
                >
                  {/* Dummy campaign / brand photo */}
                  <div className="w-16 h-12 bg-neutral-800 overflow-hidden shrink-0 border border-white/10 relative">
                    <img 
                      src={client.photo} 
                      alt={`${client.name} Campaign`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                    />
                    <div className="absolute bottom-0.5 left-0.5 bg-black/80 px-1 text-[5px] font-mono text-white tracking-widest font-bold">
                      LIVE
                    </div>
                  </div>
                  
                  {/* Brand Dummy Logo badge + Name */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <span 
                        style={{ backgroundColor: client.themeColor, color: client.themeColor === '#ffffff' ? '#000000' : '#ffffff' }}
                        className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded-none tracking-tighter inline-block shadow-sm"
                      >
                        {client.logoText}
                      </span>
                      <span className="text-xs font-black font-mono tracking-tight text-white group-hover:text-brand-secondary transition-colors duration-300 uppercase">
                        {client.name}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono tracking-wider text-slate-400 mt-0.5 uppercase">
                      {client.industry} • CAMPAIGN
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Set 2 (Duplicated for seamless loop) */}
              {clients.map((client, idx) => (
                <div 
                  key={`client-set2-${idx}`}
                  className="flex items-center gap-4 bg-white/5 dark:bg-white/5 border border-white/10 p-3 pr-6 transition-all duration-300 hover:border-brand-secondary/50 hover:bg-white/10 shrink-0 shadow-md rounded-none group select-none"
                >
                  {/* Dummy campaign / brand photo */}
                  <div className="w-16 h-12 bg-neutral-800 overflow-hidden shrink-0 border border-white/10 relative">
                    <img 
                      src={client.photo} 
                      alt={`${client.name} Campaign`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                    />
                    <div className="absolute bottom-0.5 left-0.5 bg-black/80 px-1 text-[5px] font-mono text-white tracking-widest font-bold">
                      LIVE
                    </div>
                  </div>
                  
                  {/* Brand Dummy Logo badge + Name */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <span 
                        style={{ backgroundColor: client.themeColor, color: client.themeColor === '#ffffff' ? '#000000' : '#ffffff' }}
                        className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded-none tracking-tighter inline-block shadow-sm"
                      >
                        {client.logoText}
                      </span>
                      <span className="text-xs font-black font-mono tracking-tight text-white group-hover:text-brand-secondary transition-colors duration-300 uppercase">
                        {client.name}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono tracking-wider text-slate-400 mt-0.5 uppercase">
                      {client.industry} • CAMPAIGN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION: MENGAPA MEMILIH KAMI? */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="value-proposition-section">
        <div className="space-y-12">
          
          <div className="space-y-4 text-center lg:text-left" id="value-header">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              VALUE PROPOSITION
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter" id="value-title">
              MENGAPA MEMILIH KAMI?
            </h2>
            <div className="h-1 w-24 bg-brand dark:bg-brand-secondary mx-auto lg:mx-0"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-slate-200 dark:border-white/10" id="value-grid">
            {values.map((v, idx) => (
              <div 
                key={v.num}
                className={`p-8 bg-white dark:bg-dark-bg transition-all duration-300 group flex flex-col justify-between border-slate-200 dark:border-white/10 ${
                  idx !== 2 ? 'md:border-r border-b md:border-b-0' : 'border-b md:border-b-0'
                } hover:bg-slate-50 dark:hover:bg-[#0c1226]`}
                id={`value-card-${v.num}`}
              >
                <div className="space-y-6">
                  {/* Icon or Num */}
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-none bg-slate-50 dark:bg-[#0d142b] border border-slate-200 dark:border-white/10 flex items-center justify-center text-brand dark:text-brand-secondary group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-secondary dark:group-hover:text-slate-950 transition-all duration-300">
                      {idx === 0 ? <Trophy className="w-5 h-5" /> : idx === 1 ? <Database className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </div>
                    <span className="text-4xl font-mono font-black text-transparent stroke-text text-slate-200 dark:text-neutral-800 opacity-60 select-none group-hover:text-brand dark:group-hover:text-brand-secondary group-hover:opacity-100 transition-all duration-300" style={{ WebkitTextFillColor: 'transparent' }}>
                      {v.num}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3.5 PROJECT HIGHLIGHTS WITH RECHARTS */}
      <ProjectHighlights />

      {/* 4. LAYANAN UTAMA KAMI HIGHLIGHTS */}
      <section className="bg-slate-50/50 dark:bg-[#050813] py-20 transition-colors duration-300 border-y-2 border-slate-200 dark:border-white/15" id="services-highlight-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3" id="services-highlight-header">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              SOLUSI UTAMA
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter">
              LAYANAN UTAMA KAMI
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Menghadirkan titik periklanan dengan dampak komersial tinggi dan kemudahan eksekusi lengkap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="services-highlight-grid">
            {services.map((service, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 transition-all duration-350 group flex flex-col justify-between rounded-none shadow-sm hover:border-brand dark:hover:border-brand-secondary hover:shadow-xl"
                id={`service-highlight-${idx}`}
              >
                <div>
                  {/* Optimized Lazy Image with correct aspect ratio */}
                  <LazyImage 
                    src={service.image} 
                    alt={service.title} 
                    aspectRatio="aspect-[4/3]"
                    className="rounded-none"
                  />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand/5 border border-brand/20 text-brand dark:bg-brand-secondary/5 dark:border-brand-secondary/20 dark:text-brand-secondary text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-wider">
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors uppercase tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => handleNavClick('layanan')}
                    className="flex items-center gap-1.5 text-[10px] font-mono font-black tracking-widest text-brand hover:text-brand-hover dark:text-brand-secondary dark:hover:text-white focus:outline-none focus:underline uppercase cursor-pointer"
                    id={`service-btn-detail-${idx}`}
                  >
                    LIHAT DETAIL
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. LATEST PROJECTS PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12" id="latest-projects-section">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b-2 border-slate-250 dark:border-white/10 pb-6" id="projects-header">
          <div className="space-y-2">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              PROYEK TERBARU
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter">
              KAMPANYE DI JALANAN
            </h2>
          </div>
          <button 
            onClick={() => handleNavClick('portfolio')}
            className="text-[11px] font-black text-brand hover:text-brand-hover dark:text-brand-secondary dark:hover:text-white flex items-center gap-1.5 cursor-pointer uppercase tracking-[0.2em] font-mono"
            id="view-all-portfolio"
          >
            LIHAT SEMUA PROYEK
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="projects-grid">
          {recentProjects.map((p, idx) => (
            <div 
              key={idx}
              onClick={() => handleNavClick('portfolio')}
              className="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-none overflow-hidden group hover:border-brand dark:hover:border-brand-secondary hover:shadow-lg transition-all duration-300 cursor-pointer"
              id={`project-card-home-${idx}`}
            >
              <div className="relative overflow-hidden">
                <LazyImage 
                  src={p.image} 
                  alt={p.title} 
                  aspectRatio="aspect-[4/3]"
                  className="rounded-none"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 border border-white/10 text-[8px] font-mono font-black px-2.5 py-1 rounded-none uppercase tracking-wider">
                    {p.badge}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-1">
                <p className="text-[9px] font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  {p.client}
                </p>
                <h3 className="text-xs font-black text-slate-950 dark:text-white group-hover:text-brand dark:group-hover:text-brand-secondary transition-colors uppercase leading-snug">
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5.5 TESTIMONIALS & FAQ SECTIONS */}
      <TestimonialSection />
      <FAQSection />

      {/* 6. CTA BANNER SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="cta-banner-section">
        <div className="bg-brand text-white dark:bg-[#0c132a] border-l-8 border-brand-secondary rounded-none p-8 sm:p-12 lg:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl" id="cta-banner-box">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          
          <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-mono font-black uppercase tracking-tighter leading-tight text-white dark:text-brand-secondary">
              SIAP UNTUK MENUMBUHKAN BRAND ANDA DI SUMATERA BARAT?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-neutral-300 font-medium leading-relaxed max-w-xl mx-auto">
              Jangan biarkan pesan Anda terabaikan di pinggir jalan. Ambil langkah strategis untuk mendominasi visual kota bersama kami sekarang.
            </p>
          </div>

          <div className="flex justify-center relative z-10" id="cta-btn-wrapper">
            <button
              onClick={() => handleNavClick('kontak')}
              className="bg-brand-secondary text-slate-950 hover:bg-[#e09b18] dark:bg-brand-secondary dark:text-slate-950 dark:hover:bg-white dark:hover:text-black font-mono font-black text-xs tracking-[0.2em] px-10 py-5 rounded-none transition-all duration-300 flex items-center gap-2.5 uppercase shadow-xl cursor-pointer border border-transparent"
              id="cta-btn-kontak"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              KONSULTASI SEKARANG
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
