/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-video", "aspect-square", "aspect-auto"
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  sizes?: string;
  lazy?: boolean;
}

/**
 * Derives the thumbnail URL for local uploaded page assets.
 * Uploaded assets are compressed and convert to WebP automatically.
 * A 400x300 thumbnail is always generated ending in `-thumb.webp`.
 */
export function getThumbnailUrl(src: string): string | null {
  if (!src) return null;
  
  // Only apply to local uploads
  if (src.includes('/uploads/')) {
    // Avoid appending double thumbnail
    if (src.includes('-thumb.webp') || src.includes('-thumb.')) {
      return src;
    }
    const extIndex = src.lastIndexOf('.');
    if (extIndex !== -1) {
      return src.substring(0, extIndex) + '-thumb.webp';
    }
  }
  return null;
}

/**
 * OptimizedImage component that uses the <picture> tag with a WebP source fallback
 * to ensure efficient loading, automatic format negotiation, and responsive sizing.
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-auto',
  objectFit = 'cover',
  sizes: customSizes,
  lazy = true,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const isUploaded = src && src.includes('/uploads/');
  const isUnsplash = src && src.includes('unsplash.com');

  let webpSrcSet: string | undefined = undefined;
  let fallbackSrcSet: string | undefined = undefined;
  let fallbackSrc = src || '';
  let sizes = customSizes;

  if (isUploaded) {
    // 1. WebP format URLs
    let webpSrc = src;
    if (!src.endsWith('.webp')) {
      const extIndex = src.lastIndexOf('.');
      if (extIndex !== -1) {
        webpSrc = src.substring(0, extIndex) + '.webp';
      }
    }
    const webpThumb = getThumbnailUrl(webpSrc);
    if (webpThumb && webpThumb !== webpSrc) {
      webpSrcSet = `${webpThumb} 400w, ${webpSrc} 1200w`;
    } else {
      webpSrcSet = `${webpSrc} 1200w`;
    }

    // 2. Fallback format URLs
    fallbackSrc = src;
    const fallbackThumb = getThumbnailUrl(src);
    if (fallbackThumb && fallbackThumb !== fallbackSrc) {
      fallbackSrcSet = `${fallbackThumb} 400w, ${fallbackSrc} 1200w`;
    } else {
      fallbackSrcSet = `${fallbackSrc} 1200w`;
    }

    sizes = customSizes || '(max-width: 640px) 400px, 100vw';
  } else if (isUnsplash) {
    const baseUrl = src.split('?')[0];

    // WebP source set (explicitly requested with fm=webp)
    webpSrcSet = `${baseUrl}?w=400&fm=webp&q=75 400w, ${baseUrl}?w=800&fm=webp&q=80 800w, ${baseUrl}?w=1200&fm=webp&q=80 1200w`;

    // Fallback source set (auto format selection / jpeg fallback)
    fallbackSrcSet = `${baseUrl}?w=400&auto=format&fit=crop&q=75 400w, ${baseUrl}?w=800&auto=format&fit=crop&q=80 800w, ${baseUrl}?w=1200&auto=format&fit=crop&q=80 1200w`;
    fallbackSrc = `${baseUrl}?w=1200&auto=format&fit=crop&q=80`;

    sizes = customSizes || '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px';
  }

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    // If the browser already has the image loaded (cached) when mounted
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  const containerId = `optimized-image-${alt ? alt.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'asset'}`;

  // Fallback indicator when image cannot be resolved
  if (hasError || !src) {
    return (
      <div
        id={containerId}
        className={`flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl p-6 ${aspectRatio} ${className}`}
      >
        <ImageOff className="w-8 h-8 text-zinc-600 mb-2" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Failed to load image
        </span>
      </div>
    );
  }

  return (
    <div
      id={containerId}
      className={`relative overflow-hidden bg-zinc-900 border border-zinc-850/50 rounded-xl ${aspectRatio} ${className}`}
    >
      {/* Premium Shimmer Optimization Indicator */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 animate-pulse"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 animate-pulse">
              OPTIMIZING...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Picture wrapper with WebP and Fallback sources */}
      <picture className="w-full h-full">
        {webpSrcSet && (
          <source
            type="image/webp"
            srcSet={webpSrcSet}
            sizes={sizes}
          />
        )}
        {fallbackSrcSet && (
          <source
            srcSet={fallbackSrcSet}
            sizes={sizes}
          />
        )}
        <motion.img
          ref={imgRef}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.02 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          src={fallbackSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-${objectFit}`}
        />
      </picture>
    </div>
  );
}

export default OptimizedImage;
