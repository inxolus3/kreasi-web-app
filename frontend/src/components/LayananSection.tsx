import { TabType } from '../types';
import { Compass, Eye, ShieldAlert, Check, HelpCircle, HardHat, FileEdit, Printer, Ruler } from 'lucide-react';
import LazyImage from './LazyImage';

interface LayananSectionProps {
  setActiveTab: (tab: TabType) => void;
}

export default function LayananSection({ setActiveTab }: LayananSectionProps) {
  const steps = [
    {
      num: '01',
      title: 'Survey Lokasi',
      icon: <Ruler className="w-5 h-5 text-slate-950 dark:text-brand" />,
      description: 'Analisis titik lokasi, pengukuran dimensi yang akurat, serta pengecekan sudut pandang berkendara dan lalu lintas.'
    },
    {
      num: '02',
      title: 'Desain & Visual',
      icon: <FileEdit className="w-5 h-5 text-slate-950 dark:text-brand" />,
      description: 'Pembuatan konsep dan mockup desain baliho/reklame yang dioptimalkan khusus untuk konsumsi jalan raya (pembacaan cepat).'
    },
    {
      num: '03',
      title: 'Produksi Premium',
      icon: <Printer className="w-5 h-5 text-slate-950 dark:text-brand" />,
      description: 'Proses cetak digital dan konstruksi fisik menggunakan bahan baku premium berdaya tahan tinggi dan tahan panas hujan.'
    },
    {
      num: '04',
      title: 'Instalasi Ahli',
      icon: <HardHat className="w-5 h-5 text-slate-950 dark:text-brand" />,
      description: 'Pemasangan struktur reklame secara aman di lapangan oleh kru berpengalaman, lengkap dengan pengurusan pajak dan izin daerah.'
    }
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-20 font-sans" id="layanan-section-container">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-slate-50 dark:bg-[#050813] py-16 transition-colors duration-300 border-b-2 border-slate-200 dark:border-white/10" id="layanan-header-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            SERVICES_2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter" id="layanan-title">
            LAYANAN KAMI
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Solusi periklanan luar ruang terintegrasi di Bukittinggi dan sekitarnya. Kami membantu merek Anda mendominasi lanskap perkotaan dengan presisi industri dan estetika visual yang kuat.
          </p>
        </div>
      </section>

      {/* 2. TEXT MARQUEE ACCENT */}
      <div className="bg-brand text-white dark:bg-brand-secondary dark:text-slate-950 py-4 overflow-hidden border-y-2 border-slate-200 dark:border-white/10 font-mono text-xs font-black tracking-[0.25em]" id="services-marquee">
        <div className="flex justify-around items-center gap-12 whitespace-nowrap animate-marquee">
          <span>BILLBOARD • SPANDUK • BALIHO • NEON BOX • SIGNAGE • BRANDING KENDARAAN • DIGITAL PRINTING •</span>
          <span className="hidden sm:inline">BILLBOARD • SPANDUK • BALIHO • NEON BOX • SIGNAGE • BRANDING KENDARAAN • DIGITAL PRINTING •</span>
        </div>
      </div>

      {/* 3. SERVICE DETAILS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24" id="services-detailed-list">
        
        {/* Detail 1: Billboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="service-detail-billboard">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              PREMIUM LOCATION / 01
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tight">
              BILLBOARD & BALIHO STRATEGIS
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Titik reklame kami berdiri di persimpangan utama dan jalan protokol Bukittinggi, Padang Panjang, dan Agam. Didesain dengan konstruksi kokoh standar Dinas PU untuk menjamin visibilitas penuh tanpa terhalang rintangan.
            </p>
            
            {/* Features check list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-sans font-medium text-slate-700 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary flex items-center justify-center border border-brand/20 dark:border-brand-secondary/35">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-300">Pencahayaan LED Sorot 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary flex items-center justify-center border border-brand/20 dark:border-brand-secondary/35">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-300">Sertifikasi Kelaikan Struktur</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary flex items-center justify-center border border-brand/20 dark:border-brand-secondary/35">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-300">Jaminan Izin & Pajak Pemda</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-brand/5 dark:bg-brand-secondary/10 text-brand dark:text-brand-secondary flex items-center justify-center border border-brand/20 dark:border-brand-secondary/35">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-300">Pemantauan Keadaan Rutin</span>
              </div>
            </div>

            <button 
              onClick={() => handleNavClick('kontak')}
              className="bg-brand hover:bg-brand-hover text-white dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:text-slate-950 font-black px-8 py-4 transition-all duration-300 inline-block uppercase text-[10px] tracking-[0.2em] rounded-none shadow-md cursor-pointer border border-transparent"
              id="layanan-billboard-cta"
            >
              Cek Ketersediaan Lokasi
            </button>
          </div>
          <div className="lg:col-span-6">
            <div className="relative p-2 bg-white dark:bg-dark-bg border-2 border-slate-250 dark:border-white/10 overflow-hidden shadow-md rounded-none">
              <LazyImage 
                src="/src/assets/images/billboard_hero_1782888227235.jpg" 
                alt="Billboard Iklan Luar Ruang" 
                aspectRatio="aspect-video"
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Detail 2: Spanduk & Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse" id="service-detail-spanduk">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              LARGE FORMAT PRINTING / 02
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tight">
              CETAK SPANDUK & BANNER HIGH-RES
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Kami memproduksi cetak spanduk, banner, baliho, dan umbul-umbul dengan resolusi tinggi menggunakan tinta outdoor kualitas tinggi. Warna tajam, kontras kuat, dan tidak mudah luntur oleh paparan sinar matahari langsung maupun guyuran hujan lebat.
            </p>

            {/* Material specs */}
            <div className="p-6 rounded-none bg-slate-50 dark:bg-[#0b1227] border-2 border-slate-200 dark:border-white/10 space-y-3">
              <h4 className="text-[10px] font-black font-mono text-brand dark:text-brand-secondary uppercase tracking-wider">Varian Material Tersedia:</h4>
              <ul className="text-xs space-y-3 text-neutral-600 dark:text-neutral-400 font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-none bg-brand dark:bg-brand-secondary mt-1.5 shrink-0"></span>
                  <span><strong>Flexi Frontlite (280g - 440g)</strong>: Pilihan ekonomis berkualitas untuk umbul-umbul & baliho.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-none bg-brand dark:bg-brand-secondary mt-1.5 shrink-0"></span>
                  <span><strong>Flexi Backlite</strong>: Khusus aplikasi neon box agar tembus cahaya merata.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-none bg-brand dark:bg-brand-secondary mt-1.5 shrink-0"></span>
                  <span><strong>Sticker Vinyl & Ritrama</strong>: Solusi rekat halus untuk kaca toko & branding mobil.</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => handleNavClick('kontak')}
              className="bg-brand hover:bg-brand-hover text-white dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:text-slate-950 font-black px-8 py-4 transition-all duration-300 inline-block uppercase text-[10px] tracking-[0.2em] rounded-none shadow-md cursor-pointer border border-transparent"
              id="layanan-spanduk-cta"
            >
              Order Cetak Cepat
            </button>
          </div>
          <div className="lg:col-span-6 lg:order-1">
            <div className="relative p-2 bg-white dark:bg-dark-bg border-2 border-slate-250 dark:border-white/10 overflow-hidden shadow-md rounded-none">
              <LazyImage 
                src="/src/assets/images/banner_printing_1782888242213.jpg" 
                alt="Proses Cetak Banner" 
                aspectRatio="aspect-video"
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Detail 3: Neon Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="service-detail-neon">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              24/7 VISIBILITY / 03
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tight">
              NEON BOX & SIGNAGE EXCLUSIVE
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Maksimalkan kehadiran fisik bisnis Anda saat senja dan malam hari. Kami merancang, memproduksi, dan menginstalasi neon box custom, neon sign, huruf timbul (acrylic, stainless, galvanis), serta signage komersial premium.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 font-medium text-slate-700 dark:text-slate-400">
              <div className="flex gap-2.5">
                <Compass className="w-5 h-5 text-brand dark:text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-950 dark:text-white">Custom Shape Design</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-450">Bentuk geometris atau logo brand presisi tinggi.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Eye className="w-5 h-5 text-brand dark:text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-950 dark:text-white">Ultra LED Module</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-450">Pencahayaan terang merata & irit daya listrik.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleNavClick('kontak')}
              className="bg-brand hover:bg-brand-hover text-white dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:text-slate-950 font-black px-8 py-4 transition-all duration-300 inline-block uppercase text-[10px] tracking-[0.2em] rounded-none shadow-md cursor-pointer border border-transparent"
              id="layanan-neon-cta"
            >
              Buat Neon Box Custom
            </button>
          </div>
          <div className="lg:col-span-6">
            <div className="relative p-2 bg-white dark:bg-dark-bg border-2 border-slate-250 dark:border-white/10 overflow-hidden shadow-md rounded-none">
              <LazyImage 
                src="/src/assets/images/neon_box_sign_1782888258089.jpg" 
                alt="Neon Box Custom Toko" 
                aspectRatio="aspect-video"
                className="rounded-none"
              />
            </div>
          </div>
        </div>

      </section>

      {/* 4. PROCESS FLOW SECTION */}
      <section className="bg-brand text-white py-20 dark:bg-dark-bg border-t-2 border-brand/20 dark:border-white/10" id="services-process-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3" id="process-header">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-blue-200 dark:text-brand-secondary uppercase block">
              WORK PROCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tighter text-white">
              PROSES KERJA KAMI
            </h2>
            <p className="text-xs text-blue-100 dark:text-neutral-400 max-w-md mx-auto">
              Memastikan setiap proyek diselesaikan tepat waktu dengan standar kontrol kualitas yang ketat di setiap langkah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-white/10" id="process-grid">
            {steps.map((step, idx) => (
              <div 
                key={step.num}
                className={`relative p-8 bg-brand-hover dark:bg-dark-bg transition-all duration-300 group flex flex-col justify-between border-white/10 ${
                  idx !== 3 ? 'md:border-r border-b md:border-b-0' : 'border-b md:border-b-0'
                } hover:bg-brand/80 dark:hover:bg-[#0c1226]`}
                id={`process-card-${step.num}`}
              >
                <div className="space-y-6">
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="w-12 h-12 rounded-none bg-brand dark:bg-[#0d142b] border border-white/10 flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-slate-950 transition-all duration-300">
                      {step.icon}
                    </div>
                    <span className="text-4xl font-mono font-black text-transparent stroke-text text-white/20 dark:text-neutral-800 opacity-60 select-none group-hover:text-brand-secondary group-hover:opacity-100 transition-all duration-300" style={{ WebkitTextFillColor: 'transparent' }}>
                      {step.num}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-brand-secondary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-blue-100 dark:text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
