import type { Metadata, Viewport } from 'next';
import './globals.css';

// Every page reads live data or the session, so nothing is pre-rendered at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Team Portal', template: '%s · Team Portal' },
  description: 'Team directory, profiles, private chat and group chat.',
  applicationName: 'Team Portal',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#101536',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      </head>
      <body className="min-h-dvh bg-tp-canvas font-sans text-tp-ink antialiased">{children}</body>
    </html>
  );
}
