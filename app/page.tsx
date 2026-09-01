import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ds/Button';
import EventTile from '@/components/EventTile';
import UpcomingEvent from '@/components/UpcomingEvent';
import { TICKETS_URL, pastEvents, upcomingEvent } from '@/lib/site';

const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-xs)',
  letterSpacing: 'var(--ls-widest)',
  textTransform: 'uppercase',
  color: 'var(--pc-cyan)',
  margin: 0,
} as const;

const sectionPad = 'clamp(70px,10vh,120px) clamp(20px,5vw,64px)';

export default function Home() {
  return (
    <main>
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '104px clamp(20px,5vw,64px) 56px',
          }}
        >
          <p
            style={{
              ...eyebrow,
              fontSize: 'clamp(11px,1.4vw,14px)',
              margin: '0 0 22px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span>Cape Town</span>
            <span style={{ color: 'var(--pc-green)' }}>·</span>
            <span>Est. 2023</span>
          </p>

          <Image
            src="/logo.png"
            alt="paracausal"
            width={860}
            height={144}
            sizes="(max-width: 956px) 90vw, 860px"
            priority
            style={{ width: 'min(90%,860px)', height: 'auto', objectFit: 'contain', display: 'block', margin: 0 }}
          />

          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.7, margin: '18px 0 0', maxWidth: '48ch' }}>
            A collective pushing high-energy psytrance to a generation chasing deeper realms of consciousness.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 38, animation: 'rd-rise .9s var(--ease-out) both' }}>
            <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="primary">Get tickets</Button>
            </a>
            <Link href="/events"><Button size="lg" variant="secondary">Upcoming events</Button></Link>
            <Link href="/about"><Button size="lg" variant="secondary">Our story</Button></Link>
          </div>
        </div>
      </section>

      {/* ── NEXT UPCOMING EVENT ── */}
      <section className="rd-reveal" style={{ padding: sectionPad }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <p style={eyebrow}>Next upcoming event</p>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <UpcomingEvent />
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="rd-reveal" style={{ position: 'relative', padding: 'clamp(80px,12vh,140px) clamp(20px,5vw,64px)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--pc-grad-nebula)' }} />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 760 }}>
            <p style={{ ...eyebrow, margin: '0 0 26px' }}>Who we are</p>
            <h2
              style={{
                fontFamily: 'var(--font-techno)',
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 26px',
                lineHeight: 1,
                fontSize: 'clamp(2.2rem,5vw,4rem)',
                letterSpacing: '0.01em',
              }}
            >
              ENTER THE<br />AFTERLIGHT
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.7, maxWidth: '52ch', margin: '0 0 20px' }}>
              Darker frequencies for deeper realms. What started as a group of friends chasing the wonders of psychedelic
              music quickly grew into a key player in psytrance adoption in Cape Town.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: 1.7, maxWidth: '52ch', margin: '0 0 34px' }}>
              Paracausal began with a vision — to create a space where people can experience the freedom of psytrance, and
              liberate themselves to the music.
            </p>
            <Link href="/about"><Button size="md" variant="neon">Read our story</Button></Link>
          </div>
        </div>
      </section>

      {/* ── RECENT NIGHTS ── */}
      <section className="rd-reveal" style={{ padding: sectionPad }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
            <div>
              <p style={{ ...eyebrow, margin: '0 0 14px' }}>The archive</p>
              <h2 style={{ fontFamily: 'var(--font-techno)', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1, fontSize: 'clamp(2rem,4.5vw,3.4rem)' }}>
                RECENT NIGHTS
              </h2>
            </div>
            <Link href="/events"><Button size="md" variant="secondary">All events</Button></Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {pastEvents.slice(0, 3).map((event) => (
              <EventTile key={event.title} event={event} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY TEASER ── */}
      <section className="rd-reveal" style={{ position: 'relative', padding: sectionPad, borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
        <div className="rd-split" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="rd-card" style={{ position: 'relative', aspectRatio: '16 / 10', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#000' }}>
            <video
              src="/gallery/skorgen-loop.mp4"
              muted
              loop
              autoPlay
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,6,10,0) 55%, rgba(5,6,10,0.75) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 18, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: '#fff' }}>
              ZDLCK B2B Skorgen · Apr 2026
            </div>
          </div>

          <div>
            <p style={{ ...eyebrow, margin: '0 0 18px' }}>On the floor</p>
            <h2 style={{ fontFamily: 'var(--font-techno)', fontWeight: 700, color: '#fff', margin: '0 0 20px', lineHeight: 1, fontSize: 'clamp(2rem,4.5vw,3.4rem)' }}>
              MOMENTS FROM<br />THE DARK
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.7, maxWidth: '46ch', margin: '0 0 30px' }}>
              Sets, crowds, and the spaces between. A living archive of every threshold we&rsquo;ve crossed together.
            </p>
            <Link href="/gallery"><Button size="md" variant="secondary">Enter the gallery</Button></Link>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section
        className="rd-reveal"
        style={{ position: 'relative', padding: 'clamp(90px,14vh,170px) clamp(20px,5vw,64px)', textAlign: 'center', borderTop: '1px solid var(--border)', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(90% 120% at 50% 100%, rgba(139,92,246,0.18) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-techno)',
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
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(12px,1.5vw,15px)', letterSpacing: 'var(--ls-wider)', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 34px' }}>
            {`Afterlight V · ${upcomingEvent.date} · EVØL Nightclub`}
          </p>
          <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <Button size="lg" variant="primary">Get tickets</Button>
          </a>
        </div>
      </section>
    </main>
  );
}
