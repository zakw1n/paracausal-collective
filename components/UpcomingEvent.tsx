import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/ds/Badge';
import Button from '@/components/ds/Button';
import { PLACEHOLDER_IMAGE, TICKETS_URL, upcomingEvent } from '@/lib/site';

/**
 * Hero for the next night, or an announcement placeholder when nothing is
 * scheduled. `minHeight` differs between home and events.
 */
export default function UpcomingEvent({ minHeight = 'clamp(340px,52vh,460px)' }: { minHeight?: string }) {
  if (!upcomingEvent) return <NoUpcomingEvent minHeight={minHeight} />;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--r-lg)',
        background: '#000',
        minHeight,
        boxShadow: 'var(--glow-soft)',
      }}
    >
      <Image
        src={upcomingEvent.banner}
        alt=""
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1200px"
        style={{ objectFit: 'cover', opacity: 0.55 }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,6,10,0.3) 0%, rgba(5,6,10,0.5) 40%, rgba(5,6,10,0.95) 100%)',
        }}
      />

      <div style={{ position: 'relative', padding: 'clamp(28px,5vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight }}>
        <div style={{ marginBottom: 18 }}>
          <Badge tone="live" dot>On sale now</Badge>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-techno)',
            fontStretch: '125%',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 14px',
            lineHeight: 0.92,
            fontSize: 'clamp(2.4rem,6.5vw,5rem)',
            textShadow: '0 0 40px rgba(52,231,222,0.3)',
          }}
        >
          {upcomingEvent.title}
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(12px,1.5vw,15px)',
            letterSpacing: 'var(--ls-wider)',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 18px',
            marginBottom: 28,
          }}
        >
          <span>{upcomingEvent.date}</span>
          <span style={{ color: 'var(--border-strong)' }}>·</span>
          <span>{upcomingEvent.venue}</span>
          <span style={{ color: 'var(--border-strong)' }}>·</span>
          <span>{upcomingEvent.time}</span>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href={TICKETS_URL} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
            <Button size="lg" variant="primary">Get tickets on Quicket</Button>
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-wide)', color: 'var(--text-secondary)' }}>
            {upcomingEvent.meta}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Shown when no night is scheduled — never a ticket link to a finished event. */
function NoUpcomingEvent({ minHeight }: { minHeight: string }) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--r-lg)',
        background: 'var(--pc-abyss, #0A0C12)',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: 'clamp(28px,5vw,56px)',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, background: 'var(--pc-grad-aura)', opacity: 0.07 }}
      />

      <Image
        src={PLACEHOLDER_IMAGE}
        alt=""
        width={64}
        height={64}
        style={{ position: 'relative', objectFit: 'contain', opacity: 0.4, filter: 'drop-shadow(0 0 18px rgba(52,231,222,0.35))' }}
      />

      <h2
        style={{
          position: 'relative',
          fontFamily: 'var(--font-techno)',
          fontStretch: '125%',
          fontWeight: 800,
          color: '#fff',
          margin: 0,
          lineHeight: 0.95,
          fontSize: 'clamp(1.8rem,5vw,3.4rem)',
          textTransform: 'uppercase',
        }}
      >
        Next night<br />to be announced
      </h2>

      <p
        style={{
          position: 'relative',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-xs)',
          letterSpacing: 'var(--ls-wider)',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        Follow us for the drop
      </p>

      <Link href="/events" style={{ position: 'relative', textDecoration: 'none' }}>
        <Button size="md" variant="secondary">See past nights</Button>
      </Link>
    </div>
  );
}
