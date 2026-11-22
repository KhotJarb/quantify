import type { Metadata, Viewport } from 'next';
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { PreferencesProvider } from '@/context/PreferencesContext';
import CommandPalette from '@/components/layout/CommandPalette';
import TapFeedback from '@/components/ui/TapFeedback';
import {
  getSuiteCounts,
  getSiteUrl,
} from '@/lib/catalog';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f6f2' },
    { media: '(prefers-color-scheme: dark)', color: '#171512' },
  ],
};

const siteUrl = getSiteUrl();
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { 'msvalidate.01': bingVerification } } : {}),
        },
      }
    : {}),
  title: {
    default: 'Quantify — Precision Decision & Calculation Instruments',
    template: '%s | Quantify',
  },
  description:
    'Deterministic, arbitrary-precision calculators across Wealth & Finance, Clinical Health, Engineering, Science, and Business—featuring A/B scenario comparison and auditable math.',
  keywords: [
    'precision calculator',
    'financial modeling',
    'scenario comparison',
    'clinical calculators',
    'engineering calculators',
    'decimal.js',
    'quantify',
  ],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Quantify',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'Quantify — Precision Decision & Calculation Instruments',
    description:
      'Deterministic arbitrary-precision calculation instruments with live A/B scenario comparison and auditable formula traces.',
    type: 'website',
    siteName: 'Quantify',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantify — Precision Decision & Calculation Instruments',
    description:
      'Deterministic calculation instruments with A/B scenario comparison and auditable formulas.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const suiteCounts = getSuiteCounts();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <PreferencesProvider suiteCounts={suiteCounts}>
            {children}
            <CommandPalette />
            <TapFeedback />
          </PreferencesProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
