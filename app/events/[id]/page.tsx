import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArtistCard from '@/components/ArtistCard';
import EventMediaGrid from '@/components/EventMediaGrid';
import Tag from '@/components/ds/Tag';
import { eyebrowMuted as divider } from '@/components/ds/styles';
import { TICKETS_URL, artistsForEvent, eventById, events, pageTitle, pageMeta } from '@/lib/site';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const event = eventById(id);
  if (!event) return { title: pageTitle('Event not found') };

  return {
    ...pageMeta({
      title: pageTitle(event.title),
      description: `${event.title} · ${event.date} · ${event.venue}`,
      path: `/events/${event.id}`,
      image: event.banner,
    }),
  };
}

const meta = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--fs-2xs)',
  letterSpacing: 'var(--ls-wider)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
} as const;

function SectionHeading({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '56px 0 24px' }}>
      <p style={divider}>{children}</p>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

export default async function EventPage({ params }: Params) {
  const { id } = await params;
  const event = eventById(id);
  if (!event) notFound();

  const lineup = artistsForEvent(event.id);
  const upcoming = event.status === 'upcoming';

  return (
    <main style={{ padding: '120px clamp(20px,5vw,64px) 110px', maxWidth: 1200, margin: '0 auto' }}>
      <Link href="/events" style={{ ...meta, color: 'var(--pc-cyan)', textDecoration: 'none' }}>
        ← All events
      </Link>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--r-lg)',
          background: '#000',
          minHeight: 'clamp(300px,46vh,420px)',
          boxShadow: 'var(--glow-soft)',
          margin: '20px 0 0',
        }}
      >
        <Image
          src={event.banner}
          alt={event.title}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover', opacity: 0.6 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,6,10,0.1) 30%, rgba(5,6,10,0.94) 100%)' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 'clamp(300px,46vh,420px)', padding: 'clamp(22px,4vw,34px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <Tag color={upcoming ? 'cyan' : 'muted'} variant={upcoming ? 'solid' : 'outline'} size="sm">
              {upcoming ? 'Upcoming' : 'Archive'}
            </Tag>
            <Tag color="violet" variant="outline" size="sm">{event.genre}</Tag>
          </div>

          <p style={{ ...meta, margin: '0 0 8px' }}>{event.date}</p>
          <h1
            style={{
              fontFamily: 'var(--font-techno)',
              fontStretch: '125%',
              fontWeight: 800,
              color: '#fff',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 0.98,
              fontSize: 'clamp(2rem,6vw,4.2rem)',
            }}
          >
            {event.title}
          </h1>

          {upcoming && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 20 }}>
              <a
                href={TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 600,
                  letterSpacing: 'var(--ls-wider)',
                  textTransform: 'uppercase',
                  color: 'var(--pc-black)',
                  background: 'var(--pc-cyan)',
                  boxShadow: 'var(--glow-cyan)',
                  borderRadius: 'var(--r-sm)',
                  padding: '13px 24px',
                  textDecoration: 'none',
                  lineHeight: 1,
                }}
              >
                Get tickets
              </a>
              {event.meta && <span style={{ ...meta, color: 'var(--text-faint)' }}>{event.meta}</span>}
            </div>
          )}
        </div>
      </div>

      <SectionHeading>Lineup</SectionHeading>
      {lineup.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
          {lineup.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--r-lg)', padding: 'clamp(32px,6vw,56px) 24px', textAlign: 'center' }}>
          <p style={{ ...divider, color: 'var(--text-faint)' }}>
            {upcoming ? 'Lineup to be announced' : 'Lineup not yet archived'}
          </p>
        </div>
      )}

      <SectionHeading>Location</SectionHeading>
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'clamp(20px,4vw,28px)' }}>
        <p style={{ fontFamily: 'var(--font-techno)', fontStretch: '125%', fontWeight: 700, fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', color: '#fff', textTransform: 'uppercase', margin: '0 0 8px' }}>
          {event.venue}
        </p>
        {event.address && <p style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)', margin: 0 }}>{event.address}</p>}
        {event.time && <p style={{ ...meta, letterSpacing: 'var(--ls-wide)', color: 'var(--pc-cyan)', margin: '12px 0 0' }}>{event.time}</p>}
      </div>

      <SectionHeading>Media</SectionHeading>
      <EventMediaGrid media={event.media ?? []} eventTitle={event.title} />
    </main>
  );
}
