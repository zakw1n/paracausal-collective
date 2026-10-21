import type { Metadata } from 'next';
import HeroSignup from '@/components/HeroSignup';
import UpcomingEvent from '@/components/UpcomingEvent';
import PageHeader from '@/components/PageHeader';
import { pageTitle, upcomingEvent, pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: pageTitle('Events'),
  description: 'The next Paracausal night. Join the list to get the date before it drops.',
  path: '/events',
});

/* The page is just the next night: its ticket card while one is on sale,
   otherwise a "coming soon" line and the mailing-list signup. */
export default function EventsPage() {
  if (upcomingEvent) {
    return (
      <main style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
        <UpcomingEvent minHeight="320px" />
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100svh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px clamp(20px,5vw,64px) 110px',
      }}
    >
      <PageHeader title="NEXT EVENT COMING SOON" gap={0} />
      {/* The heading stays where every page has it; the signup centres in the space below. */}
      <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <HeroSignup />
      </div>
    </main>
  );
}
