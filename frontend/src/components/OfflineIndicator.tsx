/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, Info } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showSyncSuccess, setShowSyncSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncSuccess(true);
      const timer = setTimeout(() => setShowSyncSuccess(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncSuccess(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div id="offline-indicator-wrapper" className="fixed bottom-6 left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded-none shadow-lg border-2 border-white/25 backdrop-blur-md text-sm font-sans font-medium"
            id="offline-banner"
          >
            <WifiOff className="w-5 h-5 animate-pulse text-red-200" />
            <div className="flex flex-col">
              <span className="font-bold">Mode Offline Aktif</span>
              <span className="text-[11px] text-red-100 font-normal">Mengakses dari penyimpanan cache lokal</span>
            </div>
          </motion.div>
        )}

        {showSyncSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-none shadow-lg border-2 border-white/25 backdrop-blur-md text-sm font-sans font-medium"
            id="online-banner"
          >
            <Wifi className="w-5 h-5 text-emerald-200 animate-bounce" />
            <div className="flex flex-col">
              <span className="font-bold">Kembali Online!</span>
              <span className="text-[11px] text-emerald-100 font-normal">Data dan konten disinkronkan kembali</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
