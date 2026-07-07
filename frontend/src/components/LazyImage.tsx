/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-video", "aspect-[4/3]", "aspect-square"
}

export default function LazyImage({ src, alt, className = '', aspectRatio = 'aspect-video' }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    // Standard image preloading
    const img = new Image();
    img.src = src;
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      // Offline fallback or placeholder if it fails
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${aspectRatio} ${className}`} id={`lazy-container-${alt.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Visual Shimmer / Placeholder when loading */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse"
          >
            <div className="text-slate-400 dark:text-slate-600 text-xs font-mono">
              LOADING...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      {currentSrc && (
        <motion.img
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.03 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
