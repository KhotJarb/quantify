import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/* ─────────────────────────────────────────────────────────────
   Viewport — exported separately as required by Next.js 15+.
   themeColor with media queries controls the iOS status bar
   colour in both light and dark mode.
──────────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,        // Prevent accidental double-tap zoom in standalone mode
  userScalable: false,
  viewportFit: "cover",   // Extend into notch / Dynamic Island safe areas
  themeColor: [
    // Light mode — warm off-white matches --bg-primary
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    // Dark mode — deep charcoal matches --bg-primary (dark)
    { media: "(prefers-color-scheme: dark)",  color: "#141210" },
  ],
};

/* ─────────────────────────────────────────────────────────────
   Page Metadata
──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Quantify",
  description:
    "Enterprise-grade calculator platform with mathematically precise computation. Finance, Engineering, Health, Science, and more.",
  keywords: [
    "calculator", "finance", "engineering", "health",
    "science", "math", "conversion", "precision",
  ],

  // ── PWA / Home Screen ─────────────────────────────────────
  manifest: "/manifest.webmanifest",

  // ── Apple / iOS ───────────────────────────────────────────
  appleWebApp: {
    capable: true,
    title: "Quantify",
    statusBarStyle: "black-translucent",
  },

  // ── Open Graph (share cards) ──────────────────────────────
  openGraph: {
    title: "Quantify",
    description:
      "Enterprise-grade calculator platform for Finance, Engineering, Health, Science, and more.",
    type: "website",
    siteName: "Quantify",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
