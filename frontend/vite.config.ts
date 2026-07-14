import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      process.env.SENTRY_AUTH_TOKEN ? sentryVitePlugin({
        org: 'your-org',
        project: 'kreasi-cms-frontend',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }) : null,
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),  // ← FIX: arahkan ke src, bukan root
      },
    },
    
    build: {
      target: 'es2020',
      minify: 'terser',
      sourcemap: true,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react', 'yet-another-react-lightbox'],
            map: ['leaflet', 'react-leaflet'],
          },
        },
      },
    },
    
    server: {
      port: 5173,
      
      // ✅ TAMBAHKAN: Proxy ke backend
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          // Tidak perlu rewrite — pertahankan /api prefix
        },
      },
      
      // HMR config (jangan diubah)
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
