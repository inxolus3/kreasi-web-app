/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabType } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OfflineIndicator from './components/OfflineIndicator';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import HomeSection from './components/HomeSection';
import LayananSection from './components/LayananSection';
import PortfolioSection from './components/PortfolioSection';
import TentangSection from './components/TentangSection';
import KontakSection from './components/KontakSection';
import LocationsSection from './components/LocationsSection';
import BlogSection from './components/BlogSection';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './components/SEO';
import { generateOrganizationSchema } from './utils/seo';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Default to true (Dark Mode by default as shown in the original professional layout)
    const stored = localStorage.getItem('kreasi_dark_mode');
    return stored !== null ? JSON.parse(stored) : true;
  });

  // Handle Dark Mode toggle
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('kreasi_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Derive SEO Data based on active tab
  const getSeoData = () => {
    let title = 'Kreasi Advertising - Solusi Periklanan Luar Ruang Terbaik Bukittinggi';
    let description = 'Penyedia jasa periklanan luar ruang (Billboard, Spanduk, Neon Box, Branding) terpercaya di Bukittinggi, Sumatera Barat.';
    let keywords = 'reklame bukittinggi, billboard sumatera barat, spanduk padang panjang, neon box agam, branding toko';
    
    switch (activeTab) {
      case 'home':
        title = 'Kreasi Advertising - Solusi Periklanan Luar Ruang Terbaik Sumatera Barat';
        description = 'Sewa billboard strategis, cetak spanduk cepat, dan neon box custom di Bukittinggi. Jaminan visibilitas tinggi & perizinan resmi.';
        break;
      case 'layanan':
        title = 'Layanan Reklame Lengkap - Billboard, Spanduk, Neon Box & Baliho';
        description = 'Telusuri layanan advertising outdoor terlengkap di Sumatera Barat. Pemasangan aman standar Dinas PU dan pencahayaan LED sorot 24/7.';
        break;
      case 'portfolio':
        title = 'Portfolio Proyek Kampanye Iklan Sukses - Kreasi Advertising';
        description = 'Lihat hasil pengerjaan riil billboard Yamaha, Indosat, Miss Glam, dan Oxygen Denim di persimpangan jalan protokol Bukittinggi.';
        break;
      case 'locations':
        title = 'Peta Lokasi Billboard Strategis - Kreasi Advertising';
        description = 'Cari dan sewa lokasi billboard paling strategis di Bukittinggi dan Sumatera Barat. Lihat foto lokasi, dimensi, pencahayaan, ketersediaan, dan koordinat peta.';
        break;
      case 'blog':
        title = 'Artikel & Kabar Terbaru Periklanan Luar Ruang - Kreasi Advertising';
        description = 'Ikuti tips branding toko, panduan promosi billboard, serta update seputar dunia pemasaran outdoor di Sumatera Barat.';
        break;
      case 'tentang':
        title = 'Tentang Kami - Agen Media Luar Ruang Profesional Sumatera Barat';
        description = 'Kreasi Advertising adalah partner periklanan terpercaya yang memprioritaskan legalitas hukum, presisi industri, dan kepuasan klien.';
        break;
      case 'kontak':
        title = 'Hubungi Kami - Konsultasi Iklan & Cek Ketersediaan Lokasi';
        description = 'Kontak kami untuk cek penawaran harga billboard strategis dan konsultasi gratis desain promosi luar ruang.';
        break;
    }
    return { title, description, keywords };
  };

  const seoData = getSeoData();

  // Service Worker Registration for full offline capability
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully with scope:', registration.scope);
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  // Helper to render active main section
  const renderSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection setActiveTab={setActiveTab} />;
      case 'layanan':
        return <LayananSection setActiveTab={setActiveTab} />;
      case 'portfolio':
        return <PortfolioSection setActiveTab={setActiveTab} />;
      case 'locations':
        return <LocationsSection isDarkMode={isDarkMode} />;
      case 'blog':
        return <BlogSection />;
      case 'tentang':
        return <TentangSection setActiveTab={setActiveTab} />;
      case 'kontak':
        return <KontakSection />;
      default:
        return <HomeSection setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        structuredData={generateOrganizationSchema()}
      />
      {/* 1. Header Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />

      {/* 2. Main content block with smooth layout transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer area */}
      <Footer setActiveTab={setActiveTab} />

      {/* 4. Interactive Offline Indicator */}
      <OfflineIndicator />

      {/* 5. Floating WhatsApp Support Button */}
      <WhatsAppFloatingButton />

    </div>
  );
}
