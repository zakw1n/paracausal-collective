import Image from 'next/image';
import Badge from '@/components/ds/Badge';
import Button from '@/components/ds/Button';
import { TICKETS_URL, upcomingEvent } from '@/lib/site';

/** Hero banner for the next night. `minHeight` differs between home and events. */
export default function UpcomingEvent({ minHeight = 'clamp(340px,52vh,460px)' }: { minHeight?: string }) {
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
