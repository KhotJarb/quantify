import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quantify',
    short_name: 'Quantify',
    description:
      'Deterministic, arbitrary-precision calculation instruments with A/B scenario comparison and auditable math.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'any',

    // Warm Alabaster Paper (light) / Deep Obsidian Walnut (dark)
    background_color: '#f8f6f2',
    theme_color: '#171512',

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
