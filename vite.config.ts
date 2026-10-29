/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Offline setelah dibuka sekali (prd.md F-15). Aset audio besar di-cache saat dipakai, bukan di-precache.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'maskot.png'],
      manifest: {
        name: 'Jelajah Kampung Riau',
        short_name: 'Jelajah Riau',
        description: 'Media pembelajaran IPAS kelas 4 tentang lingkungan alam dan buatan di Pekanbaru.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#7A1F2B',
        theme_color: '#7A1F2B',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/audio/'),
            handler: 'CacheFirst',
            options: { cacheName: 'audio', expiration: { maxEntries: 200 }, rangeRequests: true },
          },
        ],
      },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
    // Tanpa ini Vitest mengosongkan CSS, termasuk impor ?raw yang dipakai tes kontras.
    css: true,
  },
})
