import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  // Automatically show tooltip after 5 seconds to invite user to chat
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleWhatsAppRedirect = () => {
  if (!isOnline()) {
    alert("Mohon maaf, Anda tidak dapat mengakses fitur ini saat ini. Hubungi kami kembali pada jam kerja kami: Senin - Sabtu, pukul 08.30 - 18.00 WIB.");
    return;
  }

  const text = encodeURIComponent("Halo Kreasi Advertising! Saya ingin berkonsultasi mengenai pemasangan iklan luar ruang.");
  window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  setIsOpen(false);
  setHasNotification(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (hasNotification) {
      setHasNotification(false);
    }
    if (showTooltip) {
      setShowTooltip(false);
    }
  };

  // HANDLE WORKING HOUR
  const isOnline = () => {
  const now = new Date();
  const day = now.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const hour = now.getHours();
  const minutes = now.getMinutes();

  return (
    (day >= 1 && day <= 5) && // Senin - Sabtu
    hour >= 7 && hour < 19 && // Jam 08.30 - 17.59
    (hour === 17 && minutes < 0) // Jam 17.00
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end" id="whatsapp-floating-container">
      
      {/* 1. INTERACTIVE CHAT POPUP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-80 sm:w-85 bg-white dark:bg-[#0c132a] border-2 border-brand dark:border-brand-secondary/30 shadow-2xl rounded-none overflow-hidden mb-4"
            id="whatsapp-chat-popup"
          >
            {/* Header */}
            <div className="bg-slate-950 dark:bg-black p-4 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-brand flex items-center justify-center rounded-none shadow-md font-mono font-black text-white text-xs border border-white/10">
                    KADV
                  </div>
                  {/* Active Green Dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-black tracking-wider uppercase text-brand-secondary">
                    KREASI_LIVE_CHAT
                  </h4>
                  {isOnline() ? (
                    <span className="text-[9px] font-mono tracking-widest text-emerald-400 block uppercase font-bold">
                      ONLINE
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono tracking-widest text-red-400 block uppercase font-bold">
                      OFFLINE
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer p-1 focus:outline-none"
                id="close-whatsapp-popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content / Chat bubble area */}
            <div className="p-5 bg-slate-50 dark:bg-[#070b19] space-y-4 max-h-72 overflow-y-auto">
              <div className="flex flex-col gap-1.5 max-w-[85%] self-start">
                <span className="text-[8px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  CUSTOMER SERVICE
                </span>
                <div className="bg-white dark:bg-[#0e1735] p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5 relative shadow-sm">
                  <div className="absolute top-2 left-0 -ml-1.5 w-3 h-3 bg-white dark:bg-[#0e1735] border-l border-b border-slate-200 dark:border-white/5 transform rotate-45 hidden sm:block"></div>
                  Halo! Ada yang bisa kami bantu mengenai penyewaan <b>Billboard</b>, cetak <b>Spanduk</b>, atau pembuatan <b>Neon Box</b> di Bukittinggi & Agam?
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase">
                  Baru Saja
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="p-4 bg-white dark:bg-[#0c132a] border-t border-slate-100 dark:border-white/5">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white py-2.5 px-4 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer border border-transparent rounded-none"
                id="whatsapp-submit-direct-btn"
              >
                <Send className="w-3.5 h-3.5" />
                Mulai Chat via WA
              </button>
              <div className="mt-2 text-center">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">
                  Hubungi kami secara gratis tanpa potongan biaya
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PERSISTENT INFORMATIVE TOOLTIP */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-slate-950 text-white dark:bg-brand-secondary dark:text-slate-950 px-4 py-2 text-[10px] font-mono font-black uppercase tracking-wider mb-2.5 shadow-xl border border-white/10 dark:border-transparent rounded-none select-none relative pointer-events-none"
            id="whatsapp-hover-tooltip"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-secondary dark:text-slate-950" />
              <span>Ada Pertanyaan? Tanya Kami!</span>
            </div>
            {/* Tiny notch below the tooltip */}
            <div className="absolute right-5 bottom-0 translate-y-1/2 w-2 h-2 bg-slate-950 dark:bg-brand-secondary transform rotate-45 border-r border-b border-white/10 dark:border-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CORE FLOATING BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative focus:outline-none transition-colors duration-300 border-2 ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-700 hover:bg-black'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-white/10'
        }`}
        id="whatsapp-core-trigger-button"
        title="Hubungi kami via WhatsApp"
        aria-label="Tombol WhatsApp Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin-once" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white/10" />
            
            {/* Dynamic Alert Notification Dot */}
            {hasNotification && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5" id="whatsapp-notif-dot">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-secondary text-[7px] font-mono font-black items-center justify-center text-slate-950">
                  !
                </span>
              </span>
            )}
          </div>
        )}
      </motion.button>

    </div>
  );
}
