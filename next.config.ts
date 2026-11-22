import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/calculator/ldl-cholesterol-enhanced',
        destination: '/calculator/ldl-cholesterol-calculator',
        permanent: true,
      },
      {
        source: '/calculator/compound-interest-enhanced',
        destination: '/calculator/compound-interest',
        permanent: true,
      },
      {
        source: '/calculator/bmi-calculator-enhanced',
        destination: '/calculator/bmi-calculator',
        permanent: true,
      },
      {
        source: '/calculator/ohms-law-power-calculator',
        destination: '/calculator/ohms-law',
        permanent: true,
      },
      {
        source: '/calculator/progressive-overload-special',
        destination: '/calculator/progressive-overload',
        permanent: true,
      },
      {
        source: '/calculator/advanced-calculator-math',
        destination: '/calculator/advanced-calculator',
        permanent: true,
      },
    ];
  },
  async headers() {
    const commonHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    return [
      {
        source: '/(.*)',
        headers: commonHeaders,
      },
      {
        // Allow Quantify Studio iframe widgets to be embedded on any external site
        source: '/calculator/:slug*',
        headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }],
      },
      {
        // Protect app shell routes from unintended cross-origin clickjacking
        source: '/(workbooks|studio|methodology)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
