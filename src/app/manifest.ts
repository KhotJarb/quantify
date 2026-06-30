import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quantify',
    short_name: 'Quantify',
    description:
      'Enterprise-grade calculator platform for Finance, Engineering, Health, Science, and more.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',

    // Japandi warm charcoal — matches --bg-sidebar (dark) / --bg-primary (light)
    background_color: '#faf9f7',
    theme_color: '#141210',

    categories: ['finance', 'utilities', 'productivity'],

    icons: [
      // Standard Android / Chrome launcher icon
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      // Standard large icon (splash screens, Play Store)
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      // Maskable icons — Android Adaptive Icons
      // The logo is inset to the 80% "safe zone" so Android can
      // clip into any shape (circle, squircle, etc.) without cropping content.
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
