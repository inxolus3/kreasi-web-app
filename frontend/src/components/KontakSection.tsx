import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api/settings.api';
import { Mail, Phone, MapPin, Send, CheckCircle, Compass, Map, Navigation } from 'lucide-react';
import LazyImage from './LazyImage';

export default function KontakSection() {
  const { data: settingsData } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => settingsApi.getSettings(),
  });

  const s = settingsData?.data;

  const siteName = s?.siteName || 'Kreasi Advertising';
  const officeAddress = s?.officeAddress || 'Jl. Raya Padang Panjang - Bukittinggi, Belakang Balok, Kec. Aur Birugo Tigo Baleh, Kota Bukittinggi, Sumatera Barat 26181';
  const contactPhone = s?.contactPhone || '+62 812-3456-7890';
  const contactEmail = s?.contactEmail || 'kontak@kreasiadvertising.id';
  const contactWhatsapp = s?.contactWhatsapp || '6281234567890';

  const [formData, setFormData] = useState({
    nama: '',
    perusahaan: '',
    layanan: 'Billboard',
    pesan: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      
      const inquiries = JSON.parse(localStorage.getItem('kreasi_inquiries') || '[]');
      inquiries.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem('kreasi_inquiries', JSON.stringify(inquiries));
      
      setFormData({
        nama: '',
        perusahaan: '',
        layanan: 'Billboard',
        pesan: ''
      });
      
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(`Halo ${siteName}! Saya ingin berkonsultasi mengenai pemasangan iklan luar ruang.`);
    // Clean WhatsApp phone number
    const formattedWa = contactWhatsapp.replace(/\D/g, '').replace(/^0/, '62');
    window.open(`https://wa.me/${formattedWa || '6281234567890'}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-24 pb-20 font-sans" id="kontak-section-container">
      
      {/* 1. HEADER SECTION */}
      <section className="bg-slate-50 dark:bg-[#050813] py-16 transition-colors duration-300 border-b-2 border-slate-200 dark:border-white/10" id="kontak-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
            GET_IN_TOUCH
          </span>
          <h1 className="text-4xl sm:text-5xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter" id="kontak-title">
            Hubungi Kami
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Siap untuk mulai mendominasi pasar Anda? Tim kami siap memberikan konsultasi pemilihan titik reklame dan pembuatan materi periklanan terbaik.
          </p>
        </div>
      </section>

      {/* 2. CORE FORM & DETAIL SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="kontak-form-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Panel: Contact Info Card */}
          <div className="lg:col-span-5 space-y-8" id="kontak-details-col">
            <div className="bg-[#0c132a] text-white rounded-none p-8 space-y-8 shadow-2xl border-2 border-brand-secondary/20 relative overflow-hidden" id="kontak-detail-card">
              
              <div className="space-y-2 relative z-10">
                <span className="text-[9px] font-mono tracking-[0.2em] text-brand-secondary uppercase font-black">INFO UTAMA</span>
                <h2 className="text-xl font-mono font-black uppercase tracking-tight text-white">Detail Kontak</h2>
                <div className="h-1 w-16 bg-brand-secondary"></div>
              </div>

              <div className="space-y-6 text-xs relative z-10" id="kontak-info-list">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-[10px] text-brand-secondary block mb-1 uppercase tracking-wider">ALAMAT KANTOR</span>
                    <span className="text-slate-300 leading-relaxed text-xs">
                      {officeAddress}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-[10px] text-brand-secondary block mb-1 uppercase tracking-wider">WHATSAPP CHAT</span>
                    <button 
                      onClick={handleWhatsAppRedirect}
                      className="text-brand-secondary hover:text-white font-mono font-black text-[10px] tracking-[0.15em] transition-all focus:outline-none flex items-center gap-1 cursor-pointer text-left uppercase underline"
                      id="wa-chat-link"
                    >
                      Hubungi via Linktree / WA
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono font-bold text-[10px] text-brand-secondary block mb-1 uppercase tracking-wider">EMAIL RESMI</span>
                    <span className="text-slate-300 font-mono text-xs">{contactEmail}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 relative z-10" id="kontak-card-bottom">
                <div className="p-1 bg-[#050813] border-2 border-brand-secondary/20 overflow-hidden mb-3 rounded-none">
                  <LazyImage 
                    src="/src/assets/images/billboard_hero_1782888227235.jpg" 
                    alt="Kreasi Bukittinggi" 
                    aspectRatio="aspect-video"
                    className="rounded-none"
                  />
                </div>
                <p className="text-[9px] font-mono font-black tracking-widest text-slate-400 uppercase text-center">
                  KREASI BUKITTINGGI OFFICE
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Send Message Form */}
          <div className="lg:col-span-7" id="kontak-form-col">
            <div className="bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-none p-8 sm:p-10 shadow-sm" id="kontak-form-card">
              
              <div className="space-y-2 mb-8">
                <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">KONSULTASI GRATIS</span>
                <h2 className="text-2xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tight">Kirim Pesan</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-450">Silakan isi formulir di bawah ini dan perwakilan kami akan merespons dalam waktu kurang dari 24 jam.</p>
              </div>

              {isSent && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-none flex items-center gap-3" id="form-success-banner">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Permintaan konsultasi Anda berhasil dikirim! Kami akan segera menghubungi Anda.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 text-xs" id="consultation-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="form-nama" className="block text-[10px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      id="form-nama"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0c1226] border border-slate-200 dark:border-white/10 rounded-none px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand dark:focus:border-brand-secondary transition-colors text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="form-perusahaan" className="block text-[10px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nama Perusahaan (Opsional)</label>
                    <input 
                      type="text" 
                      id="form-perusahaan"
                      placeholder="Masukkan nama perusahaan"
                      value={formData.perusahaan}
                      onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0c1226] border border-slate-200 dark:border-white/10 rounded-none px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand dark:focus:border-brand-secondary transition-colors text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="form-layanan" className="block text-[10px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Layanan Yang Diminati</label>
                  <select 
                    id="form-layanan"
                    value={formData.layanan}
                    onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0c1226] border border-slate-200 dark:border-white/10 rounded-none px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand dark:focus:border-brand-secondary transition-colors text-xs font-mono"
                  >
                    <option value="Billboard">Billboard & Baliho Strategis</option>
                    <option value="Spanduk">Cetak Spanduk / Banner Outdoor</option>
                    <option value="Neon Box">Neon Box & Signage</option>
                    <option value="Branding">Branding Ruko & Kendaraan</option>
                    <option value="Lainnya">Kemitraan / Lainnya</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="form-pesan" className="block text-[10px] font-mono font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pesan Anda *</label>
                  <textarea 
                    id="form-pesan"
                    required
                    rows={4}
                    placeholder="Ceritakan detail kebutuhan iklan Anda..."
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0c1226] border border-slate-200 dark:border-white/10 rounded-none px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand dark:focus:border-brand-secondary transition-colors text-xs font-mono resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-brand hover:bg-brand-hover text-white dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:text-slate-950 font-mono font-black px-6 py-4 rounded-none transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-[0.2em] text-[10px] cursor-pointer disabled:opacity-50 shadow-md border border-transparent"
                  id="form-submit-button"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      KIRIM PERMINTAAN KONSULTASI
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 3. GEOGRAPHIC OFFLINE MAP (Interactive Styled Vector/SVG map) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8" id="kontak-map-section">
        <div className="space-y-2">
          <span className="text-[10px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">LOKASI_KANTOR</span>
          <h2 className="text-2xl sm:text-3xl font-mono font-black text-slate-950 dark:text-white uppercase tracking-tighter">KANTOR BUKITTINGGI</h2>
        </div>

        {/* Dynamic Vector Map Container */}
        <div className="relative rounded-none bg-[#050813] border-2 border-slate-250 dark:border-white/10 overflow-hidden h-96 shadow-sm flex items-center justify-center p-6" id="vector-map-frame">
          
          {/* Compass Rose */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-45 text-white font-mono text-[9px] tracking-widest">
            <Compass className="w-5 h-5 text-brand-secondary" />
            <span>KREASI BUKITTINGGI COORDINATES - 0.3056° S, 100.3692° E</span>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#0c132a] px-3.5 py-1.5 rounded-none border border-slate-800 text-[9px] font-mono text-slate-400">
            <Map className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Interactive Offline vector map</span>
          </div>

          {/* SVG Map Graphic */}
          <svg className="w-full h-full max-w-3xl opacity-25 dark:opacity-35 stroke-blue-900/40 dark:stroke-brand/20 stroke-2 fill-none" viewBox="0 0 800 400" id="map-roads-grid">
            {/* Main Highways / Rivers (curved roads representation) */}
            <path d="M 50 100 Q 200 150, 400 200 T 750 300" strokeWidth="4" />
            <path d="M 100 350 Q 350 250, 400 200 T 700 50" strokeWidth="4" />
            <path d="M 400 0 L 400 400" strokeWidth="1.5" strokeDasharray="5,5" />
            
            {/* Minor streets */}
            <line x1="150" y1="50" x2="300" y2="300" strokeWidth="1" />
            <line x1="250" y1="350" x2="600" y2="100" strokeWidth="1" />
            <line x1="500" y1="300" x2="700" y2="380" strokeWidth="1" />
            
            {/* Concentric waves around Pin */}
            <circle cx="400" cy="200" r="30" strokeWidth="0.5" strokeDasharray="3,3" />
            <circle cx="400" cy="200" r="60" strokeWidth="0.5" strokeDasharray="4,4" />
          </svg>

          {/* Central Active Pin marker */}
          <div className="absolute flex flex-col items-center justify-center animate-bounce" id="map-target-pin">
            <div className="p-3 bg-brand-secondary rounded-none shadow-md text-slate-950 border-4 border-slate-950 flex items-center justify-center relative">
              <Navigation className="w-5 h-5 transform rotate-45" />
              <div className="absolute -inset-1 border-2 border-brand-secondary animate-ping opacity-60"></div>
            </div>
            
            {/* Pin Info tooltip card */}
            <div className="mt-3 bg-[#0c132a] border border-brand-secondary/30 p-4 rounded-none shadow-xl max-w-xs text-center space-y-1.5 text-white" id="map-tooltip">
              <h4 className="text-xs font-mono font-black uppercase tracking-wide text-brand-secondary">KANTOR KREASI ADVERTISING</h4>
              <p className="text-[10px] text-slate-300 leading-normal font-sans">
                Jl. Raya Padang Panjang - Bukittinggi (Belakang Balok)
              </p>
              <div className="pt-1">
                <button 
                  onClick={handleWhatsAppRedirect}
                  className="bg-brand-secondary hover:bg-white text-slate-950 text-[9px] font-mono font-black py-1 px-4 rounded-none flex items-center gap-1 mx-auto cursor-pointer border border-transparent shadow-md uppercase tracking-wider"
                  id="map-tooltip-button"
                >
                  Navigasi / WA
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. KEY STATS BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t-2 border-slate-250 dark:border-white/10 pt-16" id="kontak-stats-banner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left" id="kontak-stats-row">
          <div className="space-y-1 border-l-4 border-brand dark:border-brand-secondary pl-4">
            <span className="text-3xl font-mono font-black text-brand dark:text-white">100+</span>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.2em] uppercase">LOKASI STRATEGIS</p>
          </div>
          <div className="space-y-1 border-l-4 border-brand dark:border-brand-secondary pl-4">
            <span className="text-3xl font-mono font-black text-brand dark:text-white">10+</span>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.2em] uppercase">TAHUN PENGALAMAN</p>
          </div>
          <div className="space-y-1 border-l-4 border-brand dark:border-brand-secondary pl-4">
            <span className="text-3xl font-mono font-black text-brand dark:text-white">24/7</span>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.2em] uppercase">SUPPORT & MONITORING</p>
          </div>
        </div>
      </section>

    </div>
  );
}
