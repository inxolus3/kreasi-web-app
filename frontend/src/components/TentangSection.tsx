import { TabType } from '../types';
import { ShieldCheck, HeartHandshake, Eye, Sparkles, Building, Landmark, Award } from 'lucide-react';
import LazyImage from './LazyImage';
import FAQSection from './FAQSection';

interface TentangSectionProps {
  setActiveTab: (tab: TabType) => void;
}

export default function TentangSection({ setActiveTab }: TentangSectionProps) {
  const badges = [
    { label: '50+ Big Brands', icon: <Building className="w-4 h-4 text-brand dark:text-brand-secondary" /> },
    { label: '100+ Premium Spots', icon: <Landmark className="w-4 h-4 text-brand dark:text-brand-secondary" /> },
    { label: 'TOP In Bukittinggi', icon: <Award className="w-4 h-4 text-brand dark:text-brand-secondary" /> }
  ];

  const missions = [
    {
      num: '01',
      title: 'Solusi Promosi Efektif & Kreatif',
      description: 'Memberikan solusi promosi luar ruang terlengkap dengan desain kreatif, kualitas konstruksi mumpuni, dan tarif kompetitif. Kami tidak hanya menjual titik reklame, kami membangun reputasi visual bisnis Anda agar terekam abadi di benak masyarakat.'
    },
    {
      num: '02',
      title: 'Pendekatan Strategi Kreatif',
      description: 'Menerapkan tata letak tipografi tebal, pemilihan warna berdaya tangkap tinggi, dan visualisasi minimalis-fokus yang ramah bagi mata pengendara jalan raya berkecepatan 40-60 km/jam.'
    }
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 pb-20 font-sans" id="tentang-section-container">
      
      {/* 1. HERO HEADER AREA */}
      <section className="bg-slate-50 dark:bg-[#050813] py-16 transition-colors duration-300 border-b-2 border-slate-200 dark:border-white/10" id="tentang-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            COMPANY_IDENTITY
          </span>
          <h1 className="text-3xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none max-w-4xl mx-auto" id="tentang-title">
            KREASI ADVERTISING: PARTNER PERTUMBUHAN BISNIS ANDA
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Menjadi pelopor media luar ruang paling diandalkan dan profesional di Sumatera Barat dengan komitmen integritas, legalitas, dan keamanan total.
          </p>

          {/* Core Badges Row */}
          <div className="flex flex-wrap justify-center gap-4 pt-4" id="tentang-badges-row">
            {badges.map((b, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 bg-white dark:bg-[#0c1226] border-l-4 border-brand dark:border-brand-secondary px-5 py-3 text-[10px] font-black font-mono text-brand dark:text-brand-secondary shadow-md border-y border-r border-slate-200 dark:border-white/10"
              >
                {b.icon}
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CORE BRIEF DETAILS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="tentang-professional-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              KAMI ADALAH
            </span>
            <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white uppercase leading-tight tracking-tight">
              Profesionalisme dalam Visual Outdoor
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Kreasi Advertising didirikan untuk mengisi kebutuhan pelaku bisnis akan layanan reklame baliho, billboard, dan media cetak yang profesional, akurat, tepat waktu, dan tertib administrasi di Sumatera Barat. 
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Kami menyadari bahwa media luar ruang adalah representasi langsung reputasi Anda di ruang publik. Oleh karenanya, kami tidak pernah mengorbankan kualitas besi tiang, kecerahan lampu sorot LED, maupun kerapihan pengerjaan keliling demi memangkas biaya.
            </p>

            {/* Values check */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 text-sm">
                <div className="mt-0.5 w-8 h-8 rounded-none bg-slate-100 dark:bg-[#0c1226] text-brand dark:text-brand-secondary flex items-center justify-center shrink-0 border-2 border-brand/20 dark:border-brand-secondary/35 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-slate-950 dark:text-white block text-xs uppercase tracking-wider">Kepatuhan Hukum & Pajak Terjamin</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">Seluruh titik perizinan baliho terdata resmi di Bapenda dan Dinas PTSP terkait. Bebas penertiban.</span>
                </div>
              </div>

              <div className="flex items-start gap-4 text-sm">
                <div className="mt-0.5 w-8 h-8 rounded-none bg-slate-100 dark:bg-[#0c1226] text-brand dark:text-brand-secondary flex items-center justify-center shrink-0 border-2 border-brand/20 dark:border-brand-secondary/35 shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-slate-950 dark:text-white block text-xs uppercase tracking-wider">Pelayanan Responsif & Garansi</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">Garansi lampu mati ganti baru maksimal 2x24 jam dan jaminan perawatan spanduk sobek badai.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-2 bg-white dark:bg-[#0c1226] border-2 border-brand/20 dark:border-brand-secondary/20 overflow-hidden shadow-xl rounded-none">
              <LazyImage 
                src="/src/assets/images/billboard_hero_1782888227235.jpg" 
                alt="Tentang Kreasi Advertising" 
                aspectRatio="aspect-[4/3]"
                className="rounded-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. MISI KAMI GRID */}
      <section className="bg-brand text-white py-20 dark:bg-[#050813] border-y-2 border-brand/20 dark:border-white/10" id="tentang-misi-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3" id="misi-header">
            <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand-secondary uppercase block">
              MISSION_STATEMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tighter text-white">
              MISI UTAMA KAMI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-brand-secondary/20" id="misi-grid">
            {missions.map((m, idx) => (
              <div 
                key={m.num}
                className={`p-8 bg-brand dark:bg-[#0c1226] border-brand-secondary/10 group ${
                  idx === 0 ? 'md:border-r border-b md:border-b-0' : 'border-b md:border-b-0'
                } space-y-4 hover:bg-[#0b2b80] dark:hover:bg-[#0f1938] transition-all duration-300 rounded-none`}
                id={`misi-card-${m.num}`}
              >
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-none bg-slate-900 border border-brand-secondary/35 flex items-center justify-center text-brand-secondary shadow-md">
                    {m.num === '01' ? <Sparkles className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                  <span className="text-4xl font-mono font-black text-transparent stroke-text text-brand-secondary/30 dark:text-brand-secondary/15 opacity-60">
                    {m.num}
                  </span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-brand-secondary dark:group-hover:text-brand-secondary transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-blue-100 dark:text-neutral-400 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RUNNING TEXT */}
      <div className="bg-brand-secondary text-slate-950 py-5 overflow-hidden border-y-2 border-brand dark:border-brand-secondary font-mono text-[10px] font-black tracking-[0.2em]" id="about-running-text">
        <div className="flex justify-around items-center gap-12 whitespace-nowrap animate-marquee">
          <span>HIGH STANDARDS • PROFESSIONAL MANAGEMENT • DATA CRUNCH • EXCELLENCE GUARANTEED • 24/7 SUPPORT •</span>
          <span className="hidden sm:inline">HIGH STANDARDS • PROFESSIONAL MANAGEMENT • DATA CRUNCH • EXCELLENCE GUARANTEED • 24/7 SUPPORT •</span>
        </div>
      </div>

      {/* 4.5 FAQ SECTION */}
      <FAQSection />

      {/* 5. CALL TO ACTION FOR ABOUT US */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="about-cta">
        <div className="bg-brand text-white dark:bg-[#0c132a] border-l-8 border-brand-secondary rounded-none p-8 sm:p-12 text-center space-y-6 shadow-2xl" id="about-cta-box">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

          <div className="space-y-2 max-w-xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tighter text-white dark:text-brand-secondary">
              SIAP MENDOMINASI MARKET ANDA?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-neutral-300 leading-relaxed max-w-lg mx-auto font-semibold">
              Hubungi tim ahli media kami sekarang untuk konsultasi pemilihan media periklanan luar ruang strategis Bukittinggi.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 relative z-10" id="about-cta-buttons">
            <button
              onClick={() => handleNavClick('kontak')}
              className="bg-brand-secondary text-slate-950 hover:bg-[#e09b18] dark:bg-brand-secondary dark:text-slate-950 dark:hover:bg-white dark:hover:text-black font-mono font-black text-xs tracking-[0.2em] px-8 py-4 rounded-none transition-all duration-300 uppercase cursor-pointer shadow-lg border border-transparent"
              id="about-cta-consult"
            >
              Konsultasi Gratis
            </button>
            <button
              onClick={() => handleNavClick('portfolio')}
              className="bg-transparent hover:bg-white hover:text-brand dark:hover:bg-black dark:hover:text-brand-secondary text-white dark:text-white border-2 border-white/20 font-mono font-black text-xs tracking-[0.2em] px-8 py-4 rounded-none transition-all duration-300 uppercase cursor-pointer"
              id="about-cta-portfolio"
            >
              Lihat Portfolio
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
