import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api/settings.api';
import { TabType } from '../types';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, Share2, Twitter } from 'lucide-react';
import logoKreasi from '../assets/images/logo_kreasi_small.png';

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  // Fetch settings dynamically
  const { data: settingsData } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => settingsApi.getSettings(),
  });

  const s = settingsData?.data;

  const siteName = s?.siteName || 'Kreasi Advertising';
  const logoUrl = s?.siteLogo || logoKreasi;
  const officeAddress = s?.officeAddress || 'Jl. Raya Padang Panjang - Bukittinggi, Belakang Balok, Kec. Aur Birugo Tigo Baleh, Kota Bukittinggi, Sumatera Barat 26181';
  const contactPhone = s?.contactPhone || '+62 812-3456-7890';
  const contactEmail = s?.contactEmail || 'kontak@kreasiadvertising.id';
  const socialInstagram = s?.socialInstagram || 'https://instagram.com';
  const socialFacebook = s?.socialFacebook || 'https://facebook.com';
  const socialTwitter = s?.socialTwitter || 'https://twitter.com';
  const footerCopyright = s?.footerCopyright || `© ${new Date().getFullYear()} KREASI ADVERTISING. All Rights Reserved.`;

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${siteName} Bukittinggi`,
          text: s?.siteDescription || 'Penyedia jasa periklanan luar ruang terbaik di Bukittinggi, Sumatera Barat.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link website berhasil disalin ke clipboard!');
    }
  };

  return (
    <footer className="bg-dark-bg text-slate-300 font-sans border-t border-slate-200 dark:border-white/10" id="main-footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1" id="footer-brand-info">
            <button 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-2 focus:outline-none cursor-pointer text-left group"
              id="footer-logo-btn"
            >
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="h-10 w-auto object-contain shrink-0 filter brightness-110 transition-all duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </button>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
              Partner terpercaya dalam mendominasi visual outdoor. Kami menggabungkan estetika modern dengan presisi industri untuk pertumbuhan bisnis Anda.
            </p>
            {/* Social Share Utilities */}
            <div className="flex gap-3 pt-2" id="footer-social-share">
              <button 
                onClick={handleShare}
                className="p-2 bg-neutral-900 border border-white/5 text-slate-300 hover:bg-brand hover:text-black transition-colors rounded-none cursor-pointer"
                aria-label="Bagikan Website"
                id="share-button"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <a 
                href={socialInstagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-neutral-900 border border-white/5 text-slate-300 hover:bg-brand hover:text-black transition-colors rounded-none"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={socialFacebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-neutral-900 border border-white/5 text-slate-300 hover:bg-brand hover:text-black transition-colors rounded-none"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={socialTwitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-neutral-900 border border-white/5 text-slate-300 hover:bg-brand hover:text-black transition-colors rounded-none"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Layanan Kami */}
          <div className="space-y-4" id="footer-services-links">
            <h3 className="text-[10px] font-bold font-mono tracking-[0.2em] text-neutral-400 dark:text-brand uppercase">
              Layanan Utama
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick('layanan')} className="hover:text-brand transition-colors text-left cursor-pointer font-medium uppercase tracking-wider text-[10px]" id="footer-link-billboard">
                  Billboard & Baligo
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('layanan')} className="hover:text-brand transition-colors text-left cursor-pointer font-medium uppercase tracking-wider text-[10px]" id="footer-link-spanduk">
                  Cetak Spanduk & Banner
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('layanan')} className="hover:text-brand transition-colors text-left cursor-pointer font-medium uppercase tracking-wider text-[10px]" id="footer-link-neon">
                  Neon Box & Signage
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('layanan')} className="hover:text-brand transition-colors text-left cursor-pointer font-medium uppercase tracking-wider text-[10px]" id="footer-link-branding">
                  Branding Kendaraan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Kontak Detail */}
          <div className="space-y-4" id="footer-contact-links">
            <h3 className="text-[10px] font-bold font-mono tracking-[0.2em] text-neutral-400 dark:text-brand uppercase">
              Hubungi Kami
            </h3>
            <ul className="space-y-3.5 text-xs font-sans" id="footer-contact-list">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span className="text-neutral-400 leading-snug text-xs">
                  {officeAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <span className="text-neutral-400">{contactPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span className="text-neutral-400 font-mono">{contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4" id="footer-newsletter">
            <h3 className="text-[10px] font-bold font-mono tracking-[0.2em] text-neutral-400 dark:text-brand uppercase">
              Berlangganan Info
            </h3>
            <p className="text-xs text-neutral-450 leading-relaxed">
              Dapatkan katalog penawaran lokasi billboard strategis terbaru langsung di email Anda.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih telah berlangganan!'); }} className="flex gap-2" id="footer-news-form">
              <input 
                type="email" 
                required
                placeholder="Email Anda" 
                className="bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-xs rounded-none px-3.5 py-2 w-full focus:outline-none focus:border-brand transition-colors font-mono"
                id="newsletter-email"
              />
              <button 
                type="submit" 
                className="bg-brand hover:bg-white text-black font-mono font-black px-4 py-2 rounded-none text-[10px] tracking-wider transition-all duration-300 cursor-pointer"
                id="newsletter-submit"
              >
                GABUNG
              </button>
            </form>
          </div>

        </div>

        {/* Dynamic Sitemap Service & Geographic Directory */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10" id="footer-sitemap-section">
          <div className="mb-6">
            <span className="text-[9px] font-black font-mono tracking-[0.25em] text-brand dark:text-brand-secondary uppercase block">
              KREASI_SITEMAP_INDEX
            </span>
            <h4 className="text-sm font-mono font-black uppercase text-white tracking-tight">
              PANDUAN NAVIGASI PORTAL & LAYANAN PERIKLANAN
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="sitemap-grid">
            {[
              {
                title: "KATEGORI LAYANAN REKLAME",
                links: [
                  { name: "Billboard Strategis", tab: "layanan" as TabType },
                  { name: "Baliho Konstruksi", tab: "layanan" as TabType },
                  { name: "Neon Box & Signage Toko", tab: "layanan" as TabType },
                  { name: "Branding Kendaraan", tab: "layanan" as TabType },
                  { name: "Cetak Spanduk & Banner", tab: "layanan" as TabType },
                  { name: "Huruf Timbul 3D", tab: "layanan" as TabType }
                ]
              },
              {
                title: "WILAYAH STRATEGIS BUKITTINGGI & AGAM",
                links: [
                  { name: "Pusat Kota Bukittinggi", tab: "tentang" as TabType },
                  { name: "Koridor Jln. Jend. Sudirman", tab: "tentang" as TabType },
                  { name: "Bundaran Simpang Aur", tab: "tentang" as TabType },
                  { name: "Kawasan Agam & Sekitarnya", tab: "tentang" as TabType },
                  { name: "Jalur Lintas Padang - Bukittinggi", tab: "tentang" as TabType }
                ]
              },
              {
                title: "INFORMASI & TRANSPARANSI",
                links: [
                  { name: "Profil Kreasi Advertising", tab: "tentang" as TabType },
                  { name: "Syarat Pajak & Retribusi", tab: "tentang" as TabType },
                  { name: "Garansi Pemeliharaan Lampu", tab: "tentang" as TabType },
                  { name: "Hubungi Penjualan (WA)", tab: "kontak" as TabType },
                  { name: "Cek Lokasi Kantor", tab: "kontak" as TabType }
                ]
              }
            ].map((section, idx) => (
              <div key={idx} className="space-y-3" id={`sitemap-section-${idx}`}>
                <h5 className="text-[10px] font-bold font-mono tracking-wider text-neutral-400 border-b border-slate-200/5 dark:border-white/5 pb-2">
                  {section.title}
                </h5>
                <ul className="space-y-1.5">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <button
                        onClick={() => handleNavClick(link.tab)}
                        className="text-[11px] text-neutral-500 hover:text-brand dark:hover:text-brand-secondary transition-colors duration-200 text-left cursor-pointer flex items-center gap-1.5 uppercase font-mono tracking-tight"
                        id={`sitemap-link-${idx}-${lIdx}`}
                      >
                        <span className="text-brand dark:text-brand-secondary opacity-50 font-bold">›</span>
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-neutral-500 gap-4" id="footer-bottom-bar">
          <p>{footerCopyright}</p>
          <div className="flex gap-6 uppercase tracking-wider" id="footer-legal-links">
            <a href="#privacy" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#terms" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
