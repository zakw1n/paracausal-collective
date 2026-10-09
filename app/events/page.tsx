import type { Metadata } from 'next';
import EventTile from '@/components/EventTile';
import UpcomingEvent from '@/components/UpcomingEvent';
import { pageTitle, pastEvents } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import { eyebrowMuted as divider } from '@/components/ds/styles';

export const metadata: Metadata = {
  title: pageTitle('Events'),
  description: 'Nights & history. Upcoming shows and the Paracausal archive.',
};

export default function EventsPage() {
  return (
    <main className="rd-reveal" style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
      <PageHeader eyebrow="Nights & history" title="EVENTS" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 20px' }}>
        <p style={divider}>Upcoming</p>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <UpcomingEvent minHeight="320px" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '64px 0 24px' }}>
        <p style={divider}>Past nights</p>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div className="rd-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(420px,1fr))', gap: 0 }}>
        {pastEvents.map((event) => (
          <EventTile key={event.title} event={event} seamless />
        ))}
      </div>
    </main>
  );
}
