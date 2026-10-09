import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getImageProps } from 'next/image';
import Button from '@/components/ds/Button';
import { eyebrow, sectionHeading, sectionPad } from '@/components/ds/styles';
import EventCarousel from '@/components/EventCarousel';
import GalleryStrip from '@/components/GalleryStrip';
import HeroSignup from '@/components/HeroSignup';
import HeroVideo from '@/components/HeroVideo';
import UpcomingEvent from '@/components/UpcomingEvent';
import { TICKETS_URL, heroLoop, recentNights, site, upcomingEvent } from '@/lib/site';

/** The hero lockup, 3:1, in its two cuts; see the <picture> that uses them. */
const heroLogoSize = { alt: site.name, width: 1040, height: 347, sizes: '(max-width: 1130px) 92vw, 1040px' };
const heroLogo = getImageProps({ ...heroLogoSize, src: '/logo-chrome.png' }).props;
const heroLogoPhone = getImageProps({ ...heroLogoSize, src: '/logo-chrome-solid.png' }).props;

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
              in it, so a taller hero grows footage around the logo while the
              signup stays anchored at the foot, close to the next section. */}
          <div style={{ flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          </div>

          {upcomingEvent && (
            <div style={{ marginTop: 34 }}>
              <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                <Button size="lg" variant="primary">Get tickets</Button>
              </a>
            </div>
          )}

          <HeroSignup />
        </div>
      </section>

      {/* ── GALLERY STRIP ── */}
      <section className="rd-reveal rd-strip-section">
        <GalleryStrip
          footer={<Link href="/gallery"><Button size="md" variant="secondary">Enter the gallery</Button></Link>}
        >
          <div className="rd-strip-head">
            <div>
              <p style={{ ...eyebrow, margin: '0 0 18px' }}>On the floor</p>
              <h2 style={{ ...sectionHeading, margin: 0 }}>
                MOMENTS FROM<br />THE DARK
              </h2>
            </div>
          </div>
        </GalleryStrip>
      </section>

      {/* ── RECENT NIGHTS ── */}
      <EventCarousel events={recentNights} />

      {/* ── NEXT UPCOMING EVENT ── only while a night is on sale; with nothing
          scheduled the section is left out rather than filled with a placeholder. */}
      {upcomingEvent && (
        <section className="rd-reveal" style={{ padding: sectionPad }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <p style={eyebrow}>Next upcoming event</p>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <UpcomingEvent />
          </div>
        </section>
      )}

      {/* ── CLOSING CTA ── */}
      <section
        className="rd-reveal"
        style={{ position: 'relative', padding: 'clamp(90px,14vh,170px) clamp(20px,5%,64px)', textAlign: 'center', borderTop: '1px solid var(--border)', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(90% 120% at 50% 100%, rgba(139,92,246,0.18) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-techno)',
              fontStretch: '125%',
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 18px',
              lineHeight: 0.95,
              fontSize: 'clamp(2.4rem,6vw,5rem)',
              textShadow: '0 0 40px rgba(52,231,222,0.3)',
            }}
          >
            FIND THE<br />FREQUENCY
          </h2>
          {upcomingEvent && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(12px,1.5vw,15px)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 34px' }}>
              {`${upcomingEvent.title} · ${upcomingEvent.date} · ${upcomingEvent.venue}`}
            </p>
          )}
          {upcomingEvent ? (
            <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="primary">Get tickets</Button>
            </a>
          ) : (
            <Link href="/events"><Button size="lg" variant="primary">See past nights</Button></Link>
          )}
        </div>
      </section>
    </main>
  );
}
