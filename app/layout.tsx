import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';
import SiteChrome from '@/components/SiteChrome';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: site.name,
  description: `${site.tagline} ${site.locationLong}.`,
  openGraph: {
    title: site.name,
    description: site.blurb,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <head>
        {/* Loaded here rather than through an @import in globals.css. Tailwind
            v4 hoists and inlines that file's imports, which left the Google
            Fonts URL below the generated @layer blocks — and a stylesheet drops
            any @import that is not still at the top, so none of these families
            were reaching the browser and every page rendered in fallbacks. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Archivo+Black&family=Archivo:wdth,wght@62..125,400..900&display=swap"
        />
      </head>
      <body style={{ background: 'var(--pc-void)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
        <SiteChrome>
          <div className="rd-grain" />
          <RevealObserver />
          <Navbar />
        </SiteChrome>
        {children}
        <SiteChrome>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  );
}
