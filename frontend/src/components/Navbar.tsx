/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TabType } from '../types';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoKreasi from '../assets/images/logo_kreasi.png';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, isDarkMode, setIsDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', value: 'home' as TabType },
    { label: 'Layanan', value: 'layanan' as TabType },
    { label: 'Portfolio', value: 'portfolio' as TabType },
    { label: 'Lokasi Billboard', value: 'locations' as TabType },
    { label: 'Blog', value: 'blog' as TabType },
    { label: 'Tentang Kami', value: 'tentang' as TabType },
    { label: 'Kontak', value: 'kontak' as TabType }
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-dark-bg/90 transition-colors duration-300" id="main-navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2 group focus:outline-none cursor-pointer text-left"
            id="logo-button"
          >
            <img 
              src={logoKreasi} 
              alt="Kreasi Advertising" 
              className="h-12 w-auto object-contain shrink-0 filter transition-all duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2" id="desktop-menu">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 focus:outline-none cursor-pointer ${
                  activeTab === item.value
                    ? 'text-brand dark:text-brand-secondary font-black'
                    : 'text-neutral-500 hover:text-brand dark:text-neutral-400 dark:hover:text-brand-secondary'
                }`}
                id={`nav-${item.value}`}
              >
                {item.label}
                {activeTab === item.value && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[3px] bg-brand dark:bg-brand-secondary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Bar (Dark Mode & Call-To-Action Button) */}
          <div className="hidden md:flex items-center gap-4" id="right-actions">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-none border border-slate-250 hover:bg-slate-100 text-slate-600 dark:border-white/10 dark:hover:bg-neutral-900 dark:text-neutral-300 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
              aria-label="Toggle Theme"
              id="theme-toggle-desktop"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-brand-secondary" /> : <Moon className="w-4 h-4 text-brand" />}
            </button>

            {/* Hubungi Kami Button */}
            <button
              onClick={() => handleNavClick('kontak')}
              className="flex items-center gap-1.5 border border-brand/30 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white dark:border-white/20 dark:hover:bg-brand-secondary dark:hover:text-slate-950 dark:text-white text-brand transition-colors duration-300 rounded-none focus:outline-none cursor-pointer"
              id="cta-hubungi-kami"
            >
              Hubungi Kami
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-3 md:hidden" id="mobile-actions">
            {/* Theme Toggle Mobile */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-none border border-slate-200 text-slate-600 dark:border-white/10 dark:text-neutral-300 focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
              id="theme-toggle-mobile"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-brand-secondary" /> : <Moon className="w-4 h-4 text-brand" />}
            </button>

            {/* Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-none bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-slate-900 dark:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-slate-200 bg-white dark:border-white/10 dark:bg-dark-bg overflow-hidden"
            id="mobile-drawer"
          >
            <div className="px-4 py-6 space-y-2 flex flex-col font-sans">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  className={`text-left px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    activeTab === item.value
                      ? 'bg-brand text-white dark:bg-brand-secondary dark:text-slate-950'
                      : 'text-neutral-600 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-neutral-900'
                  }`}
                  id={`mobile-nav-${item.value}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('kontak')}
                className="mt-4 flex items-center justify-center gap-1.5 w-full border-2 border-brand hover:bg-brand hover:text-white dark:border-brand-secondary dark:text-brand-secondary dark:hover:bg-brand-secondary dark:hover:text-slate-950 text-brand text-xs font-black py-3.5 rounded-none transition-all duration-300 uppercase tracking-widest cursor-pointer"
                id="mobile-cta-button"
              >
                Hubungi Kami
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
