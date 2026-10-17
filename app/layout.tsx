import type { Metadata } from 'next';
import { Archivo, Space_Grotesk, Space_Mono } from 'next/font/google';
import { ViewTransition } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import AutoplayNudge from '@/components/AutoplayNudge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';
import SiteChrome from '@/components/SiteChrome';
import { SITE_URL, pageMeta, site } from '@/lib/site';

// The icon CSS is imported above, so Font Awesome must not inject it again at runtime.
config.autoAddCss = false;

/* Webfonts, self-hosted by next/font: downloaded at build time and served from
   this origin, so first paint no longer waits on a render-blocking stylesheet
   from fonts.googleapis.com. Each exposes a CSS variable that globals.css maps
   onto the design tokens' font stacks. Archivo is the variable cut with its
   width axis, which the headings stretch to 125%; its 900 weight replaces the
   separate Archivo Black. */
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--nf-grotesk', display: 'swap' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--nf-mono', display: 'swap' });
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--nf-archivo', display: 'swap' });

/** Only the production deploy may be indexed; preview builds such as demo.paracausal.world are kept out. */
const indexable = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ title: site.name, description: `${site.tagline} ${site.locationLong}.`, path: '/' }),
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} ${archivo.variable}`} style={{ scrollBehavior: 'smooth' }}>
      <body style={{ background: 'var(--pc-void)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
        <SiteChrome>
          <div className="rd-grain" />
          <RevealObserver />
          <AutoplayNudge />
          <Navbar />
        </SiteChrome>
        {/* At least a screen tall, so the footer starts at the fold on every
            page — where the full-height home hero already puts it. */}
        <div className="rd-content">
          {/* Crossfades each page into the next: App Router navigations run as
              transitions, which animate this. Styled under ::view-transition in globals.css. */}
          <ViewTransition>{children}</ViewTransition>
        </div>
        <SiteChrome>
          <Footer />
        </SiteChrome>
      </body>
    </html>
  );
}
