import type { Metadata } from 'next';
import EventTile from '@/components/EventTile';
import UpcomingEvent from '@/components/UpcomingEvent';
import { pastEvents } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Events — Paracausal',
  description: 'Nights & history. Upcoming shows and the Paracausal archive.',
};

const divider = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-widest)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  margin: 0,
} as const;

export default function EventsPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--pc-cyan)', margin: '0 0 16px' }}>
        Events
      </p>
      <h1 style={{ fontFamily: 'var(--font-techno)', fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 0.95, fontSize: 'clamp(2.6rem,8vw,6rem)' }}>
        NIGHTS &amp;<br /><span style={{ color: 'var(--text-faint)' }}>HISTORY</span>
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 20px' }}>
        <p style={divider}>Upcoming</p>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <UpcomingEvent minHeight="320px" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '64px 0 24px' }}>
        <p style={divider}>Past nights</p>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {pastEvents.map((event) => (
          <EventTile key={event.title} event={event} />
        ))}
      </div>
    </main>
  );
}
