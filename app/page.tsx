import type { CSSProperties } from 'react';
import { getImageProps } from 'next/image';
import Button from '@/components/ds/Button';
import HeroVideo from '@/components/HeroVideo';
import type { Metadata } from 'next';
import { TICKETS_URL, heroLoop, pageMeta, site, upcomingEvent } from '@/lib/site';

/** The hero lockup, 3:1, in its two cuts; see the <picture> that uses them. */
const heroLogoSize = { alt: site.name, width: 1040, height: 347, sizes: '(max-width: 1130px) 92vw, 1040px' };
const heroLogo = getImageProps({ ...heroLogoSize, src: '/logo-chrome.png' }).props;
const heroLogoPhone = getImageProps({ ...heroLogoSize, src: '/logo-chrome-solid.png' }).props;

export const metadata: Metadata = pageMeta({ title: site.name, description: `${site.tagline} ${site.locationLong}.`, path: '/' });

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section
        className="rd-hero"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Footage behind the lockup. The poster is the container's background,
            so it shows while the footage buffers and is all that shows when the
            visitor prefers reduced motion (the video is hidden in CSS). Phones
            and desktop get different cuts, so there are two posters and the
            stylesheet picks between them. */}
        <div
          className="rd-hero-media"
          style={{
            '--hero-poster': `url("${heroLoop.poster}")`,
            '--hero-poster-narrow': `url("${heroLoop.narrowPoster}")`,
          } as CSSProperties}
        >
          <HeroVideo src={heroLoop.src} narrowSrc={heroLoop.narrowSrc} still={heroLoop.still} narrowStill={heroLoop.narrowStill} />
        </div>

        <div
          style={{
            /* No z-index: a stacking context here would isolate the lockup's
               screen blend from the footage behind it. Source order alone
               paints this above the media. */
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '104px clamp(20px,5vw,64px) 56px',
          }}
        >
          {/* The 3D chrome lockup, 3:1. Only the hero uses it; the navbar and
              footer keep the flat wordmark at /logo.png. The file has no
              background, and each pixel's brightness is baked into its
              opacity, so the dark chrome lets the footage through without a
              blend mode — those fail over video on some phones. */}
          {/* The lockup takes all the height the hero has to spare and centres
              in it, so a taller hero grows footage around the logo. */}
          {/* The lockup is the page's heading: its alt text names the site. */}
          <h1 style={{ flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
            {/* Phones get a denser cut of the same lockup: on a small screen
                the see-through chrome was too faint against the footage. */}
            <picture style={{ display: 'contents' }}>
              <source media="(width < 768px)" srcSet={heroLogoPhone.srcSet} sizes={heroLogo.sizes} />
              <img
                {...heroLogo}
                alt={site.name}
                loading="eager"
                fetchPriority="high"
                style={{ width: 'min(100%,1040px)', height: 'auto', objectFit: 'contain', display: 'block', margin: 0 }}
              />
            </picture>
          </h1>

          {upcomingEvent && (
            <div style={{ marginTop: 34 }}>
              <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <Button size="lg" variant="primary">Get tickets</Button>
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
